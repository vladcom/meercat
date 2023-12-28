import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION } from 'src/constants/map';

// export type ITypeFromWs = { id: number | 'all'; checked: boolean }[];
export type ITypeFromWs = string[];

export type IMapCenter = {
  lat: number;
  lng: number;
};
export type IMapBounds = {
  north: number;
  east: number;
  south: number;
  west: number;
};
export interface DashboardState {
  type: ITypeFromWs;
  mapCenter: IMapCenter | null;
  mapBounds: IMapBounds | null;
  mapZoom: number;
  isUserDensity: boolean;
  reportedPosition: IMapCenter;
  hoursFilterInput: string;
}

const initialState: DashboardState = {
  type: [],
  mapCenter: null,
  mapBounds: null,
  mapZoom: ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION ?? 15,
  isUserDensity: false,
  reportedPosition: { lat: 0, lng: 0 },
  hoursFilterInput: '168',
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setType(state, actions: PayloadAction<ITypeFromWs>) {
      state.type = actions.payload;
    },
    setIsUserDensity(state, actions: PayloadAction<boolean>) {
      state.isUserDensity = actions.payload;
    },
    setHoursFilter(state, actions: PayloadAction<string>) {
      state.hoursFilterInput = actions.payload;
    },
    setReportedPosition(state, actions: PayloadAction<IMapCenter>) {
      state.reportedPosition = actions.payload;
    },
    onChangeMapCenter(state, action: PayloadAction<Partial<{ center: IMapCenter; zoom: number }>>) {
      if (typeof action.payload.center !== 'undefined') {
        state.mapCenter = action.payload.center;
      }
      if (typeof action.payload.zoom !== 'undefined') {
        state.mapZoom = action.payload.zoom;
      }
    },
    onChangeMapBounds(state, action: PayloadAction<IMapBounds>) {
      state.mapBounds = action.payload;
    },
  },
});
export const {
  setIsUserDensity,
  setType,
  setHoursFilter,
  setReportedPosition,
  onChangeMapBounds,
  onChangeMapCenter,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
