import { MaybeDrafted } from '@reduxjs/toolkit/dist/query/core/buildThunks';
import { SocketMethods } from 'src/constants/SocketMethods';
import { projectApi } from 'src/redux/api';
import { ApiTypes } from 'src/types/ApiTypes';
import { IIncident } from 'src/types/IIncident';
import { IUser } from '../../types/IUser';
import { getIncidentSocket } from '../api/socket';
import { IGetSpecificIncidentResponse } from '../incident';
import { setCommentsPage, setScrollToVirtualId } from './reducer';

export type IIncidentComment = {
  _id: string;
  incident: string;
  repliedTo?: string;
  repliedToUserData?: string;
  text: string;
  userId: IUser;
  incidentId: string;
  userData?: { name: string; id: string };
  editedAt?: string;
  createdAt?: string;
  deletedAt: unknown[];
};

type IGetCommentsRequest = {
  // offset?: number;
  // limit?: number;
  page?: number;
  incidentId: string;
  userId?: string;
};
type IGetCommentsResponse = {
  countAll: number;
  count: number;
  comments: IIncidentComment[];
};

export type ICreateCommentsResponse = { comment: IIncidentComment; incident: IIncident };
type ICreateCommentsRequest = { incidentId: string; text: string; userId: string };

type IEditCommentRequest = { commentId: string; text: string; incidentId: string };
type IEditCommentResponse = true;

export type IDeleteCommentRequest = { commentId: string; incidentId: string; userId: string };
type IDeleteCommentResponse = { incidentId: string };

type IReplyToCommentRequest = { commentId: string; incidentId: string; text: string };
type IReplyToCommentResponse = { comment: IIncidentComment; incident: IIncident };

