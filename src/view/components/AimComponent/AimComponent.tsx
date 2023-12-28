import { CircularProgress } from '@mui/material';
import circle from '@turf/circle';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { memo, useEffect, useMemo } from 'react';
import { Layer, Source } from 'react-map-gl';
import { calculateDistance, isRadiusFeatureEnabled } from 'src/utils/calculatePointDistance';
import { useGetIncidentTypesQuery } from '../../../redux/incident';
import shooting from '../../../static/img/MarkerCategories/shooting.svg';
import { IReportWindowForm } from '../ReportWindow/ReportWindow';
import css from './AimComponents.module.scss';

const paint = {
  'fill-color': 'red',
  'fill-opacity': 0.2,
};
type IAimComponentProps = { type: string };

export const IS_RADIUS_FEATURE_ENABLED = isRadiusFeatureEnabled();

export const RADIUS_FOR_CREATING_INCIDENT = +(
  import.meta.env.VITE_APP_RADIUS_FOR_CREATING_INCIDENT ?? 50
);

const AimComponent = ({ type }: IAimComponentProps) => {
  const { values, setFieldValue } = useFormikContext<IReportWindowForm>();
  const { data: incidentTypes, isLoading } = useGetIncidentTypesQuery(undefined);

  const srcImage = useMemo(() => {
    return incidentTypes?.find((val) => val._id === type)?.icon ?? shooting;
  }, [type, incidentTypes]);

  const circleIcon = useMemo(
    () => {
      if (!values?.coords || !IS_RADIUS_FEATURE_ENABLED) return undefined;
      let center: number[] = [];
      const latitude = values?.coords?.latitude;
      const longitude = values?.coords?.longitude;
      if (latitude && longitude) {
        center = [longitude, latitude];
      } else {
        return undefined;
      }
      return circle(center, RADIUS_FOR_CREATING_INCIDENT, {
        units: 'meters',
        properties: { pizdec: true },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values?.coords?.latitude, values?.coords?.longitude]
  );

  useEffect(() => {
    if (!values?.coords || !values) return undefined;
    if (IS_RADIUS_FEATURE_ENABLED) {
      const posLatitude = values?.coords?.latitude;
      const posLongitude = values?.coords?.longitude;
      const pointLatitude = values?.latitude;
      const pointLongitude = values?.longitude;
      const distance = calculateDistance(
        { lat: posLatitude, lng: posLongitude },
        { lat: pointLatitude, lng: pointLongitude },
        'm'
      );
      setFieldValue('isMarkerOverlay', distance <= RADIUS_FOR_CREATING_INCIDENT);
      return;
    } else {
      setFieldValue('isMarkerOverlay', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.coords?.latitude, values?.coords?.longitude, IS_RADIUS_FEATURE_ENABLED]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <img
        className={classNames(css.aim, !values.isMarkerOverlay && css.blocked)}
        src={srcImage}
        draggable={false}
        alt={srcImage}
      />
      {circleIcon && (
        <Source type='geojson' data={circleIcon}>
          <Layer id={`aim_round`} type='fill' paint={paint} />
        </Source>
      )}
    </>
  );
};

export default memo(AimComponent);
