/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { GeolocatedResult, useGeolocated, GeolocatedConfig } from 'react-geolocated';
import { useIsMyGeoAvailableAtPageLoadQuery } from 'src/redux/helpers';

// Define a TypeScript type for the properties that can be passed to the custom hook.
type IBrowserGeolocationProps = Partial<
  Pick<
    GeolocatedConfig,
    | 'onSuccess'
    | 'onError'
    | 'suppressLocationOnMount'
    | 'watchPosition'
    | 'positionOptions'
    | 'isOptimisticGeolocationEnabled'
  >
>;

// Define the custom hook named useBrowserGeolocation.
export function useBrowserGeolocation({
  onError,
  onSuccess,
  suppressLocationOnMount = false,
  watchPosition,
  positionOptions,
  isOptimisticGeolocationEnabled,
}: IBrowserGeolocationProps = {}): GeolocatedResult {
  // Use a custom query hook to check if browser geolocation is available at page load.
  const { data: geolocationAvailability, error } = useIsMyGeoAvailableAtPageLoadQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 2000,
  });

  // Configure geolocation options using another custom hook.
  const options = useGeolocated({
    // Determine if geolocation should be suppressed on mount based on availability and input.
    suppressLocationOnMount:
      suppressLocationOnMount === false ? geolocationAvailability !== 'granted' : true,

    // Determine if optimistic geolocation is enabled based on availability and input.
    isOptimisticGeolocationEnabled:
      typeof isOptimisticGeolocationEnabled === 'undefined'
        ? !error && geolocationAvailability === 'granted'
        : isOptimisticGeolocationEnabled,

    // Set geolocation watch and position options, with fallbacks.
    watchPosition: watchPosition ?? true,
    positionOptions: { enableHighAccuracy: false, ...positionOptions },
    onError,
    onSuccess,
  });

  // Use an effect to log the geolocation availability and trigger getPosition if available.
  useEffect(() => {
    if (options && geolocationAvailability === 'granted') {
      options.getPosition();
    }
  }, [geolocationAvailability]);

  // Return the configured options for using geolocation.
  return options;
}
