import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IMapCenter } from '../dashboard/reducer';

type MapLoadingState = {
  isMounted: boolean;
  isGeoCordsGotten: boolean;
};

export enum ECurrentMap {
  MAIN = 'main',
  REPORT_MAP = 'report',
}
export enum ECordsSource {
  IP,
  BROWSER,
}
type MapInitialCords = {
  cordsSource: ECordsSource | null;
  cords: IMapCenter | null;
};

export interface MapState {
  mapLoadingState: MapLoadingState;
  mapInitialCords: MapInitialCords;
}

const initialState: MapState = {
  mapLoadingState: {
    isMounted: false,
    isGeoCordsGotten: false,
  },
  mapInitialCords: {
    cordsSource: null,
    cords: null,
  },
};

type MapLoaderAction = Partial<MapInitialCords & MapLoadingState>;
export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    clearMapState: () => {
      return initialState;
    },
    setMapLoader: (state, action: PayloadAction<MapLoaderAction>) => {
      if (typeof action.payload.isMounted !== 'undefined') {
        state.mapLoadingState.isMounted = action.payload.isMounted;
      }
      if (typeof action.payload.isGeoCordsGotten !== 'undefined') {
        state.mapLoadingState.isGeoCordsGotten = action.payload.isGeoCordsGotten;
      }
      if (typeof action.payload.cordsSource !== 'undefined') {
        state.mapInitialCords.cordsSource = action.payload.cordsSource;
      }
      if (typeof action.payload.cords !== 'undefined') {
        state.mapInitialCords.cords = action.payload.cords;
      }
    },
  },
});
export const { clearMapState, setMapLoader } = mapSlice.actions;

export default mapSlice.reducer;
