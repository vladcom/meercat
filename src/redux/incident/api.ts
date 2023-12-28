import { Expression, VectorSourceImpl } from 'mapbox-gl';
import { SocketMethods } from 'src/constants/SocketMethods';
import { LowTileSourceId } from 'src/helpers/Incident';
import { GeoJSONFabric } from 'src/helpers/geoJSON';
import { projectApi } from 'src/redux/api';
import { ApiTypes } from 'src/types/ApiTypes';
import { IGeoMarker, IGeoMarkers } from 'src/types/IGeoTags';
import { IIncident } from 'src/types/IIncident';
import { PickRename } from 'src/types/helpers';
import { useMapStore } from 'src/view/components/MapContext';
import { IBounds } from 'src/view/components/Mapbox/Mapbox';
import { RootState } from '..';
import { getIncidentSocket } from '../api/socket';
import { IIncidentComment } from '../chat';
import { placeOldIncidentInStorage } from './reducer';
import { ITypeFromWs } from "../dashboard/reducer";
export type IGetMyIncidentsResponse = { count: number; data: IIncident[] };

export type IGetMyIncidentsRequest = {
  limit: number;
  offset: number;
};

export type IGetSpecificIncidentResponse = {
  incident: IIncident;
  geoJson: IGeoMarker<GeoMarkerIncident>;
};

export type IGetSpecificIncidentRequest = {
  incidentId: string;
};

type BoundsQuery = {
  center: { lat: number; lng: number };
  bounds: IBounds;
};

export type IFetchUserDensityInBoundsRequest = BoundsQuery;
export type IFetchUserDensityInBoundsResponse = unknown;

export type IIncidentType = {
  _id: string;
  name: string;
  icon?: string;
};

export type IGetIncidentTypesResponse = IIncidentType[];
export type IGetIncidentTypesRequest = unknown;

