import { memo, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../../../../hooks/useRedux';
import { useGetMyProfileQuery } from '../../../../redux/auth';
import { useAddPlaceMutation, useEditPlaceMutation } from '../../../../redux/places';

import {
  EUserPlaceContainer,
  InitEditablePlaceSelector,
  changeUserPreview,
  currentUserStep,
  isEditStatusSelector,
  setPlaceAddedSuccessfully
} from "src/redux/userPlaces";
import { EUserProfilePreview } from '../../../../types/IPlaces';
import { useNotificationContext } from '../../NotificationsContext/NotificationsProvider';
import UserPlaceParams from './UserPlaceParams';
import UserProfilePlace from './UserProfilePlace';

const UserPlaceContainer = () => {
  const { openSnackbar } = useNotificationContext();
  const dispatch = useAppDispatch();

  const userStep = useAppSelector(currentUserStep);
  const editablePlace = useAppSelector(InitEditablePlaceSelector);
  const isEdit = useAppSelector(isEditStatusSelector);

  const { data: user } = useGetMyProfileQuery();

  const [addPlace, { isSuccess: isAddedSuccessfully, isError: isAddingError }] =
    useAddPlaceMutation();
  const [editPlace, { isSuccess: isEditSuccessfully, isError: isEditError }] =
    useEditPlaceMutation();

  useEffect(() => {
    if (isAddingError) {
      openSnackbar({
        open: true,
        status: 'error',
        message: 'Something went wrong. Please try again',
      });
    }
    if (isEditError) {
      openSnackbar({
        open: true,
        status: 'error',
        message: 'Something went wrong. Please try again',
      });
    }
  }, [isAddingError, isEditError, openSnackbar]);

  useEffect(() => {
    if (isAddedSuccessfully) {
      dispatch(changeUserPreview({ isUserPreview: EUserProfilePreview.PREVIEW }));
      dispatch(setPlaceAddedSuccessfully({ isAddedSuccessfully: true }));
      openSnackbar({
        open: true,
        status: 'success',
        message: 'New address added successfully',
      });
    }
    if (isEditSuccessfully) {
      dispatch(changeUserPreview({ isUserPreview: EUserProfilePreview.PREVIEW }));
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Address edited successfully',
      });
    }
  }, [isAddedSuccessfully, dispatch, isEditSuccessfully, openSnackbar]);

  const onSaveUserPlace = useCallback(() => {
    if (user) {
      if (!isEdit) {
        const { radius, longitude, address, latitude, label, types } = editablePlace;
        if (radius && longitude && address && longitude && latitude && label && types) {
          addPlace({
            userId: user?._id,
            radius,
            longitude,
            address,
            latitude,
            label,
            types,
          });
        }
      }
      if (isEdit) {
        const { _id: id, radius, longitude, address, latitude, label, types } = editablePlace;
        editPlace({ id, radius, longitude, address, latitude, label, types });
      }
    }
  }, [user, isEdit, editablePlace, addPlace, editPlace]);

  switch (userStep) {
    case EUserPlaceContainer.INFO:
      return <UserProfilePlace />;
    case EUserPlaceContainer.PARAMS:
      return <UserPlaceParams onSaveUserPlace={onSaveUserPlace} />;
    default:
      return <></>;
  }
};

export default memo(UserPlaceContainer);
