import { projectApi } from 'src/redux/api';
import { ApiTypes } from 'src/types/ApiTypes';
import { EditablePlace, IPlaces } from 'src/types/IPlaces';

export type IGetMyPlacesResponse = IPlaces[];

export type IGetMyPlacesRequest = void;
export type IGetMyReportsRequest = {
  limit: number;
  offset: number;
};
export type IAddMyPlacesResponse = IPlaces;

export type IAddMyPlacesRequest = {
  userId: string;
} & EditablePlace;

export type IEditMyPlacesResponse = EditablePlace;

export type IEditMyPlacesRequest = Partial<Omit<EditablePlace, '_id'> & { id: string }>;

export type IDeleteMyPlacesResponse = IPlaces;

export type IDeleteMyPlacesRequest = {
  placeId: string;
};

const extendedApi = projectApi
  .enhanceEndpoints({ addTagTypes: [ApiTypes.Places] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMyPlaces: builder.query<IGetMyPlacesResponse, IGetMyPlacesRequest>({
        query: () => {
          return {
            url: `place/my-places`,
            method: 'GET',
            redirect: 'follow',
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ _id: id }) => ({ type: ApiTypes.Places as const, id })),
                ApiTypes.Places,
              ]
            : [ApiTypes.Places],
      }),
      addPlace: builder.mutation<IAddMyPlacesResponse, IAddMyPlacesRequest>({
        query: (data) => {
          return {
            url: `place`,
            method: 'POST',
            redirect: 'follow',
            body: data,
          };
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data: newPlace } = await queryFulfilled;
            dispatch(
              extendedApi.util.updateQueryData('getMyPlaces', undefined, (draft) => {
                draft.push(newPlace);
              })
            );
          } catch {}
        },
      }),
      editPlace: builder.mutation<IEditMyPlacesResponse, IEditMyPlacesRequest>({
        query: ({ id, ...data }) => {
          return {
            url: `place/${id}`,
            method: 'PATCH',
            redirect: 'follow',
            body: data,
          };
        },
        async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
          dispatch(
            extendedApi.util.updateQueryData('getMyPlaces', undefined, (draft) => {
              const index = draft.findIndex((val) => val._id === id);
              if (index !== -1) {
                Object.assign(draft[index], patch);
              }
            })
          );
          try {
            await queryFulfilled;
          } catch {
            dispatch(extendedApi.util.invalidateTags([ApiTypes.Places]));
          }
        },
      }),
      deleteMyPlace: builder.mutation<IDeleteMyPlacesResponse, IDeleteMyPlacesRequest>({
        query: ({ placeId }) => {
          return {
            url: `place/${placeId}`,
            method: 'DElETE',
            redirect: 'follow',
          };
        },
        invalidatesTags: [ApiTypes.Places],
      }),
    }),

    overrideExisting: false,
  });

export const {
  useGetMyPlacesQuery,
  useAddPlaceMutation,
  useEditPlaceMutation,
  useDeleteMyPlaceMutation,
} = extendedApi;
