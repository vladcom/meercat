import { EAuthorizedRole, ERole } from 'src/types/IUser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ESignInFlow {
  SIGN_IN,
  ENTER_CODE,
}
export type UserRole = ERole | EAuthorizedRole;
export interface AuthState {
  isAuth: boolean | null;
  userRole: UserRole;
  authToken: string | null;
  signInProcess: {
    phone: string;
    status: ESignInFlow;
    isDevMode: boolean;
  };
}

const initialState: AuthState = {
  isAuth: null,
  userRole: ERole.UNAUTHORIZED,
  authToken: null,
  signInProcess: {
    phone: '',
    status: ESignInFlow.SIGN_IN,
    isDevMode: false,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.authToken = initialState.authToken;
      state.isAuth = initialState.isAuth;
      state.signInProcess = initialState.signInProcess;
      state.userRole = initialState.userRole;
    },
    setAuthState: (state, action: PayloadAction<Partial<AuthState>>) => {
      if (typeof action.payload.isAuth !== 'undefined') {
        state.isAuth = action.payload.isAuth;
      }
      if (typeof action.payload.userRole !== 'undefined') {
        state.userRole = action.payload.userRole;
      }
      if (typeof action.payload.authToken !== 'undefined') {
        state.authToken = action.payload.authToken;
      }
    },
    setRoleState: (state, action: PayloadAction<ERole>) => {
      state.userRole = action.payload;
    },
    signInProcess: (state, action: PayloadAction<'push' | 'back'>) => {
      if (action.payload === 'push') {
        if (state.signInProcess.status === ESignInFlow.SIGN_IN)
          state.signInProcess.status = ESignInFlow.ENTER_CODE;
      }
      if (action.payload === 'back') {
        if (state.signInProcess.status === ESignInFlow.ENTER_CODE) {
          state.signInProcess.status = initialState.signInProcess.status;
          state.signInProcess.phone = initialState.signInProcess.phone;
          state.signInProcess.isDevMode = initialState.signInProcess.isDevMode;
        }
      }
    },
    setSignInMode: (state, action: PayloadAction<boolean>) => {
      state.signInProcess.isDevMode = action.payload;
    },
    setSignInPhone: (state, action: PayloadAction<string>) => {
      state.signInProcess.phone = action.payload;
    },
  },
});
export const {
  clearAuthState,
  setAuthState,
  setRoleState,
  signInProcess,
  setSignInMode,
  setSignInPhone,
} = authSlice.actions;

export default authSlice.reducer;
