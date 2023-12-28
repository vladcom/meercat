import { createSelector } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import { RootState } from '..';
import { useDebounceSelector } from '../heleper';
import { DashboardState } from './reducer';

export const selectDashboard = (state: RootState): DashboardState => state.dashboard;

export const selectDashboardMapBounds = createSelector(selectDashboard, (state) => state.mapBounds);
export const selectDashboardMapCenter = createSelector(selectDashboard, (state) => state.mapCenter);
export const selectHoursFilterInput = createSelector(
  selectDashboard,
  (state) => state.hoursFilterInput
);

export const selectDashboardType = createSelector(selectDashboard, (state) => state.type);
// export const selectDashboardTypeInMapboxFormat = createSelector(selectDashboard, (state) => {
//   return ['match', ['get', 'type'], state.type, true, false];
// });
export const selectDashboardDebounceValue = createSelector(
  [selectDashboardMapBounds, selectDashboardMapCenter],
  (debouncedBounds, debouncedCenter) => ({ debouncedBounds, debouncedCenter })
);

export function useGetDebouncedBoundsAndCenter() {
  return useDebounceSelector(selectDashboardDebounceValue, 300, shallowEqual);
}
