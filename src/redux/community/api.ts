import { projectApi } from "../api";
import { ApiTypes } from "../../types/ApiTypes";
import { IAddCommunityFormikValues } from "../../view/pages/AddCommunity/AddCommunityForm";
import { ICommunity, IIncidentsStats, IPostsStats } from "../../types/ICommunity";

export type IGetMyCommunityRequest = void;
export type IGetMyCommunityResponse = ICommunity[];

export type IAddMyCommunityRequest = IAddCommunityFormikValues;
export type IAddMyCommunityResponse = ICommunity;

export type IGetStatisticsRequest = {
  from: number,
  to: number,
  communityId: string,
};
export type IGetStatisticsResponse = {
  incidentsStats?: IIncidentsStats[],
  name?: string,
  _id?: string,
  postsStats?: IPostsStats[],
};

const extendedApi = projectApi
  .enhanceEndpoints({ addTagTypes: [ApiTypes.Community] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMyCommunities: builder.query<IGetMyCommunityResponse, IGetMyCommunityRequest>({
        query: () => {
          return {
            url: `community/my`,
            method: 'GET',
            redirect: 'follow',
          }
        },
        providesTags: (result) =>
          result
            ? [
              ...result.map(({ _id: id }) => ({ type: ApiTypes.Community as const, id })),
              ApiTypes.Community,
            ] : [ApiTypes.Community]
      }),
      getCommunity: builder.query({
        query: ({ id }) => {
          return {
            url: `community/${id}`,
            method: 'GET',
            redirect: 'follow',
          }
        },
      }),
      getCommunityUsers: builder.mutation({
        query: ({ communityId }) => {
          return {
            url: `community/${communityId}/participants`,
            method: "GET",
            redirect: "follow"
          };
        }
      }),
      getCommunityStatistics: builder.query<IGetStatisticsResponse, IGetStatisticsRequest>({
        query: ({ communityId, to, from }) => {
          const params = new URLSearchParams('');
          if (communityId) {
            params.set('communityId', `${communityId}`);
          }
          if (from) {
            params.set('from', `${from}`);
          }
          if (to) {
            params.set('to', `${to}`);
          }
          return {
            url: `community/${communityId}/statistic`,
            method: "GET",
            redirect: "follow",
            params,
          };
        }
      }),
      generateReport: builder.mutation({
        query: ({ communityId, to, from }) => {
          const params = new URLSearchParams('');
          if (communityId) {
            params.set('communityId', `${communityId}`);
          }
          if (from) {
            params.set('from', `${from}`);
          }
          if (to) {
            params.set('to', `${to}`);
          }
          return {
            url: `community/${communityId}/statistic`,
            method: "GET",
            redirect: "follow",
            params,
          };
        }
      }),
      addCommunity: builder.mutation({
        query: (data) => {
          return {
            url: `community`,
            method: 'POST',
            redirect: 'follow',
            body: data,
          }
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data: newPlace } = await queryFulfilled;
            dispatch(
              extendedApi.util.updateQueryData('getMyCommunities', undefined, (draft) => {
                draft.unshift(newPlace);
              })
            );
          } catch {}
        },
      }),
      editCommunity: builder.mutation({
        query: ({ data, id }) => {
          return {
            url: `community/${id}`,
            method: 'PATCH',
            redirect: 'follow',
            body: data,
          }
        },
      }),
      addUserIntoCommunity: builder.mutation({
        query: ({ data, communityId }) => {
          return {
            url: `community/${communityId}/add-user`,
            method: 'POST',
            redirect: 'follow',
            body: data,
          }
        }
      }),
      editCommunityUser: builder.mutation({
        query: ({ data, communityId }) => {
          return {
            url: `community/${communityId}/edit-user`,
            method: 'PATCH',
            redirect: 'follow',
            body: data,
          }
        }
      }),
      changeUserRequestStatus: builder.mutation({
        query: ({ communityId, userId, action }) => {
          return {
            url: `community/${communityId}/manage-request`,
            method: 'PATCH',
            redirect: 'follow',
            body: {
              userId,
              action,
            },
          }
        }
      }),
      deleteUserOfCommunity: builder.mutation({
        query: ({ communityId, userId }) => {
          return {
            url: `community/${communityId}/user/${userId}`,
            method: 'DELETE',
            redirect: 'follow',
          }
        }
      }),
      leaveFromCommunity: builder.mutation({
        query: ({ communityId }) => {
          return {
            url: `community/${communityId}/leave`,
            method: 'GET',
            redirect: 'follow',
          }
        },
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            console.log('newPlace', arg);
            dispatch(
              extendedApi.util.updateQueryData('getMyCommunities', undefined, (draft) => {
                console.log('draft', draft);
              })
            );
          } catch {}
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetMyCommunitiesQuery,
  useAddCommunityMutation,
  useGetCommunityQuery,
  useGetCommunityUsersMutation,
  useGetCommunityStatisticsQuery,
  useEditCommunityMutation,
  useChangeUserRequestStatusMutation,
  useDeleteUserOfCommunityMutation,
  useAddUserIntoCommunityMutation,
  useGenerateReportMutation,
  useEditCommunityUserMutation,
  useLeaveFromCommunityMutation,
} = extendedApi;
