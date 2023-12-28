import { Box, useMediaQuery } from '@mui/material';
import isEmpty from 'lodash.isempty';
import { useMemo } from 'react';
import { useGetMyProfileQuery } from 'src/redux/auth';
import Login from '../Login/Login';
import UserProfile from '../UserProfile/UserProfile';
import './style.scss';

const Navigation = () => {
  const { data: user } = useGetMyProfileQuery();
  const matches = useMediaQuery('(max-width:768px)');

  const renderContent = useMemo(() => {
    if (isEmpty(user)) {
      return <Login />;
    }
    return <UserProfile />;
  }, [user]);

  return (
    <Box
      role='presentation'
      className='navigation'
      sx={{ width: matches ? '100vw' : '370px', height: '100%' }}
    >
      {renderContent}
    </Box>
  );
};
export default Navigation;
