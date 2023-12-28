import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IGeoMarker } from 'src/types/IGeoTags';
import { GeoMarkerIncident, extendedApi } from './api';
type LoadingState = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};
type FetchInMapNodesState = {
  userDensity: LoadingState;
};

export interface IncidentState {
  selectedIncidentId: string | null;
  fetchInMapNodes: FetchInMapNodesState;
  oldIncidentGeoJson: IGeoMarker<GeoMarkerIncident> | null;
}

const initialState: IncidentState = {
  selectedIncidentId: null,
  fetchInMapNodes: {
    userDensity: {
      isLoading: false,
      isSuccess: false,
      isError: false,
    },
  },
  oldIncidentGeoJson: null,
};

export const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    placeOldIncidentInStorage: (
      state,
      action: PayloadAction<IGeoMarker<GeoMarkerIncident> | undefined>
    ) => {
      if (typeof action.payload !== 'undefined') {
        state.oldIncidentGeoJson = action.payload;
      } else {
        state.oldIncidentGeoJson = null;
      }
    },
    setSelectedElementId(state, action: PayloadAction<string | null>) {
      state.selectedIncidentId = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(extendedApi.endpoints.fetchUserDensityInBounds.matchPending, (state) => {
      // console.log('match pending', JSON.stringify(state), action);
      state.fetchInMapNodes.userDensity.isLoading = true;
      state.fetchInMapNodes.userDensity.isSuccess = false;
      state.fetchInMapNodes.userDensity.isError = false;
    });
    builder.addMatcher(extendedApi.endpoints.fetchUserDensityInBounds.matchFulfilled, (state) => {
      // console.log('match fullifiled', JSON.stringify(state), action);
      state.fetchInMapNodes.userDensity.isLoading = false;
      state.fetchInMapNodes.userDensity.isSuccess = true;
      state.fetchInMapNodes.userDensity.isError = false;
    });
    builder.addMatcher(extendedApi.endpoints.fetchUserDensityInBounds.matchRejected, (state) => {
      state.fetchInMapNodes.userDensity.isLoading = false;
      state.fetchInMapNodes.userDensity.isSuccess = false;
      state.fetchInMapNodes.userDensity.isError = true;
    });
  },
});
export const { placeOldIncidentInStorage, setSelectedElementId } = incidentSlice.actions;
export default incidentSlice.reducer;
