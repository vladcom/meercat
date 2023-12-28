/* eslint-disable react-hooks/exhaustive-deps */
import { createSelector } from '@reduxjs/toolkit';
import mapboxgl from 'mapbox-gl';
import { PropsWithChildren, memo, useCallback, useEffect } from 'react';
import { ViewStateChangeEvent } from 'react-map-gl';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { selectDashboard } from 'src/redux/dashboard';
import { setReportedPosition } from 'src/redux/dashboard/reducer';
import { isGeoCordsGotten } from 'src/redux/map';
import { useMapStore } from 'src/view/components/MapContext';
import { shallow } from 'zustand/shallow';
import Mapbox from './Mapbox';
import MapboxAim from './components/Aim';
import MapboxBottomContent from './components/BottomContent';
import MapboxUserGeoControl from './components/UserGeoControl';
import { LowTileSourceId } from 'src/helpers/Incident';

const selectCenter = createSelector(selectDashboard, (state) => state.mapCenter);

function withMapReadyToShow<P>(WrappedComponent: React.ComponentType<P>) {
  return memo(function withProps(props: P): JSX.Element | null {
    const isGeoCords = useAppSelector(isGeoCordsGotten);
    //Prevent this component to be rendered multiple times. Since we need to understand if previous or next state became NOT null we didnt need to listen else changes
    const center = useAppSelector(selectCenter, (prev, next) => {
      if ((!prev && next) || (prev && !next)) return false;
      return true;
    });

    if (isGeoCords && center) {
      return <WrappedComponent {...(props as React.PropsWithChildren<P>)} />;
    }
    return <></>;
  });
}

const ReportMapbox: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

  const onLoad = useCallback(
    (event: mapboxgl.MapboxEvent<undefined>) => {
      const mapInstance = event.target;
      const mapCenter = mapInstance.getCenter();
      dispatch(setReportedPosition({ lat: mapCenter.lat, lng: mapCenter.lng }));
    },
    [dispatch]
  );

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      const viewState = evt.viewState;
      dispatch(setReportedPosition({ lat: viewState.latitude, lng: viewState.longitude }));
    },
    [dispatch]
  );

  return (
    <Mapbox
      minZoom={16}
      maxZoom={19}
      onLoad={onLoad}
      onMove={onMove}
      style={{
        width: '100%',
        height: '35vh',
      }}
    >
      {children}
      <MapboxAim />
    </Mapbox>
  );
};

const MainMapbox: React.FC<PropsWithChildren> = ({ children }) => {
  const { planTo, map } = useMapStore(
    (state) => ({ planTo: state.planTo, map: state.map }),
    shallow
  );
  const history = useHistory();

  const onClick = useCallback((ev: mapboxgl.MapLayerMouseEvent) => {
    const element = ev.features && ev.features[0];
    if (!element) return;
    ev.originalEvent.stopPropagation();
    const geometry = element?.geometry;
    const coordinates = (geometry as { coordinates: number[] })?.coordinates;
    const properties = element.properties;
    if (properties?.id) {
      history.push(`/${properties.id}`);
      // Incident.open({
      //   dispatch,
      //   geoJSON: GeoJSONFabric.createFeature({
      //     properties: { id: properties?.id, type: properties?.type },
      //     cords: { latitude: coordinates[1], longitude: coordinates[0] },
      //   }),
      // });
      planTo({ latitude: coordinates[1], longitude: coordinates[0], zoom: 20 });
    }
  }, []);

  return (
    <Mapbox
      ref={map}
      minZoom={2.5}
      maxZoom={17.5}
      interactiveLayerIds={['low_level_tiles']}
      onClick={onClick}
      style={{
        width: '100%',
        height: 'calc(var(--app-height) - 70px)',
      }}
    >
      {children}
      <MapboxUserGeoControl />
      <MapboxBottomContent />
    </Mapbox>
  );
};

export default Object.assign(memo(withMapReadyToShow(Mapbox)), {
  Report: withMapReadyToShow(memo(ReportMapbox)),
  Main: withMapReadyToShow(memo(MainMapbox)),
});
