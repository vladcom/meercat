import { Button, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { memo, useCallback, useMemo } from 'react';
import { EUserProfilePreview } from 'src/types/IPlaces';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useRedux';
import { useGetMyProfileQuery } from '../../../../redux/auth';
import { useGetMyPlacesQuery } from '../../../../redux/places';
import {
  EUserPlaceContainer,
  InitEditablePlaceSelector,
  changeEditablePlace,
  changeUserPreview,
  changeUserStep,
  isEditStatusSelector,
} from '../../../../redux/userPlaces';
import UserProfileAutocomplete from './components/UserProfileAutocomplete';

export interface IUserPlaceFormikValues {
  _id?: string;
  label: string;
  address: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  types?: string[];
}

export interface IEditable extends Omit<IUserPlaceFormikValues, 'address'> {
  address: string;
}
const UserPlaceForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const editablePlace = useAppSelector(InitEditablePlaceSelector);
  const isEdit = useAppSelector(isEditStatusSelector);
  const { data: user } = useGetMyProfileQuery();
  const { data: userPlaces } = useGetMyPlacesQuery(undefined, { skip: !user?._id });

  const PlaceFormSchema = useMemo(
    () =>
      Yup.object({
        label: Yup.string()
          .test('unique', 'Already exist', (value) => {
            if (userPlaces && editablePlace) {
              return !Boolean(
                userPlaces.find(
                  (i) =>
                    i.label.toLowerCase() === value?.toLowerCase() && i?._id !== editablePlace?._id
                )
              );
            }
            return false;
          })
          .required('Required'),
        address: Yup.string().required('Required'),
        latitude: Yup.number().required('Required'),
        longitude: Yup.number().required('Required'),
      }),
    [editablePlace, userPlaces]
  );

  const onHandleSave = useCallback(
    (values: IUserPlaceFormikValues) => {
      dispatch(changeEditablePlace(values));
      dispatch(changeUserStep({ isUserStep: EUserPlaceContainer.PARAMS }));
    },
    [dispatch]
  );

  const onClickCancel = useCallback(() => {
    dispatch(changeUserPreview({ isUserPreview: EUserProfilePreview.PREVIEW }));
  }, [dispatch]);

  return (
    <Formik<IUserPlaceFormikValues>
      initialValues={{
        label: editablePlace?.label ?? '',
        address: editablePlace?.address ?? '',
        latitude: editablePlace?.latitude ?? 0,
        longitude: editablePlace?.longitude ?? 0,
      }}
      enableReinitialize
      validateOnMount={false}
      validationSchema={PlaceFormSchema}
      onSubmit={onHandleSave}
    >
      {({ isValid, handleChange, handleBlur, values, errors }) => {
        return (
          <Form>
            <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
              <span>Label</span>
              <TextField
                fullWidth
                size='small'
                id='label'
                name='label'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.label}
                error={!!errors.label}
                helperText={errors.label ?? ' '}
                margin='dense'
              />
            </div>
            <div>
              <span>Address</span>
              <UserProfileAutocomplete />
            </div>
            <div className='userProfile-places-modal-actions'>
              <Button variant='outlined' onClick={onClickCancel}>
                Cancel
              </Button>
              <Button type='submit' disabled={!isValid} variant='contained'>
                {isEdit ? 'Update' : 'Continue'}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(UserPlaceForm);
