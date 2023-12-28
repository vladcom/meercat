/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  CircularProgress,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import classNames from 'classnames';
import debounceFn from 'lodash/debounce';
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetMyLocationQuery, useLazyGetPlacePredictionsQuery } from 'src/redux/helpers';
import css from './GridElement.module.scss';
import { Stack } from './Storage';
type IAutoCompleteComponent = {
  searchName: string;
  address: string;
  mapOptions?: Partial<google.maps.places.AutocompletionRequest>;
  onCordsGetting: (lat: number, lng: number) => void;
  onAddressGetting: (address: string) => void;
  defaultAutocompleteProps?: Partial<
    AutocompleteProps<google.maps.places.AutocompletePrediction, undefined, undefined, undefined>
  >;
  textFieldProps?: TextFieldProps;
  isGeoIcon?: boolean;
  disabled?: boolean;
  isShouldStoreHistory?: boolean;
};

function useInputValue(address: string | null) {
  const [inputValue, setInputValue] = useState<string | null>(address ?? null);
  useEffect(() => {
    setInputValue(address && address.length > 0 ? address : null);
  }, [address]);
  return [inputValue, setInputValue] as const;
}

type Predictions = google.maps.places.AutocompletePrediction & {
  isFromHistory?: boolean;
};

const AutocompleteComponent = forwardRef<HTMLInputElement, IAutoCompleteComponent>(
  function AutocompleteComponent(
    {
      searchName,
      address,
      mapOptions = {},
      onAddressGetting,
      disabled = false,
      onCordsGetting,
      defaultAutocompleteProps = {},
      textFieldProps,
      isGeoIcon = false,
      isShouldStoreHistory = false,
    },
    passedRef
  ) {
    const ref = useRef(new Stack<Predictions>(searchName, 5));
    const [inputValue, setInputValue] = useInputValue(address ?? null);

    const [
      slowgetPlacePredictions,
      { data: placePredictions = [], isLoading: isPlacePredictionsLoading },
    ] = useLazyGetPlacePredictionsQuery({});
    const { data, isSuccess } = useGetMyLocationQuery({ address }, { skip: address?.length === 0 });

    useEffect(() => {
      if (data && isSuccess && data.location) {
        const { lat, lng } = data.location;
        if (lat && lng) {
          onCordsGetting(lat, lng);
        }
      }
    }, [isSuccess, data, onCordsGetting]);

    const getPlacePredictions = useCallback(debounceFn(slowgetPlacePredictions, 300), [
      slowgetPlacePredictions,
    ]);

    const onInputChange = useCallback(
      (_: React.SyntheticEvent<Element, Event>, newValue: string) => {
        if (address?.length > 0) {
          onAddressGetting('');
        }
        if (!_) return;
        getPlacePredictions({
          input: newValue,
          ...mapOptions,
        } as never);
        setInputValue(newValue);
      },
      [address, getPlacePredictions, mapOptions, onAddressGetting]
    );

    const onChange = useCallback(
      (e: React.ChangeEvent<unknown>, newValue: Predictions | null) => {
        if (!newValue) return;
        onAddressGetting(newValue.description);
        if (isShouldStoreHistory)
          ref.current.push({
            id: newValue?.place_id ?? '',
            data: { ...newValue, isFromHistory: true },
          });
      },
      [isShouldStoreHistory, onAddressGetting]
    );

    const getOptionLabel = useCallback(
      (option: Predictions) => (typeof option === 'string' ? option : option.description),
      []
    );
    const isOptionEqualToValue = useCallback(
      (
        option: google.maps.places.AutocompletePrediction,
        value: google.maps.places.AutocompletePrediction
      ) => option.place_id === value.place_id,
      []
    );

    const options: Predictions[] = useMemo(() => {
      if (isShouldStoreHistory) {
        return placePredictions?.length > 0 ? placePredictions : ref.current.getStack();
      }
      return placePredictions;
    }, [isShouldStoreHistory, placePredictions]);
    return (
      <Autocomplete
        // @ts-ignore
        freeSolo
        {...defaultAutocompleteProps}
        disablePortal
        autoHighlight
        handleHomeEndKeys
        disabled={disabled}
        autoComplete={false}
        id='combo-box-demo'
        onChange={onChange}
        filterSelectedOptions
        loadingText='Loading…'
        style={{ width: '100%' }}
        forcePopupIcon={false}
        inputValue={inputValue || ''}
        options={options ?? []}
        onInputChange={onInputChange}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              {...textFieldProps}
              size='small'
              margin='dense'
              InputProps={{
                ...params.InputProps,
                ...textFieldProps?.InputProps,
                inputRef: passedRef,
                endAdornment: (
                  <>
                    {isPlacePredictionsLoading ? (
                      <CircularProgress color='inherit' size={20} />
                    ) : null}
                    {textFieldProps?.InputProps?.endAdornment}
                  </>
                ),
              }}
            />
          );
        }}
        renderOption={(props, option: Predictions) => {
          const matches = option?.structured_formatting?.main_text_matched_substrings || [];
          const parts = parse(
            option?.structured_formatting?.main_text,
            matches.map((match) => [match.offset, match.offset + match.length])
          );

          return (
            <li {...props}>
              <Grid
                className={classNames(css.gridElement, {
                  [css['in-history']]: option?.isFromHistory,
                })}
                container
                alignItems='center'
              >
                {isGeoIcon && (
                  <Grid item sx={{ display: 'flex', width: 44 }}>
                    {option?.isFromHistory ? (
                      <CheckCircleOutlineIcon sx={{ color: 'text.secondary' }} />
                    ) : (
                      <LocationOnIcon sx={{ color: 'text.secondary' }} />
                    )}
                  </Grid>
                )}
                <Grid
                  item
                  sx={{
                    width: `calc(100% - ${isGeoIcon ? '44px' : '0px'})`,
                    wordWrap: 'break-word',
                  }}
                >
                  {parts?.map((part, index) => (
                    <Box
                      key={index}
                      component='span'
                      sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                    >
                      {part.text}
                    </Box>
                  ))}
                  <Typography variant='body2' color='text.secondary'>
                    {option?.structured_formatting?.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    );
  }
);

export default memo(AutocompleteComponent);
