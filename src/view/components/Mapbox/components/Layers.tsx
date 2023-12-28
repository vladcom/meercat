import { createSelector } from '@reduxjs/toolkit';
import { memo, useMemo } from 'react';
import { HeatmapLayer, Layer, Source } from 'react-map-gl';
import { shallowEqual } from 'react-redux';
import { ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION } from 'src/constants/map';
import { useAppSelector } from 'src/hooks/useRedux';
import { selectDashboard, selectDashboardType } from 'src/redux/dashboard';
import { heatmapLayer1, heatmapLayer2, heatmapLayerUsers } from '../heatmapSettings';
import LowTilesLayer from './LowTilesLayer';
import { useGetIncidentTypesQuery } from 'src/redux/incident';

const selectMapboxLayers = createSelector(selectDashboard, (state) => ({
  zoom: state.mapZoom,
  isUserDensity: state.isUserDensity,
}));

const realtimeHeatmapTilesLink = `${window.location.origin}/tiles/realtime-map?z={z}&x={x}&y={y}`;

function MapboxLayers() {
  const { isUserDensity } = useAppSelector(selectMapboxLayers, shallowEqual);
  const { data: incidentTypes } = useGetIncidentTypesQuery(undefined);
  const types = useAppSelector(selectDashboardType);

  //If some filter specified provide it in this list. If provided KEY exist - show element
  const mapboxHexCountFilter = useMemo(() => {
    return ['any', ...types.map((type) => ['has', type])];
  }, [types]);

  const paintHelper = useMemo(() => {
    if (!incidentTypes) return 0;

    if (types.length === 0)
      return ['+', ...incidentTypes.map((incident) => ['coalesce', ['get', incident._id], 0])];
    const createIncidentsFromList = incidentTypes
      .filter((incidentType) => {
        return types.includes(incidentType._id);
      })
      .map((incident) => ['coalesce', ['get', incident._id], 0]);
    return ['+', ...createIncidentsFromList];
  }, [incidentTypes, types]);

  const heatmapLayer1Properties = useMemo(() => {
    return {
      ...heatmapLayer1,
      paint: {
        ...heatmapLayer1?.paint,
        'heatmap-weight': [
          'case',
          ['<', paintHelper, 10],
          0.5,
          ['<=', paintHelper, 20],
          0.5,
          ['>', paintHelper, 20],
          0.5,
          0.5,
        ],
      },
    } as HeatmapLayer;
  }, [paintHelper]);
  const heatmapLayer2Properties = useMemo(() => {
    return {
      ...heatmapLayer2,
      paint: {
        ...heatmapLayer2?.paint,
        'heatmap-weight': [
          'case',
          ['<', paintHelper, 1],
          0.09,
          ['<=', paintHelper, 5],
          0.5,
          ['>', paintHelper, 10],
          1,
          1,
        ],
      },
    } as HeatmapLayer;
  }, [paintHelper]);

  if (isUserDensity) {
    return (
      <Source
        key='heatmap3'
        id='heatmap3'
        type='vector'
        url='mapbox://vladsegeda.user_test'
        maxzoom={22}
        minzoom={0}
      >
        <Layer {...heatmapLayerUsers} />
      </Source>
    );
  } else {
    return (
      <>
        <LowTilesLayer />
        <Source
          key='heatmap_our_two'
          id='heatmap_our_two'
          minzoom={0}
          maxzoom={ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION}
          type='vector'
          tiles={[realtimeHeatmapTilesLink]}
        >
          <Layer
            {...heatmapLayer1Properties}
            id='heatmap_our_one'
            source-layer='geojsonLayer'
            filter={types.length > 0 ? mapboxHexCountFilter : ['all', true]}
          />
          <Layer
            {...heatmapLayer2Properties}
            id='heatmap_our_two'
            source-layer='geojsonLayer'
            filter={types.length > 0 ? mapboxHexCountFilter : ['all', true]}
          />
        </Source>
        <Source
          key='heatmap1'
          id='heatmap1'
          type='vector'
          url='mapbox://vladsegeda.user_test'
          minzoom={0}
          maxzoom={ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION}
        >
          <Layer
            {...heatmapLayer1Properties}
            filter={types.length > 0 ? mapboxHexCountFilter : ['all', true]}
          />
          <Layer
            {...heatmapLayer2}
            filter={types.length > 0 ? mapboxHexCountFilter : ['all', true]}
          />
        </Source>
      </>
    );
  }
}

export default memo(MapboxLayers);
