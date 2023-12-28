import React, { PropsWithChildren, memo, useEffect, useMemo } from 'react';
import { useAppDispatch } from 'src/hooks/useRedux';
import { onChangeMapCenter } from 'src/redux/dashboard/reducer';
import { useGetMyPositionFromIpQuery, useIsMyGeoAvailableAtPageLoadQuery } from 'src/redux/helpers';
import { useGetIncidentTypesQuery } from 'src/redux/incident';
import { ECordsSource, setMapLoader } from 'src/redux/map';
import { useBrowserGeolocation } from 'src/view/hooks/useBrowserGeolocation';

export type IGeolocation = {
  latitude: number;
  longitude: number;
  zoom?: number;
  animate?: boolean;
};

export function useGeolocation() {
  const dispatch = useAppDispatch();

  const { isGeolocationAvailable, isGeolocationEnabled, getPosition, positionError } =
    useBrowserGeolocation({
      suppressLocationOnMount: false,
      onSuccess(position) {
        if (
          !position?.coords?.latitude &&
          !position?.coords?.longitude &&
          position?.coords?.altitude &&
          position?.coords?.altitude <= 0
        )
          return;
        const center = {
          lat: position?.coords?.latitude ?? 0,
          lng: position?.coords?.longitude ?? 0,
        };
        dispatch(
          onChangeMapCenter({
            center,
          })
        );
        dispatch(
          setMapLoader({
            isGeoCordsGotten: true,
            cordsSource: ECordsSource.BROWSER,
            cords: center,
          })
        );
      },
    });

  const { data, isSuccess } = useGetMyPositionFromIpQuery(undefined, {
    skip: isGeolocationAvailable && isGeolocationEnabled && !positionError,
  });

  useEffect(() => {
    if (!data) return;
    const center = { lat: data.latitude, lng: data.longitude };
    dispatch(
      onChangeMapCenter({
        center,
      })
    );
    dispatch(
      setMapLoader({
        isGeoCordsGotten: true,
        cordsSource: ECordsSource.IP,
        cords: center,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return useMemo(
    () =>
      ({
        getPosition,
      } as const),
    [getPosition]
  );
}

const MapProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useGeolocation();

  return <>{children}</>;
};

function MapProviderWrapper({ children }: React.PropsWithChildren) {
  const { isSuccess, isError } = useIsMyGeoAvailableAtPageLoadQuery(undefined);
  useGetIncidentTypesQuery(undefined);
  if (isSuccess || isError) return <MapProvider>{children}</MapProvider>;
  return <></>;
}

export default memo(MapProviderWrapper);
