import React from 'react';
import { MapRef } from 'react-map-gl';
import { createWithEqualityFn } from 'zustand/traditional';
import { IGeolocation } from './MapProvider';

export interface ICenter {
  latitude: number;
  longitude: number;
}

export type MapContextType = {
  map: React.MutableRefObject<MapRef | null>;
  planTo: (data: IGeolocation) => void;
};

export const useMapStore = createWithEqualityFn<MapContextType>(
  (set, get) => ({
    map: React.createRef<MapRef | null>(),
    planTo(data) {
      const { latitude, longitude, zoom, animate } = data;
      const map = get().map;
      if (map.current)
        map.current.flyTo({
          center: [longitude, latitude],
          zoom,
          animate,
        });
    },
  }),
  Object.is
);