export enum ELikeAction {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export type IIncidentLikeMutationRequest = {
  incidentId: string;
  userId: string;
  event: ELikeAction;
};
export type IIncidentLikeMutationResponse = {
  count: number;
  votedArray: string[];
};

export type IPostIncidentImageResponse = {
  Location?: string;
  Bucket?: string;
  ETag?: string;
  Key?: string;
  key?: string;
  ServerSideEncryption?: string;
};
export type IPostIncidentImageRequest = {
  image: File;
};

export type IPostNewIncidentRequest = {
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  userId: string;
  imageUrl?: string;
  willCreateAt?: number;
};
export type IPostNewIncidentResponse = IIncident;

export type IGetIncidentStylesResponse = Expression;
export type IGetIncidentStylesRequest = undefined;

export type IDeleteMyIncidentResponse = unknown;
export type IDeleteMyIncidentRequest = { incidentId: string };

export type IFetchHeatmapRequest = {
  bounds: IBounds;
  zoom: number;
};

export type IFetchHeatmapCountRequest = {
  type: ITypeFromWs;
  bounds: IBounds;
  periodFilter?: number | string;
  isUser: boolean;
};

export type IFetchHeatmapCountResponse = {
  count: number;
};

export type IFetchHeatmapResponse = IGeoMarkers<{ hexCount: number }> & { count: number };

export enum EReportReason {
  SPAM = 'Its spam',
  SCAM = 'Scam or fraud',
  FALSE_INFORMATION = 'False information',
  DONT_LIKE = 'I just dont like it',
}

export type ICreateReportForIncidentResponse = {
  createdAt: number;
  id: string;
  incidentId: string;
  text: EReportReason;
  userId: string;
};
export type ICreateReportForIncidentRequest = {
  text: EReportReason;
  incidentId: string;
};

export type GeoMarkerIncident = Pick<PickRename<IIncident, '_id', 'id'>, 'id' | 'type'> & {
  isOutdated?: boolean;
};

export type IGetSoftDeletedIncidentsResponse = Pick<IIncident, '_id'>[];
export type IGetSoftDeletedIncidentsRequest = void;

export const extendedApi = projectApi
  .enhanceEndpoints({ addTagTypes: [ApiTypes.Incident, ApiTypes.IncidentOnMap] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMyIncidents: builder.query<IGetMyIncidentsResponse, IGetMyIncidentsRequest>({
        query: ({ limit, offset }) => {
          return {
            url: `incident/my-reports?limit=${limit}&offset=${offset}`,
            method: 'GET',
            redirect: 'follow',
          };
        },
        providesTags: (result) => {
          return result
            ? result.data.map(({ _id: id }) => ({ type: ApiTypes.Incident as const, id }))
            : [{ type: ApiTypes.Incident as const }];
        },
      }),

      fetchHeatmapCount: builder.query<IFetchHeatmapCountResponse, IFetchHeatmapCountRequest>({
        query: (args) => {
          const {
            type,
            isUser,
            bounds: { north: n, south: s, east: e, west: w },
            periodFilter,
          } = args;
          const params = new URLSearchParams('');
          if (n) params.set('n', `${n}`);
          if (s) params.set('s', `${s}`);
          if (e) params.set('e', `${e}`);
          if (w) params.set('w', `${w}`);
          // params.set('res', `9`);

          if (type) {
            if (type.length) {
              params.set('type', `${type}`);
            }
          }

          if (periodFilter) {
            params.set("periodFilter", `${periodFilter}`);
          }

          return {
            url: `${isUser ? 'user' : 'incident'}/count`,
            method: 'GET',
            redirect: 'follow',
            params,
          };
        },
        serializeQueryArgs: ({ endpointName, queryArgs }) => {
          return `${endpointName}(${JSON.stringify({
            isUser: queryArgs.isUser,
          })})`;
        },
        forceRefetch({ currentArg, previousArg }) {
          return (
            currentArg?.isUser !== previousArg?.isUser || currentArg?.bounds !== previousArg?.bounds
          );
        },
      }),
      fetchHeatmapInBounds: builder.query<IFetchHeatmapResponse, IFetchHeatmapRequest>({
        query: (args) => {
          const {
            bounds: { north: n, south: s, east: e, west: w },
          } = args;
          const params = new URLSearchParams('');
          if (n) params.set('n', `${n}`);
          if (s) params.set('s', `${s}`);
          if (e) params.set('e', `${e}`);
          if (w) params.set('w', `${w}`);
          return {
            url: `feature`,
            method: 'GET',
            redirect: 'follow',
            params,
          };
        },
        serializeQueryArgs: ({ endpointName }) => endpointName,
        forceRefetch({ currentArg, previousArg }) {
          return (
            currentArg?.bounds !== previousArg?.bounds || currentArg?.zoom !== previousArg?.zoom
          );
        },
        // queryFn(args) {
        // const {
        //   bounds: { north: n, south: s, east: e, west: w },
        //   zoom,
        // } = args;
        //   const mainSocket = getIncidentSocket();
        //   const cachedData = extendedApi.endpoints.fetchHeatmapInBounds.select(args)(
        //     store.getState() as never
        //   ) as { data: IFetchHeatmapResponse };
        //   console.log('cachedData: ', cachedData, cachedData.data);
        //   // const cachedData = extendedApi?.endpoints?.fetchHeatmapInBounds?.select()(
        //   //   store.getState() as never
        //   // ) as { data: IFetchHeatmapResponse };
        //   if (cachedData?.data) {
        //     return cachedData;
        //   }
        //   return new Promise(async (resolve) => {
        //     let res = 3;
        //     if (zoom === 0 && zoom <= 3) {
        //       res = 3;
        //     } else if (zoom >= 4 && zoom <= 6) {
        //       res = 5;
        //     } else if (zoom >= 7 && zoom <= 9) {
        //       res = 7;
        //     } else {
        //       res = 9;
        //     }
        //     mainSocket.emit(SocketMethods.GET_GEO_INCIDENTS, { n, s, e, w, res });
        //     resolve({ data: GeoJSONFabric.createFeatureCollection([]) });
        //   });
        // },
        // async onCacheEntryAdded(
        //   _,
        //   { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getCacheEntry }
        // ) {
        //   try {
        //     await cacheDataLoaded;
        //     const socket = getIncidentSocket();
        //     socket.on(SocketMethods.GET_GEO_INCIDENTS, (data: IFetchHeatmapResponse) => {
        //       updateCachedData((draft) => {
        //         draft.features = data.features;
        //       });
        //     });
        //     await cacheEntryRemoved;
        //     socket.off(SocketMethods.GET_GEO_INCIDENTS);
        //   } catch {
        //     //
        //   }
        // },
      }),
      fetchUserDensityInBounds: builder.mutation<
        IFetchUserDensityInBoundsResponse,
        IFetchUserDensityInBoundsRequest
      >({
        async queryFn(arg) {
          const mainSocket = getIncidentSocket();
          return new Promise(async (resolve) => {
            mainSocket.emit(SocketMethods.GET_USER_GEO, arg);
            resolve({ data: { comment: {} as IIncidentComment, incident: {} as IIncident } });
          });
        },
      }),
      getIncidentTypes: builder.query<IGetIncidentTypesResponse, IGetIncidentTypesRequest>({
        query: () => {
          return {
            url: `incident-type`,
            method: 'GET',
            redirect: 'follow',
          };
        },
        async onQueryStarted(arg, { queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            data.forEach((val) => {
              if (!val?.icon) return;
              const img = new Image();
              img.src = val?.icon;
            });
          } catch {}
        },
      }),
      getSpecificIncident: builder.query<IGetSpecificIncidentResponse, IGetSpecificIncidentRequest>(
        {
          query: ({ incidentId }) => {
            return {
              url: `incident/${incidentId}`,
              method: 'GET',
              redirect: 'follow',
            };
          },
          // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          //   try {
          //     const { data } = await queryFulfilled;
          //     Incident.open({ dispatch, geoJSON: data.geoJson });
          //   } catch {}
          // },
          async onCacheEntryAdded(args, { cacheDataLoaded, cacheEntryRemoved, updateCachedData }) {
            try {
              await cacheDataLoaded;
              const socket = getIncidentSocket();
              socket.emit(SocketMethods.JOIN, {
                incidentId: args.incidentId,
              });
              const onLikeProcess = (data: IIncident) => {
                updateCachedData((draft) => {
                  if (draft.incident._id === data._id) {
                    draft.incident.like = data?.like ?? 0;
                    draft.incident.votedArray = data?.votedArray ?? [];
                  }
                });
              };
              socket.on(SocketMethods.CREATE_COMMENT, () => {
                updateCachedData((draft) => {
                  if (draft.incident.commentsCount) draft.incident.commentsCount += 1;
                });
              });
              socket.on(SocketMethods.DELETE_COMMENT, () => {
                updateCachedData((draft) => {
                  if (draft.incident.commentsCount) {
                    draft.incident.commentsCount =
                      draft.incident.commentsCount - 1 < 0 ? 0 : draft.incident.commentsCount - 1;
                  }
                });
              });
              socket.on(SocketMethods.VOTE, onLikeProcess);
              await cacheEntryRemoved;

              socket.emit(SocketMethods.LEAVE, {
                incidentId: args.incidentId,
              });
              socket.off(SocketMethods.VOTE);
              socket.off(SocketMethods.CREATE_COMMENT);
              socket.off(SocketMethods.DELETE_COMMENT);
            } catch {
              // if cacheEntryRemoved resolved before cacheDataLoaded,
              // cacheDataLoaded throws
            }
          },
          providesTags: (result) =>
            result ? [{ type: ApiTypes.Incident, id: result?.incident?._id }] : [ApiTypes.Incident],
        }
      ),
      getIncidentStyles: builder.query<IGetIncidentStylesResponse, IGetIncidentStylesRequest>({
        query() {
          return {
            url: `incident/styles`,
            method: 'GET',
            redirect: 'follow',
          };
        },
      }),
      incidentLikeMutation: builder.mutation<
        IIncidentLikeMutationResponse,
        IIncidentLikeMutationRequest
      >({
        query: ({ incidentId, event }) => {
          const socket = getIncidentSocket();
          const params = new URLSearchParams('');
          if (incidentId) params.set('id', `${incidentId}`);
          if (event) params.set('action', `${event}`);
          if (socket.id) params.set('socketId', `${socket.id}`);

          return {
            url: `incident/vote`,
            method: 'GET',
            redirect: 'follow',
            params,
          };
        },
        async onQueryStarted({ incidentId }, { dispatch, queryFulfilled }) {
          try {
            const { data: updatedIncident } = await queryFulfilled;
            dispatch(
              extendedApi.util.updateQueryData('getSpecificIncident', { incidentId }, (draft) => {
                Object.assign(
                  draft,
                  Object.assign(draft.incident, {
                    like: updatedIncident.count,
                    votedArray: updatedIncident.votedArray,
                  } as Pick<typeof draft.incident, 'like' | 'votedArray'>)
                );
              })
            );
          } catch {
            /**
             * Alternatively, on failure you can invalidate the corresponding cache tags
             * to trigger a re-fetch:
             * dispatch(api.util.invalidateTags(['Post']))
             */
          }
        },
        // invalidatesTags(result, error, arg) {
        //   return [{ type: ApiTypes.Incident, id: arg.incidentId }];
        // },
      }),
      postIncidentImage: builder.mutation<IPostIncidentImageResponse, IPostIncidentImageRequest>({
        query(arg) {
          const formData = new FormData();
          formData.append('image', arg.image, arg.image.name);
          return {
            url: `image`,
            method: 'POST',
            redirect: 'follow',
            body: formData,
          };
        },
      }),
      postNewIncident: builder.mutation<IPostNewIncidentResponse, IPostNewIncidentRequest>({
        query: (data) => {
          return {
            url: `incident`,
            method: 'POST',
            redirect: 'follow',
            body: data,
          };
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log('postNewIncident queryFulfilled data', data);
            dispatch(
              extendedApi.util.upsertQueryData(
                'getSpecificIncident',
                { incidentId: data._id },
                {
                  geoJson: GeoJSONFabric.createFeature({
                    cords: { latitude: data?.latitude ?? 0, longitude: data?.longitude ?? 0 },
                    properties: { id: data._id, type: data.type },
                  }),
                  incident: data,
                }
              )
            );
          } catch {}
        },
        invalidatesTags: (result, error, arg) => [
          { type: ApiTypes.Incident as const, id: result?._id },
        ],
      }),

      deleteMyIncident: builder.mutation<IDeleteMyIncidentResponse, IDeleteMyIncidentRequest>({
        query: ({ incidentId }) => {
          const socket = getIncidentSocket();
          return {
            url: `incident/${incidentId}`,
            method: 'DELETE',
            redirect: 'follow',
            body: { socketId: socket.id },
          };
        },
        async onQueryStarted({ incidentId }, { dispatch, queryFulfilled, getState }) {
          const selectedIncidentId = (getState() as RootState).incident.selectedIncidentId;
          try {
            // console.log(
            //   'selectedIncidentId: ',
            //   selectedIncidentId,
            //   useMapStore.getState(),
            //   getState()
            // );
            // map?.current?.triggerRepaint();
            // console.log('repaint');
            if (selectedIncidentId) {
              dispatch(placeOldIncidentInStorage(undefined));
            }

            const socket = getIncidentSocket();
            socket.emit(SocketMethods.LEAVE, {
              incidentId,
            });
            console.log('queryStarted: ');
            await queryFulfilled;
            const map = useMapStore.getState().map;
            console.log('queryStarted-finash');
            (map.current?.getSource(LowTileSourceId) as VectorSourceImpl as any).reload();
            console.log('queryStarted-reloaded');
          } catch (error) {
            console.log('error: ', error);
          }
        },
      }),

      createReportIncident: builder.mutation<
        ICreateReportForIncidentResponse,
        ICreateReportForIncidentRequest
      >({
        query: (data) => {
          return {
            url: `report`,
            method: 'POST',
            redirect: 'follow',
            body: data,
          };
        },
      }),
      getSoftDeletedIncident: builder.query<
        IGetSoftDeletedIncidentsResponse,
        IGetSoftDeletedIncidentsRequest
      >({
        query() {
          return {
            url: `incident/soft-deleted-incidents`,
            method: 'GET',
            redirect: 'follow',
          };
        },

        async onCacheEntryAdded(args, { cacheDataLoaded, cacheEntryRemoved, updateCachedData }) {
          try {
            await cacheDataLoaded;
            const socket = getIncidentSocket();
            socket.on(
              SocketMethods.GET_DELETED_INCIDENTS_ON_MAP,
              (data: Pick<IIncident, '_id'>) => {
                if (data._id)
                  updateCachedData((draft) => {
                    draft.push(data);
                  });
              }
            );
            await cacheEntryRemoved;
            socket.off(SocketMethods.GET_DELETED_INCIDENTS_ON_MAP);
          } catch {}
        },
      }),
    }),

    overrideExisting: false,
  });

export const {
  useGetMyIncidentsQuery,
  useGetSpecificIncidentQuery,
  useFetchUserDensityInBoundsMutation,
  useIncidentLikeMutationMutation,
  usePostIncidentImageMutation,
  usePostNewIncidentMutation,
  useDeleteMyIncidentMutation,
  useCreateReportIncidentMutation,
  useFetchHeatmapInBoundsQuery,
  useFetchHeatmapCountQuery,
  useGetIncidentTypesQuery,
  useGetIncidentStylesQuery,
  useGetSoftDeletedIncidentQuery,
} = extendedApi;

export const useFetchHeatmapInBoundsCache =
  extendedApi.endpoints.fetchHeatmapInBounds.useQueryState;
