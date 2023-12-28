import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { EditPlace } from './reducer';

export const editUserPlace = (state: RootState): EditPlace => state.userPlace;

export const InitEditablePlaceSelector = createSelector(
  editUserPlace,
  (state) => state.editablePlace
);

export const isEditStatusSelector = createSelector(editUserPlace, (state) => state.isEdit);

export const currentUserPreview = createSelector(editUserPlace, (state) => state.isUserPreview);

export const currentUserStep = createSelector(editUserPlace, (state) => state.isUserStep);

export const currentAddedPlaceStatus = createSelector(editUserPlace, (state) => state.isAddedSuccessfully);
