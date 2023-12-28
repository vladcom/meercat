import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setAuthState } from '../auth/reducer';
import { RootState } from '..';
import { Mutex } from 'async-mutex';
import { ERole } from 'src/types/IUser';

const mutex = new Mutex();
// export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
export const BASE_URL = '/api';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL ?? '/production',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const authToken = (getState() as RootState).auth.authToken ?? localStorage.getItem('acc');
    if (authToken && endpoint !== 'getMyLocation') {
      headers.set('Authorization', authToken);
    }
    return headers;
  },
  credentials: 'include',
});
const baseQueryWithLogout: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        api.dispatch(
          setAuthState({ isAuth: false, userRole: ERole.UNAUTHORIZED, authToken: null })
        );
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  // if (result.error && result.error.status === 401) {
  //   api.dispatch(clearAuthState());
  // }
  return result;
};
export const projectApi = createApi({
  reducerPath: 'meercat-api',
  baseQuery: baseQueryWithLogout,
  endpoints: () => ({}),
});
