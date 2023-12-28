import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, CircularProgress, FormControlLabel, FormGroup, TextField, Switch as MatSwitch  } from "@mui/material";
import { createSelector } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import React, { memo, useEffect, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { NavLink, Route, useHistory, useParams, Switch } from 'react-router-dom';
import { useAppSelector } from 'src/hooks/useRedux';
import { useGetMyProfileQuery } from 'src/redux/auth';
import { selectDashboard } from 'src/redux/dashboard';
import { useGetIncidentTypesQuery, usePostNewIncidentMutation } from 'src/redux/incident';
import { selectMap } from 'src/redux/map';
import { isRadiusFeatureEnabled } from 'src/utils/calculatePointDistance';
import * as Yup from 'yup';
import { formatIncidentName } from '../../../helpers/formatIncidentName';
import { getIncidentName } from '../../../helpers/getIncidentName';
import { camelToSnake } from '../../../utils/camelToSnake';
import Mapbox from '../Mapbox';
import { useNotificationContext } from '../NotificationsContext/NotificationsProvider';
import CategorySelection from './CategorySelection';
import ImageUpload from './ReportForm/ImageUpload';
import ReportProviderWrapper from './ReportWrapper';
import './style.scss';

//TODO: Fix flow when user change GEOCORDS to IP discovery
export type IReportWindowForm = {
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  userId: string;
  imageUrl?: string;
  willCreateAt?: number;
  coords?: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
  isMarkerOverlay?: boolean;
  allowComments: boolean;
};

const ReportSchema = Yup.object({
  type: Yup.string().required(),
  description: Yup.string().notRequired(),
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
  userId: Yup.string().required(),
  imageUrl: Yup.string().notRequired(),
  willCreateAt: Yup.number()
    .min(new Date().valueOf(), 'Date must be after current time today')
    .notRequired(),
  coords: Yup.object().notRequired(),
  isMarkerOverlay: Yup.boolean().isTrue().notRequired(),
  allowComments: Yup.boolean().notRequired(),
});

export function useType() {
  const { type } = useParams<{ type: string }>();

  return useMemo(() => {
    return type;
  }, [type]);
}

const selectReportWindow = createSelector(selectDashboard, (state) => state.reportedPosition);

const selectCords = createSelector(selectMap, (state) => state.mapInitialCords.cords);
const SelectByType = memo(function SelectByType() {
  const type = useType();
  const history = useHistory();
  const { openSnackbar } = useNotificationContext();
  const reportedPosition = useAppSelector(selectReportWindow, shallowEqual);
  const { data: user } = useGetMyProfileQuery();
  const [postNewIncident, { isLoading, isSuccess, data }] = usePostNewIncidentMutation();
  const coordsFromGeo = useAppSelector(selectCords, shallowEqual);
  const { data: incidentTypes, isSuccess: isIncidentTypeLoadedSuccess } =
    useGetIncidentTypesQuery(undefined);

  useEffect(() => {
    if (isSuccess) {
      history.push(`/${data?._id}?zoom=true`);
      openSnackbar({
        open: true,
        status: 'success',
        message: 'New incident added successfully',
      });
    }
  }, [isSuccess, data, history, openSnackbar]);
  if (isIncidentTypeLoadedSuccess) {
    return (
      <Formik<IReportWindowForm>
        initialValues={{
          type,
          latitude: reportedPosition.lat,
          longitude: reportedPosition.lng,
          userId: user?._id ?? '',
          description:
            formatIncidentName(camelToSnake(getIncidentName({ obj: incidentTypes, type: type }))) ??
            '',
          coords: {
            latitude: coordsFromGeo?.lat ?? 0,
            longitude: coordsFromGeo?.lng ?? 0,
          },
          isMarkerOverlay: !isRadiusFeatureEnabled(),
          allowComments: true,
        }}
        validationSchema={ReportSchema}
        enableReinitialize
        onSubmit={({ isMarkerOverlay, coords, ...postNewIncidentContent }) =>
          postNewIncident(postNewIncidentContent)
        }
      >
        {({ errors, handleChange, handleBlur, values }) => {
          return (
            <Form>
              <div className='reportWindow-header'>
                <NavLink to={`/new-incident`} className='reportWindow-close'>
                  <ArrowBackIcon />
                </NavLink>
                <div className='reportWindow-category-header-text'>
                  <p>Incident details</p>
                </div>
                <Button
                  size='small'
                  type='submit'
                  variant='contained'
                  style={{ width: 75 }}
                  disabled={isLoading || Object.keys(errors).length > 0}
                >
                  {isLoading ? (
                    <CircularProgress style={{ color: 'white', height: '27px', width: '27px' }} />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
              <div className='reportWindow-map'>
                <div className='map'>
                  <Mapbox.Report />
                </div>
                <div className='reportWindow-form'>
                  <div className='reportWindow-fieldBox'>
                    <TextField
                      rows={3}
                      multiline
                      fullWidth
                      variant='filled'
                      name='description'
                      id='description'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      placeholder='Add incident details'
                      error={!!errors.description}
                      helperText={errors.description}
                    />
                    <div className="reportWindow-form-actions">
                      <ImageUpload />
                      <FormGroup>
                        <FormControlLabel
                          labelPlacement="start"
                          control={
                            <MatSwitch checked={values.allowComments} onChange={handleChange} id="allowComments" name="allowComments" />
                          }
                          label="Allow comments"
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }

  return <></>;
});

const ReportWindow = () => {
  return (
    <ReportProviderWrapper>
      <div className='reportWindow'>
        <Switch>
          <Route path='/new-incident/:type' component={SelectByType} />
          <Route path='/new-incident' component={CategorySelection} />
        </Switch>
      </div>
    </ReportProviderWrapper>
  );
};

export default memo(ReportWindow);
