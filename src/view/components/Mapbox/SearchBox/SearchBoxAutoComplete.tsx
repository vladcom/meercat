import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormikContext } from 'formik';
import { memo, useCallback, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import Autocomplete from '../../Autocomplete';
import { useMapStore } from '../../MapContext';
import { ISearchBox, SearchBoxInitialValue } from './SearchBox';

const mapOptions = { types: ['geocode'] } as never;

const autocompleteProps = {
  filterOptions(x: google.maps.places.AutocompletePrediction[]) {
    return x.filter(
      (i) =>
        i?.types?.includes('geocode') ||
        i?.types?.includes('locality') ||
        i?.types?.includes('political') ||
        i?.types?.includes('address') ||
        i?.types?.includes('cities')
    );
  },
};
const TextFieldProps = {
  placeholder: 'City, Neighborhood, Zip',
  InputProps: { endAdornment: <FontAwesomeIcon icon={solid('magnifying-glass')} /> },
};

function useRemoveIncidentAfterFlyTo(callback: () => void) {
  const map = useMapStore((state) => state.map, shallow);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mapInstance = map.current;
    const fn = ({
      originalEvent,
    }: mapboxgl.MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
      mapboxgl.EventData) => {
      if (originalEvent)
        //moveend
        return;
      //flytto
      callback();
      ref?.current?.blur();
    };
    mapInstance?.on('moveend', fn);
    return () => {
      mapInstance?.off('moveend', fn);
    };
  }, [callback, map]);
  return ref;
}

const SearchBoxAutocomplete = () => {
  const { values, setFieldValue, submitForm } = useFormikContext<ISearchBox>();

  const ref = useRemoveIncidentAfterFlyTo(() => {
    setFieldValue('address', SearchBoxInitialValue.address);
  });

  const onAddressGetting = useCallback(
    (address: string) => {
      setFieldValue('address', address);
    },
    [setFieldValue]
  );
  const onCordsGetting = useCallback(
    async (lat: number, lng: number) => {
      setFieldValue('latitude', lat);
      setFieldValue('longitude', lng);
    },
    [setFieldValue]
  );
  useEffect(() => {
    if (values.latitude !== 0 && values.longitude !== 0) {
      submitForm();
    }
  }, [submitForm, values?.latitude, values?.longitude]);

  return (
    <Autocomplete
      ref={ref}
      searchName='search-box'
      address={values.address ?? ''}
      onAddressGetting={onAddressGetting}
      onCordsGetting={onCordsGetting}
      mapOptions={mapOptions}
      defaultAutocompleteProps={autocompleteProps}
      textFieldProps={TextFieldProps}
      isGeoIcon
      isShouldStoreHistory
    />
  );
};
export default memo(SearchBoxAutocomplete);
