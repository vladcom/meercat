import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { AuthState } from './reducer';

export const selectAuth = (state: RootState): AuthState => state.auth;

export const authSelectorState = createSelector(selectAuth, (state) => state);
export const isAuth = createSelector(selectAuth, (state) => state.isAuth);
export const currentRoleSelector = createSelector(selectAuth, (state) => state.userRole);
export const selectCurrentSignInProcess = createSelector(
  selectAuth,
  (state) => state.signInProcess.status
);
export const selectPhoneSignInMode = createSelector(
  selectAuth,
  (state) => state.signInProcess.phone
);

export const selectSignInMode = createSelector(
  selectAuth,
  (state) => state.signInProcess.isDevMode
);
