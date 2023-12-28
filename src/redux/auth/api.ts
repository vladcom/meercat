import { projectApi } from 'src/redux/api';
import { ApiTypes } from 'src/types/ApiTypes';
import { EAuthorizedRole, ERole, IUser } from 'src/types/IUser';
import { clearAuthState, setAuthState, signInProcess } from './reducer';

export type IMyProfileResponse = IUser;

export type IApproveAuthByPhoneResponse = {
  user: IUser;
  accessToken: string;
};
export type IApproveAuthByPhoneRequest = {
  code: string;
  phone: string;
  timeZone: string;
};

export type ILoginConfirmationResponse = {
  success: boolean;
};
export type ILoginConfirmationRequest = {
  phone: string;
};

export type IUpdateMyProfileResponse = IUser;
export type IUpdateMyProfileRequest = Partial<IUser> & { id: IUser['_id'] };

export type IDeleteMyProfileResponse = void;
export type IDeleteMyProfileRequest = { id: IUser['_id'] };

const extendedApi = projectApi.enhanceEndpoints({ addTagTypes: [ApiTypes.Auth] }).injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<IMyProfileResponse, void>({
      query: () => {
        return {
          url: 'user/me',
          method: 'GET',
          redirect: 'follow',
        };
      },

      async onQueryStarted(_d, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            setAuthState({ isAuth: true, userRole: EAuthorizedRole.USER as EAuthorizedRole })
          );
        } catch {
          dispatch(setAuthState({ isAuth: false, userRole: ERole.UNAUTHORIZED, authToken: null }));
        }
      },
      providesTags: (result) => [{ type: ApiTypes.Auth, id: result?._id }],
    }),
    updateMyProfile: builder.mutation<IUpdateMyProfileResponse, IUpdateMyProfileRequest>({
      query: (data) => {
        return {
          url: `user`,
          method: 'PATCH',
          redirect: 'follow',
          body: data,
        };
      },
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          extendedApi.util.updateQueryData('getMyProfile', undefined, (draft) => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteMyProfile: builder.mutation<IUpdateMyProfileResponse, IUpdateMyProfileRequest>({
      query: (data) => {
        return {
          url: `user`,
          method: 'DELETE',
          redirect: 'follow',
          body: data,
        };
      },
      invalidatesTags: [ApiTypes.Auth],
    }),
    loginConfirmation: builder.mutation<ILoginConfirmationResponse, ILoginConfirmationRequest>({
      query: (data) => {
        return {
          url: `verification-phone?phone=${data.phone}`,
          method: 'GET',
          redirect: 'follow',
        };
      },
      async onQueryStarted(_d, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(signInProcess('push'));
        } catch {}
      },
      invalidatesTags: [ApiTypes.Auth],
    }),
    logout: builder.mutation<void, void>({
      query: (data) => {
        return {
          url: `logout`,
          method: 'POST',
          redirect: 'follow',
          body: data,
        };
      },
      async onQueryStarted(_d, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearAuthState());
          document.location.reload();
        } catch {}
      },
    }),
    approveAuthByPhone: builder.mutation<IApproveAuthByPhoneResponse, IApproveAuthByPhoneRequest>({
      query: (data) => {
        return {
          url: `approve-auth-by-phone`,
          method: 'POST',
          redirect: 'follow',
          body: data,
        };
      },
      async onQueryStarted(_d, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(extendedApi.util.upsertQueryData('getMyProfile', undefined, data.user));
          dispatch(setAuthState({ authToken: data.accessToken }));
          localStorage.setItem('acc', data.accessToken);
        } catch {}
      },
    }),
  }),
  overrideExisting: false,
});

// export function useGetMyProfileQuery() {
//   const isUserAuthorized = useAppSelector(isAuth);

//   return extendedApi.useGetMyProfileQuery(undefined, {
//     skip: isUserAuthorized === false,
//     //1000 ms * 60 sec * 2 min
//     pollingInterval: 1000 * 60 * 2,
//     refetchOnReconnect: true,
//     refetchOnMountOrArgChange: true,
//   });
// }

export const {
  useGetMyProfileQuery,
  useApproveAuthByPhoneMutation,
  useLogoutMutation,
  useLoginConfirmationMutation,
  useUpdateMyProfileMutation,
  useDeleteMyProfileMutation,
} = extendedApi;
