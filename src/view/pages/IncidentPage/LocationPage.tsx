import { PropsWithChildren, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ZOOM_FOR_INCIDENT_PREVIEW } from 'src/constants/map';
import { Incident } from 'src/helpers/Incident';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { selectHoursFilterInput } from 'src/redux/dashboard';
import { onChangeMapCenter } from 'src/redux/dashboard/reducer';
import { useGetSpecificIncidentQuery } from 'src/redux/incident';
import { isMapMountedSelector } from 'src/redux/map';
import { useMapStore } from 'src/view/components/MapContext';
import { shallow } from 'zustand/shallow';
export type LocationsList = { [key in string]?: string };

const LocationPage: React.FC<PropsWithChildren> = ({ children }) => {
  const { incidentId: incidentId = '' } = useParams<LocationsList>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isLoad = useAppSelector(isMapMountedSelector);
  const hoursFilterInput = useAppSelector(selectHoursFilterInput);
  const { data, isSuccess } = useGetSpecificIncidentQuery(
    { incidentId },
    {
      skip: !incidentId,
      refetchOnReconnect: true,
    }
  );

  const { planTo, map } = useMapStore(
    (state) => ({ planTo: state.planTo, map: state.map }),
    shallow
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const isZoomAvailable = searchParams.get('zoom') === 'true' || history.action === 'POP';
    const isAnimate = history.action === 'PUSH';

    if (isZoomAvailable && isSuccess && isLoad && map.current) {
      const { latitude, longitude } = data?.incident;
      if (!latitude || !longitude) return;
      dispatch(
        onChangeMapCenter({
          zoom: ZOOM_FOR_INCIDENT_PREVIEW,
          center: { lat: latitude, lng: longitude },
        })
      );
      planTo({ latitude, longitude, zoom: ZOOM_FOR_INCIDENT_PREVIEW, animate: isAnimate });

      if (
        Incident.open({
          dispatch,
          geoJSON: data.geoJson,
          incident: data.incident,
          hoursFilterInput,
        })
      ) {
        return () => {
          Incident.close({ dispatch });
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, history.action, isLoad, planTo]);

  return <>{children}</>;
};

export default LocationPage;
