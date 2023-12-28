import { createSelector } from '@reduxjs/toolkit';
import { SymbolLayout } from 'mapbox-gl';
import { memo, useMemo } from 'react';
import { Layer, Source } from 'react-map-gl';
import {
  ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION,
  ZOOM_FOR_INCIDENT_PREVIEW,
} from 'src/constants/map';
import { LowTileSourceId } from 'src/helpers/Incident';
import { useAppSelector } from 'src/hooks/useRedux';
import { selectDashboardType, selectHoursFilterInput } from 'src/redux/dashboard';
import {
  selectedOldIncident,
  useGetIncidentStylesQuery,
  useGetSoftDeletedIncidentQuery,
} from 'src/redux/incident';

const layoutProperty: SymbolLayout = {
  'symbol-sort-key': ['to-number', ['get', 'weight']],
  'icon-allow-overlap': ['step', ['zoom'], false, ZOOM_FOR_INCIDENT_PREVIEW - 1, true],
};

const selectHoursFilterInputs = createSelector(
  selectHoursFilterInput,
  (hours) =>
    ({
      '24': 'OneDay',
      '48': 'TwoDay',
      '72': 'ThreeDay',
      '168': 'Week',
      '744': 'Month',
      all: 'Year',
    }[hours])
);

const PreselectedLayer = memo(function PreselectedLayer() {
  const oldIncident = useAppSelector(selectedOldIncident);
  const { data, isSuccess } = useGetIncidentStylesQuery(undefined);
  // const circlePlaceholder = useMemo(() => {
  //   const coords = oldIncident?.geometry;
  //   return GeoJSONFabric.createFeature({
  //     cords: coords
  //       ? {
  //           latitude: coords.coordinates[1],
  //           longitude: coords.coordinates[0],
  //         }
  //       : undefined,
  //     properties: {},
  //   });
  // }, [oldIncident?.geometry?.coordinates[0], oldIncident?.geometry?.coordinates[1]]);
  // console.log(circlePlaceholder);
  if (isSuccess)
    return (
      <>
        {/* <Source
        key='low_level_tiles_selected_circle'
        id='low_level_tiles_selected_circle'
        type='geojson'
        data={circlePlaceholder}
      >
        <Layer
          id='low_level_tiles_selected_circle'
          type='circle'
          minzoom={ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION}
          paint={{
            'circle-color': '#ffc90e',
            'circle-radius': 30,
          }}
        />
      </Source> */}
        {oldIncident && (
          <Source
            key='low_level_tiles_selected'
            id='low_level_tiles_selected'
            type='geojson'
            data={oldIncident}
          >
            <Layer
              id='low_level_tiles_selected'
              type='symbol'
              minzoom={ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION}
              layout={{ ...layoutProperty, 'icon-image': data }}
              beforeId='low_level_tiles_selected_circle'
            />
          </Source>
        )}
      </>
    );
  return <></>;
});

function LowTiles() {
  const { data: deletedIncidents } = useGetSoftDeletedIncidentQuery();
  const hoursFilterInput = useAppSelector(selectHoursFilterInputs);
  const type = useAppSelector(selectDashboardType);

  const { source: mapboxFormatedFilter } = useMemo(() => {
    const deletedIds = deletedIncidents?.map((val) => val._id) ?? [];
    const base: any[] = ['all'];

    if (type.length > 0) {
      base.push(['match', ['get', 'type'], type, true, false]);
    }
    if (deletedIds.length > 0) {
      //If this element is not in this link - show
      base.push(['match', ['get', 'id'], deletedIds, false, true]);
    }

    if (base.length === 1) {
      base.push(true);
    }

    return {
      isFilter: type.length > 0 || deletedIds.length > 0,
      source: base,
    };
  }, [type, deletedIncidents]);

  const { data, isSuccess } = useGetIncidentStylesQuery(undefined);

  if (isSuccess)
    return (
      <>
        <PreselectedLayer />
        <Source
          key={LowTileSourceId}
          id={LowTileSourceId}
          promoteId='id'
          type='vector'
          minzoom={ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION}
          tiles={[
            `${window.location.origin}/tiles/realtime-map/v2/min?z={z}&x={x}&y={y}&period=${hoursFilterInput}`,
          ]}
        >
          <Layer
            id={LowTileSourceId}
            source-layer='geojsonLayer'
            type='symbol'
            minzoom={ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION}
            filter={mapboxFormatedFilter}
            layout={{
              ...layoutProperty,
              'icon-image': data
            }}
          />
        </Source>
      </>
    );
  return <></>;
}

export default memo(LowTiles);
