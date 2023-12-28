import circle from '@turf/circle';
import React, { useMemo } from 'react';
import { Layer, Marker, Source } from 'react-map-gl';
import homeIcon from '../../../../static/img/home.svg';
import { IUserPlaceFormikValues } from '../../UserProfile/UserProfilePlaces/UserPlaceForm';

interface IUserPlaceMarker {
  placeData: IUserPlaceFormikValues;
}

const paint = {
  'fill-color': 'green',
  'fill-opacity': 0.2,
};

const UserPlaceMarker: React.FC<IUserPlaceMarker> = ({ placeData }) => {
  const { label, radius, latitude, longitude } = placeData;

  const circleIcon = useMemo(() => {
    let center: number[] = [];
    if (latitude && longitude) {
      center = [longitude, latitude];
    } else {
      return undefined;
    }

    return circle(center, radius ?? 10, { units: 'miles' });
  }, [longitude, latitude, radius]);

  return (
    <>
      <Marker anchor='bottom' latitude={latitude} longitude={longitude}>
        <img src={homeIcon} alt={label} />
      </Marker>
      {circleIcon && (
        <Source type='geojson' data={circleIcon}>
          <Layer type='fill' paint={paint} />
        </Source>
      )}
    </>
  );
};

export default UserPlaceMarker;