export const INITIAL_COMMENTS_LIMIT = 20;
const extendedApi = projectApi.enhanceEndpoints({ addTagTypes: [ApiTypes.Chat] }).injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<IGetCommentsResponse, IGetCommentsRequest>({
      query: ({ page = 0, incidentId, userId }) => {
        const limit = INITIAL_COMMENTS_LIMIT;
        const offset = page * INITIAL_COMMENTS_LIMIT;
        const params = new URLSearchParams('');
        if (limit) params.set('limit', `${limit}`);
        if (offset) params.set('offset', `${offset}`);
        if (incidentId) params.set('incidentId', `${incidentId}`);
        if (userId) params.set('userId', `${userId}`);
        return {
          url: `comment`,
          method: 'GET',
          redirect: 'follow',
          params,
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}(${JSON.stringify({
          incidentId: queryArgs.incidentId,
          userId: queryArgs.userId,
          // page: queryArgs.page,
        })})`;
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.incidentId !== previousArg?.incidentId;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        const mergedArray = [...currentCache.comments, ...newItems.comments];
        if (newItems.countAll >= mergedArray.length) {
          currentCache.comments.push(...newItems.comments);
          currentCache.count = newItems.count;
        }
      },
      providesTags: (result, error, request) => {
        return [{ type: ApiTypes.Chat, id: request.incidentId }];
      },
      async onCacheEntryAdded(
        args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved, dispatch }
      ) {
        try {
          await cacheDataLoaded;
          const socket = getIncidentSocket();
          //TODO: https://trello.com/c/2KMu67dz/83-for-deletingcomments-socket-return-user-comment-id
          socket.on(SocketMethods.CREATE_COMMENT, (data: ICreateCommentsResponse) => {
            updateCachedData((draft) => {
              //If we stay on the page with free slots (since we didnt reach the comments limit) - push new comment from socket
              if (draft.count !== INITIAL_COMMENTS_LIMIT) {
                draft.comments = [...draft.comments, data.comment];
                draft.count =
                  draft.count + 1 > INITIAL_COMMENTS_LIMIT
                    ? INITIAL_COMMENTS_LIMIT
                    : draft.count + 1;
                draft.countAll = draft.countAll + 1;
              }
            });
          });
          //TODO: https://trello.com/c/2KMu67dz/83-for-deletingcomments-socket-return-user-comment-id
          socket.on(SocketMethods.DELETE_COMMENT, (commentId: string) => {
            updateCachedData((draft) => {
              const filtered = draft.comments.filter((val) => val._id !== commentId);
              draft.comments = filtered;
              draft.count = filtered.length - 1 < 0 ? 0 : filtered.length;
              draft.countAll = draft.countAll - 1;
            });
          });

          await cacheEntryRemoved;
          dispatch(setCommentsPage({ id: args.incidentId, data: 0 }));
          socket.off(SocketMethods.CREATE_COMMENT);
          socket.off(SocketMethods.DELETE_COMMENT);
        } catch {
          // if cacheEntryRemoved resolved before cacheDataLoaded,
          // cacheDataLoaded throws
        }
      },
    }),
    createComment: builder.mutation<ICreateCommentsResponse, ICreateCommentsRequest>({
      query(body) {
        const { id } = getIncidentSocket();
        return {
          url: `comment`,
          method: 'POST',
          redirect: 'follow',
          body: { ...body, socketId: id },
        };
      },

      async onQueryStarted({ incidentId, userId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;
          dispatch(
            extendedApi.util.updateQueryData('getComments', { incidentId, userId }, (draft) => {
              //If we stay on the page with free slots (since we didnt reach the comments limit) - push created comment to list
              if (draft.count !== INITIAL_COMMENTS_LIMIT) {
                const newArray = [
                  ...draft.comments,
                  { ...newComment.comment, userId: { _id: userId } },
                ];
                Object.assign(draft, {
                  comments: newArray,
                  count: newArray.length,
                  countAll: newArray.length,
                });
                dispatch(setScrollToVirtualId(newArray.length - 1));
              } else {
                dispatch(setScrollToVirtualId(null));
              }
            })
          );
          dispatch(
            extendedApi.util.updateQueryData(
              'getSpecificIncident' as never,
              { incidentId } as never,
              (draft: MaybeDrafted<IGetSpecificIncidentResponse>) => {
                Object.assign(
                  draft,
                  Object.assign(draft.incident, {
                    commentsCount: (draft.incident.commentsCount ?? 0) + 1,
                  } as Pick<typeof draft.incident, 'commentsCount'>)
                );
              }
            )
          );
        } catch {}
      },
    }),
    editComment: builder.mutation<IEditCommentResponse, IEditCommentRequest>({
      query({ commentId, text }) {
        const { id } = getIncidentSocket();
        return {
          url: `comment/${commentId}`,
          method: 'PATCH',
          redirect: 'follow',
          body: { text, socketId: id },
        };
      },
      invalidatesTags(response, error, request) {
        return [{ type: ApiTypes.Chat, id: request.incidentId }];
      },
    }),
    deleteComment: builder.mutation<IDeleteCommentResponse, IDeleteCommentRequest>({
      query({ commentId }) {
        const { id } = getIncidentSocket();
        return {
          url: `comment/${commentId}`,
          method: 'DELETE',
          redirect: 'follow',
          body: { socketId: id },
        };
      },
      async onQueryStarted({ incidentId, commentId, userId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            extendedApi.util.updateQueryData('getComments', { incidentId, userId }, (draft) => {
              const elementsWithoutDeleted = draft.comments.filter(
                (elem) => elem._id !== commentId
              );
              draft.comments = elementsWithoutDeleted;
            })
          );
        } catch {}
      },
    }),
    replyToComment: builder.mutation<IReplyToCommentResponse, IReplyToCommentRequest>({
      query(body) {
        return {
          url: `comment`,
          method: 'DELETE',
          redirect: 'follow',
          body: { id: body.commentId, text: body.text, incidentId: body.incidentId },
        };
      },
      invalidatesTags(response, error, request) {
        return [{ type: ApiTypes.Chat, id: request.incidentId }];
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useReplyToCommentMutation,
} = extendedApi;
