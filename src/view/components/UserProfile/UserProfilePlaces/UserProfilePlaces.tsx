import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useGetMyProfileQuery } from 'src/redux/auth';
import {
  useAddPlaceMutation,
  useDeleteMyPlaceMutation,
  useEditPlaceMutation,
  useGetMyPlacesQuery,
} from 'src/redux/places';
import { EUserProfilePreview } from 'src/types/IPlaces';
import { useAppDispatch } from '../../../../hooks/useRedux';
import { changeUserPreview, clearEditablePlace } from '../../../../redux/userPlaces';
import { useNotificationContext } from '../../NotificationsContext/NotificationsProvider';
import UserProfilePlaceItem from '../UserProfileInfo/UserProfilePlaceItem';

const UserProfilePlaces: React.FC = () => {
  const { openSnackbar } = useNotificationContext();
  const dispatch = useAppDispatch();
  const { data: user } = useGetMyProfileQuery();
  const { data: userPlaces, isSuccess } = useGetMyPlacesQuery(undefined, { skip: !user?._id });
  const [, { isSuccess: isAddedSuccessfully, isError: isAddingError }] = useAddPlaceMutation();
  const [, { isSuccess: isEditSuccessfully, isError: isEditError }] = useEditPlaceMutation();
  const [, { isSuccess: isDeletedSuccessfully, isError: isDeleteError }] =
    useDeleteMyPlaceMutation();

  // const onDeleteLocation = useCallback(
  //   (id: string) => {
  //     deletePlace({ placeId: id });
  //   },
  //   [deletePlace]
  // );

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
    if (isDeleteError) {
      openSnackbar({
        open: true,
        status: 'error',
        message: 'Something went wrong. Please try again',
      });
    }
  }, [isAddingError, isEditError, isDeleteError, openSnackbar]);
  useEffect(() => {
    if (isAddedSuccessfully) {
      openSnackbar({
        open: true,
        status: 'success',
        message: 'New address added successfully',
      });
    }
    if (isEditSuccessfully) {
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Address edited successfully',
      });
    }
    if (isDeletedSuccessfully) {
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Address deleted successfully',
      });
    }
  }, [isAddedSuccessfully, isEditSuccessfully, isDeletedSuccessfully, openSnackbar]);

  const renderPlaces = useMemo(() => {
    if (isEmpty(userPlaces)) {
      return <></>;
    }
    return userPlaces?.map((item) => <UserProfilePlaceItem item={item} key={item?._id} />);
  }, [userPlaces]);

  const onHandleForm = useCallback(() => {
    if (isSuccess) {
      dispatch(clearEditablePlace());
      dispatch(changeUserPreview({ isUserPreview: EUserProfilePreview.PLACEINFO }));
    }
  }, [dispatch, isSuccess]);

  return (
    <div className='userProfile-places'>
      <div className='userProfile-places-container'>{renderPlaces}</div>
      <div className='userProfile-preview-box-content-add' onClick={onHandleForm}>
        <p>Add new location</p>
        <NavigateNextIcon />
      </div>
    </div>
  );
};

export default UserProfilePlaces;
