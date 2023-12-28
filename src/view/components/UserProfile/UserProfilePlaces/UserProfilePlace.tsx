import WestIcon from '@mui/icons-material/West';
import { Button } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useRedux';
import {
  InitEditablePlaceSelector,
  changeUserPreview,
  clearEditablePlace,
  isEditStatusSelector,
} from '../../../../redux/userPlaces';
import ConfirmDeleteUserPlace from '../../ConfirmDeleteUserPlace/ConfirmDeleteUserPlace';
import ModalWindow from '../../ModalWindow/ModalWindow';
import UserPlaceForm from './UserPlaceForm';
import { useDeleteMyPlaceMutation } from 'src/redux/places';
import { useNotificationContext } from '../../NotificationsContext/NotificationsProvider';
import { EUserProfilePreview } from 'src/types/IPlaces';

const UserProfilePlace: React.FC = () => {
  const dispatch = useAppDispatch();
  const { openSnackbar } = useNotificationContext();

  const isEdit = useAppSelector(isEditStatusSelector);
  const editablePlace = useAppSelector(InitEditablePlaceSelector);

  const [deletePlace, { isSuccess: isDeletedSuccessfully, isError: isDeleteError }] =
    useDeleteMyPlaceMutation();

  useEffect(() => {
    if (isDeleteError) {
      openSnackbar({
        open: true,
        status: 'error',
        message: 'Something went wrong. Please try again',
      });
    }
  }, [isDeleteError, openSnackbar]);
  useEffect(() => {
    if (isDeletedSuccessfully) {
      dispatch(changeUserPreview({ isUserPreview: EUserProfilePreview.PREVIEW }));
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Address deleted successfully',
      });
    }
  }, [dispatch, isDeletedSuccessfully, openSnackbar]);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const handleOpen = () => {
    setIsConfirmationOpen(true);
  };
  const handleClose = () => {
    setIsConfirmationOpen(false);
  };

  const onClickBack = useCallback(() => {
    dispatch(clearEditablePlace());
  }, [dispatch]);

  const confirmDelete = useCallback(() => {
    if (editablePlace?._id) deletePlace({ placeId: editablePlace?._id });
  }, [editablePlace?._id, deletePlace]);

  const renderDeleteButton = useMemo(() => {
    if (isEdit && editablePlace?._id) {
      return (
        <div
          style={{
            marginTop: '30px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button color='error' onClick={handleOpen}>
            Delete this location
          </Button>
        </div>
      );
    }
  }, [isEdit, editablePlace?._id]);

  return (
    <div className='userProfile-placeInfo'>
      <div className='userProfile-placeInfo-header'>
        <Button className='navigation-hidden' onClick={onClickBack}>
          <WestIcon />
        </Button>
        <p className='userProfile-placeInfo-header-title'>Location</p>
      </div>
      <UserPlaceForm />
      {renderDeleteButton}
      <ModalWindow open={isConfirmationOpen} handleClose={handleClose}>
        <ConfirmDeleteUserPlace handleClose={handleClose} onDeletePlace={confirmDelete} />
      </ModalWindow>
    </div>
  );
};

export default UserProfilePlace;
