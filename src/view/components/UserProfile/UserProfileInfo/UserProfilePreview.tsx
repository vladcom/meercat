import LogoutIcon from '@mui/icons-material/Logout';
import WestIcon from '@mui/icons-material/West';
import { Avatar, Button } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useAppDispatch } from '../../../../hooks/useRedux';
import { useGetMyProfileQuery, useLogoutMutation } from '../../../../redux/auth';
import { setMainModalState } from '../../../../redux/modals';
import { changeUserPreview } from '../../../../redux/userPlaces';
import { EUserProfilePreview } from '../../../../types/IPlaces';
import { isNull } from '../../../../utils/isNull';
import UserPosts from '../UserPosts/UserPosts';
import UserProfilePlaces from '../UserProfilePlaces/UserProfilePlaces';
import { useHistory } from "react-router-dom";

enum UserProfileTabs {
  Alerts = 'Alerts',
  Posts = 'Posts',
}

const UserProfilePreview: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [logoutQuery] = useLogoutMutation();
  const { data: user } = useGetMyProfileQuery();
  const [activeTab, setActiveTab] = useState<UserProfileTabs>(UserProfileTabs.Alerts);
  const isFullInfo = isNull(user?.name && user?.phone && user?.email);

  const logout = useCallback(() => {
    logoutQuery();
  }, [logoutQuery]);

  const closeProfile = useCallback(() => {
    dispatch(setMainModalState({ isProfileWindowOpen: false }));
  }, [dispatch]);

  const onClickEditProfile = useCallback(() => {
    dispatch(changeUserPreview({ isUserPreview: EUserProfilePreview.USEREDIT }));
  }, [dispatch]);

  const changeTab = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = event.target as HTMLButtonElement;
    setActiveTab(target.name as UserProfileTabs);
  }, []);

  const onClickDashboard = useCallback(() => {
    history.push('/dashboard');
    dispatch(setMainModalState({ isProfileWindowOpen: false }));
  }, [history]);

  return (
    <div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={closeProfile}>
          <WestIcon />
        </Button>
        <Button onClick={logout}>
          <LogoutIcon />
        </Button>
      </div>
      <div className='userProfile-preview'>
        <div className='userProfile-preview-user'>
          <div className='userProfile-preview-user-avatar'>
            <Avatar alt='avatar' sx={{ width: 56, height: 56 }} />
          </div>
          <div className='userProfile-preview-user-editUser'>
            <Button onClick={onClickEditProfile} color={!isFullInfo ? 'primary' : 'error'}>
              {!isFullInfo ? 'Edit Profile' : 'Complete your profile'}
            </Button>
          </div>
          <p className='userProfile-preview-user-info'>
            All your profile information is private and cannot be seen by other users
          </p>
        </div>
        <div className='userProfile-preview-box'>
          <div className='userProfile-preview-box-selector'>
            <button name={UserProfileTabs.Alerts} onClick={changeTab}>
              Alerts
            </button>
            <button name={UserProfileTabs.Posts} onClick={changeTab}>
              Posts
            </button>
          </div>
          <div className='userProfile-preview-box-content'>
            {activeTab === UserProfileTabs.Alerts ? <UserProfilePlaces /> : <UserPosts />}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onClickDashboard} variant="text">Dashboard</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePreview;
