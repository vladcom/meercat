import React, { useCallback, useMemo, useState } from 'react';
import {
  useDeleteMyProfileMutation,
  useGetMyProfileQuery,
  useLogoutMutation,
} from 'src/redux/auth';
import ConfirmDeleteUser from '../ConfirmDeleteUser/ConfirmDeleteUser';
import ModalWindow from '../ModalWindow/ModalWindow';
import UserProfileInfo from './UserProfileInfo/UserProfileInfo';
import './styles.scss';
import UserProfilePreview from './UserProfileInfo/UserProfilePreview';
import WestIcon from '@mui/icons-material/West';
import { EUserProfilePreview } from '../../../types/IPlaces';
import UserPlaceContainer from './UserProfilePlaces/UserPlaceContainer';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { changeUserPreview, currentUserPreview } from '../../../redux/userPlaces';
import SuggestionSubscribeModal from "../SuggestionSubscribeModal/SuggestionSubscribeModal";

export const UserProfileFullInfo: React.FC = () => {
  const { data: profile } = useGetMyProfileQuery();
  const dispatch = useAppDispatch();
  const [logoutQuery] = useLogoutMutation();
  const [deleteQuery] = useDeleteMyProfileMutation();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const deleteRequest = useCallback(() => {
    console.log('delete request: ', profile?._id, profile);
    if (profile?._id) deleteQuery({ id: profile._id });
  }, [deleteQuery, profile]);

  const logout = useCallback(() => {
    logoutQuery();
  }, [logoutQuery]);

  const handleOpen = () => {
    setIsConfirmationOpen(true);
  };
  const handleClose = () => {
    setIsConfirmationOpen(false);
  };
  return (
    <>
      <div style={{ width: '100%' }}>
        <div className='userProfile-info-header'>
          <button
            className='userProfile-info-header-back'
            onClick={() =>
              dispatch(changeUserPreview({ isUserPreview: EUserProfilePreview.PREVIEW }))
            }
          >
            <WestIcon />
          </button>
          <p className='userProfile-info-title'>Profile</p>
          <button className='userProfile-info-header-delete' onClick={handleOpen}>
            Delete
          </button>
        </div>
        <UserProfileInfo />
      </div>
      <ModalWindow open={isConfirmationOpen} handleClose={handleClose}>
        <ConfirmDeleteUser
          handleClose={handleClose}
          logout={logout}
          onDeleteAccount={deleteRequest}
        />
      </ModalWindow>
    </>
  );
};

const UserProfile = () => {
  const userPreview = useAppSelector(currentUserPreview);

  const renderUserProfile = useMemo(() => {
    if (userPreview === EUserProfilePreview.PREVIEW) {
      return <UserProfilePreview />;
    }
    if (userPreview === EUserProfilePreview.USEREDIT) {
      return <UserProfileFullInfo />;
    }
    if (userPreview === EUserProfilePreview.PLACEINFO) {
      return <UserPlaceContainer />;
    }
  }, [userPreview]);

  return (
    <div className='userProfile'>
      {renderUserProfile}
      <SuggestionSubscribeModal />
    </div>
  );
};

export default UserProfile;
