import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IEditable } from '../../view/components/UserProfile/UserProfilePlaces/UserPlaceForm';
import { EUserProfilePreview } from '../../types/IPlaces';

export interface EditPlace {
  isEdit: boolean;
  isAddedSuccessfully: boolean;
  editablePlace: IEditable;
  isUserPreview: EUserProfilePreview;
  isUserStep: EUserPlaceContainer;
}

export enum EUserPlaceContainer {
  INFO = 'info',
  PARAMS = 'params',
}

const initialState: EditPlace = {
  editablePlace: {
    address: '',
    label: '',
    latitude: 0,
    longitude: 0,
    types: [],
    radius: 0.5,
  },
  isEdit: false,
  isAddedSuccessfully: false,
  isUserPreview: EUserProfilePreview.PREVIEW,
  isUserStep: EUserPlaceContainer.INFO,
};

export const userPlacesSlice = createSlice({
  name: 'userPlaces',
  initialState,
  reducers: {
    clearEditablePlace: () => {
      return initialState;
    },
    setPlaceAddedSuccessfully: (state, action) => {
      if (typeof action.payload.isAddedSuccessfully !== 'undefined') {
        state.isAddedSuccessfully = action.payload.isAddedSuccessfully;
      }
    },
    setEditablePlace: (state, action) => {
      if (typeof action.payload.editablePlace !== 'undefined') {
        state.isEdit = true;
        state.editablePlace = action.payload.editablePlace;
        state.isUserPreview = EUserProfilePreview.PLACEINFO;
        state.isUserStep = EUserPlaceContainer.INFO;
      }
    },
    changeUserPreview: (state, action) => {
      if (typeof action.payload.isUserPreview !== 'undefined') {
        state.isUserPreview = action.payload.isUserPreview;
      }
    },
    changeUserStep: (state, action) => {
      if (typeof action.payload.isUserStep !== 'undefined') {
        state.isUserStep = action.payload.isUserStep;
      }
    },
    changeEditablePlace: (state, action: PayloadAction<Partial<IEditable>>) => {
      if (typeof action.payload.address !== 'undefined') {
        state.editablePlace.address = action.payload.address;
      }
      if (typeof action.payload._id !== 'undefined') {
        state.editablePlace._id = action.payload._id;
      }
      if (typeof action.payload.label !== 'undefined') {
        state.editablePlace.label = action.payload.label;
      }
      if (typeof action.payload.latitude !== 'undefined') {
        state.editablePlace.latitude = action.payload.latitude;
      }
      if (typeof action.payload.longitude !== 'undefined') {
        state.editablePlace.longitude = action.payload.longitude;
      }
      if (typeof action.payload.radius !== 'undefined') {
        state.editablePlace.radius = action.payload.radius;
      }
      if (typeof action.payload.types !== 'undefined') {
        state.editablePlace.types = action.payload.types;
      }
    },
  },
});

export const {
  clearEditablePlace,
  setEditablePlace,
  changeUserPreview,
  changeUserStep,
  changeEditablePlace,
  setPlaceAddedSuccessfully,
} = userPlacesSlice.actions;

export default userPlacesSlice.reducer;
