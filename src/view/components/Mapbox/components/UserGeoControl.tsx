import useMediaQuery from '@mui/material/useMediaQuery';
import { memo } from 'react';
import { GeolocateControl } from 'react-map-gl';

function MapboxUserGeoControl() {
  const isMobile = useMediaQuery('(max-width:768px)');
  if (isMobile)
    return (
      <GeolocateControl trackUserLocation={true} positionOptions={{ enableHighAccuracy: true }} />
    );
  return <></>;
}
export default memo(MapboxUserGeoControl);
