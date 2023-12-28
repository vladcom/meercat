/* eslint-disable react-hooks/exhaustive-deps */
import { createSelector } from '@reduxjs/toolkit';
import { forwardRef, memo, useCallback } from 'react';
import type { MapProps, MapRef } from 'react-map-gl';
import Map, { MapboxEvent, ViewStateChangeEvent } from 'react-map-gl';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { selectDashboard } from 'src/redux/dashboard';
import { onChangeMapBounds, onChangeMapCenter } from 'src/redux/dashboard/reducer';
import { setMapLoader } from 'src/redux/map';
import MapboxLayers from './components/Layers';
import MapboxMyAddress from './components/MyAddress';

type MapboxProps = MapProps;

export type IBounds = {
  north: number;
  east: number;
  south: number;
  west: number;
};

const getBounds = (b: mapboxgl.LngLatBounds): IBounds => {
  const ne = b.getNorthEast();
  const sw = b.getSouthWest();
  const north = ne.lat;
  const east = ne.lng;
  const south = sw.lat;
  const west = sw.lng;
  return { north, east, south, west };
};

const selectMapbox = createSelector(selectDashboard, (state) => ({
  zoom: state.mapZoom,
  center: state.mapCenter,
}));

const Mapbox = forwardRef<MapRef, MapboxProps>(function MapBox({ children, ...props }, ref) {
  const dispatch = useAppDispatch();

  const { center, zoom } = useAppSelector(selectMapbox, shallowEqual);
  const onLoad = useCallback(
    (mapFromLoad: MapboxEvent<undefined>) => {
      const mapInstance = mapFromLoad.target;
      mapInstance.dragRotate.disable();
      mapInstance.touchZoomRotate.disableRotation();
      const mapCenter = mapInstance.getCenter();
      dispatch(onChangeMapCenter({ center: { lat: mapCenter.lat, lng: mapCenter.lng } }));
      const bounds = getBounds(mapInstance.getBounds());
      dispatch(onChangeMapBounds(bounds));
      dispatch(setMapLoader({ isMounted: true }));
      if (props.onLoad) {
        props.onLoad(mapFromLoad);
      }
    },
    [dispatch, props?.onLoad]
  );
  const onChangeMap = useCallback(
    (evt: ViewStateChangeEvent) => {
      const viewState = evt.viewState;
      const bounds = getBounds(evt.target.getBounds());
      dispatch(onChangeMapBounds(bounds));
      dispatch(
        onChangeMapCenter({
          center: { lat: viewState.latitude, lng: viewState.longitude },
          zoom: viewState.zoom,
        })
      );
      if (props.onMove) {
        props.onMove(evt);
      }
    },
    [dispatch, props?.onMove]
  );

  if (center)
    return (
      <>
        <Map
          {...props}
          ref={ref}
          initialViewState={{
            latitude: center.lat,
            longitude: center.lng,
            zoom,
            ...(props?.initialViewState ?? {}),
          }}
          onLoad={onLoad}
          reuseMaps
          dragRotate={false}
          onMove={onChangeMap}
          mapStyle='mapbox://styles/vladsegeda/cllmnhmuk00d901pe8jv4ew2g'
          // mapStyle='mapbox://styles/o-danylo-segefy/cllwk59ct00hs01qy7cv1gltt'
          // mapStyle='mapbox://styles/o-danylo-segefy/cll3x5giy00gl01p896ph64dr'
          mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX}
        >
          {children}
          <MapboxLayers />
          <MapboxMyAddress />
        </Map>
      </>
    );
  return <></>;
});

export default memo(Mapbox);
