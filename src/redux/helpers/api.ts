import publicIp from 'public-ip';
import { projectApi } from 'src/redux/api';
import { ApiTypes } from 'src/types/ApiTypes';

export type IGetMyLocationResponse = { address: string; location: { lat: number; lng: number } };
export type IGetMyLocationRequest = {
  address: string;
};
export type IGetMyPositionResponse = {
  latitude: number;
  longitude: number;
};

export type IGetPlacePredictionRequest = Partial<google.maps.places.AutocompletionRequest>;
export type GetPlacePredictionResponse = google.maps.places.AutocompletePrediction[];

async function getGeolocationPermissionStatus(): Promise<PermissionState> {
  if ('permissions' in navigator) {
    return (await navigator.permissions.query({ name: 'geolocation' })).state;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      // successfully got location
      () => resolve('granted'),
      (error) => {
        // permission denied
        if (error.code == error.PERMISSION_DENIED) resolve('denied');

        // some other error, but not one which is related to a denied permission
        resolve('granted');
      },
      {
        maximumAge: Infinity,
        timeout: 0,
      }
    );
  });
}

async function getNotificationPermissionStatus() {
  if (!("Notification" in window)) {
    return 'null';
  } else if (Notification.permission === "granted") {
    return 'granted';
  } else if (Notification.permission === "default") {
    return 'default';
  }
}

async function askNotificationPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      return 'granted';
    } else {
      return 'null';
    }
  }).catch(() => {
    return 'null';
  })
}

export type IGetIsMyGeolocationAvailableResponse = void;
export type IGetIsMyGeolocationAvailableRequest = PermissionStatus['state'];
export type IGetMyPositionRequest = void;
const extendedApi = projectApi
  .enhanceEndpoints({ addTagTypes: [ApiTypes.Helpers] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMyLocation: builder.query<IGetMyLocationResponse, IGetMyLocationRequest>({
        query: ({ address }) => {
          const params = new URLSearchParams('');
          if (address) params.set('address', `${address}`);
          return {
            url: `get-location`,
            method: 'GET',
            credentials: 'same-origin',
            params,
          };
        },
      }),
      getPlacePredictions: builder.query<GetPlacePredictionResponse, IGetPlacePredictionRequest>({
        query: (body) => {
          return {
            url: `address-autocomplete`,
            method: 'POST',
            credentials: 'same-origin',
            body,
          };
        },
      }),
      getMyPositionFromIp: builder.query<IGetMyPositionResponse, IGetMyPositionRequest>({
        async queryFn() {
          const IPAddress = await publicIp.v4();
          const response = await fetch(
            `https://api.ipstack.com/${IPAddress}?access_key=e770814fa9a63c48cd67f41d190ab42f`

          ).then((res) => res.json());
          return {
            data: { latitude: response.latitude, longitude: response.longitude },
          };
        },
      }),
      isMyNotificationPermissionStatus: builder.query({
        async queryFn() {
          return { data: await getNotificationPermissionStatus() };
        },
      }),
      askNotificationsAccess: builder.query({
        async queryFn() {
          return { data: await askNotificationPermission() };
        },
      }),
      isMyGeoAvailableAtPageLoad: builder.query({
        async queryFn() {
          try {
            if ('permissions' in navigator) {
              const status = (await navigator.permissions.query({ name: 'geolocation' }))
                .state as PermissionState;
              return { data: status };
            }
            return { data: await getGeolocationPermissionStatus() };
          } catch (error) {
            return { error: true as never };
          }
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetMyLocationQuery,
  useGetPlacePredictionsQuery,
  useLazyGetPlacePredictionsQuery,
  useGetMyPositionFromIpQuery,
  useIsMyGeoAvailableAtPageLoadQuery,
  useIsMyNotificationPermissionStatusQuery,
  useAskNotificationsAccessQuery,
} = extendedApi;
