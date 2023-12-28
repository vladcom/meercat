import { projectApi } from 'src/redux/api';
import { ApiTypes } from 'src/types/ApiTypes';

const extendedApi = projectApi.enhanceEndpoints({ addTagTypes: [ApiTypes.Map] }).injectEndpoints({
  endpoints: () => ({
    // getPositions: builder.query<void, void>({
    //   query: () => {
    //     return {
    //       url: 'me',
    //       method: 'GET',
    //       redirect: 'follow',
    //     };
    //   },
    // }),
  }),
  overrideExisting: false,
});

export const {} = extendedApi;
