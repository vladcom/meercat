/* eslint-disable @typescript-eslint/indent */
import { Action, configureStore, ThunkAction, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { projectApi } from './api';
import { authReducer } from './auth';
import { mapReducer } from './map';
import { modalReducer } from './modals';
import { userPlaceReducer } from './userPlaces';
import { incidentReducer } from './incident';
import { chatReducer } from './chat';
import { dashboardReducer } from './dashboard';
import './helpers';
import { communityReducer } from "./community";

const reducer = combineReducers({
  auth: authReducer,
  map: mapReducer,
  modal: modalReducer,
  userPlace: userPlaceReducer,
  community: communityReducer,
  incident: incidentReducer,
  chat: chatReducer,
  dashboard: dashboardReducer,
  [projectApi.reducerPath]: projectApi.reducer,
});

export const store = configureStore({
  devTools: import.meta.env.DEV,
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(projectApi.middleware),
});
setupListeners(store.dispatch);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
