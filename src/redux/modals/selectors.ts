import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { ModalsState } from './reducer';

export const selectModal = (state: RootState): ModalsState => state.modal;

/**
 * If all elements in such object contains true - map loaded correctly
 */

export const isReportWindowOpen = createSelector(
  selectModal,
  (state) => state.mapLoadingState.isReportWindowOpen
);
export const isIncidentChatOpen = createSelector(
  selectModal,
  (state) => state.mapLoadingState.isIncidentChatOpen
);
export const isProfileWindowOpen = createSelector(
  selectModal,
  (state) => state.mapLoadingState.isProfileWindowOpen
);
