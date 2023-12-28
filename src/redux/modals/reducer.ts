import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type MainModalsState = {
  isReportWindowOpen: boolean;
  isIncidentChatOpen: boolean;
  isProfileWindowOpen: boolean;
};

export interface ModalsState {
  mapLoadingState: MainModalsState;
}

const initialState: ModalsState = {
  mapLoadingState: {
    isReportWindowOpen: false,
    isIncidentChatOpen: false,
    isProfileWindowOpen: false,
  },
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    clearMapState: () => {
      return initialState;
    },
    setMainModalState: (state, action: PayloadAction<Partial<MainModalsState>>) => {
      if (typeof action.payload.isIncidentChatOpen !== 'undefined') {
        state.mapLoadingState.isIncidentChatOpen = action.payload.isIncidentChatOpen;
      }
      if (typeof action.payload.isReportWindowOpen !== 'undefined') {
        state.mapLoadingState.isReportWindowOpen = action.payload.isReportWindowOpen;
      }
      if (typeof action.payload.isProfileWindowOpen !== 'undefined') {
        state.mapLoadingState.isProfileWindowOpen = action.payload.isProfileWindowOpen;
      }
    },
  },
});
export const { clearMapState, setMainModalState } = modalsSlice.actions;

export default modalsSlice.reducer;
