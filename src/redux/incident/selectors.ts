import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { IncidentState } from './reducer';

export const selectIncident = (state: RootState): IncidentState => state.incident;

export const selectPickedElement = createSelector(
  selectIncident,
  (state) => state.selectedIncidentId
);
export const selectedOldIncident = createSelector(
  selectIncident,
  (state) => state.oldIncidentGeoJson
);
