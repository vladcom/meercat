import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { MapState } from './reducer';

export const selectMap = (state: RootState): MapState => state.map;

/**
 * If all elements in such object contains true - map loaded correctly
 */
export const isMapFinallyMountedSelector = createSelector(selectMap, (state) =>
  Object.values(state.mapLoadingState).every((_state) => {
    return _state;
  })
);

export const isGeoCordsGotten = createSelector(
  selectMap,
  (state) => state.mapLoadingState.isGeoCordsGotten
);
export const isMapMountedSelector = createSelector(
  selectMap,
  (state) => state.mapLoadingState.isMounted
);
