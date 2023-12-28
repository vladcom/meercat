import { useFormikContext } from 'formik';
import { memo, useCallback } from 'react';
import Autocomplete from 'src/view/components/Autocomplete';
import { IAddCommunityFormikValues } from "./AddCommunityForm";

const mapOptions = {
  type: ['geocode', 'street_number', 'route', 'premise'],
  componentRestrictions: { country: 'us' },
  libraries: ['geocode'],
};

const autocompleteProps = {
  filterOptions(x: google.maps.places.AutocompletePrediction[]) {
    return x.filter(
      (i) =>
        i?.types?.includes('geocode') ||
        i?.types?.includes('locality') ||
        i?.types?.includes('political') ||
        i?.types?.includes('address') ||
        i?.types?.includes('cities') ||
        i?.types?.includes('premise') ||
        i?.types?.includes('street_number') ||
        i?.types?.includes('route')
    );
  },
};

const CommunityAutocompleteComponent: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<IAddCommunityFormikValues>();

  const onAddressGetting = useCallback(
    (address: string) => {
      setFieldValue('address', address);
    },
    [setFieldValue]
  );
  const onCordsGetting = useCallback(
    (lat: number, lng: number) => {
      setFieldValue('latitude', lat);
      setFieldValue('longitude', lng);
    },
    [setFieldValue]
  );
  return (
    <Autocomplete
      searchName='profile-autocomplete'
      address={values.address}
      onAddressGetting={onAddressGetting}
      onCordsGetting={onCordsGetting}
      mapOptions={mapOptions}
      defaultAutocompleteProps={autocompleteProps}
    />
  );
};

export default memo(CommunityAutocompleteComponent);
