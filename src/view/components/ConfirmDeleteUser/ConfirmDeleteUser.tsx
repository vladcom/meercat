import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

type ConfirmDeleteUserProps = {
  handleClose: () => void;
  logout: () => void;
  onDeleteAccount: () => void;
};
const ConfirmDeleteUser: React.FC<ConfirmDeleteUserProps> = ({
  handleClose,
  logout,
  onDeleteAccount,
}) => {
  const [step, setStep] = useState(0);

  const renderSteps = useMemo(() => {
    if (step === 0) {
      return (
        <Box sx={style} className='modalLogout'>
          <div>
            <p className='modalLogout-title'>Delete account</p>
            <p className='modalLogout-subTitle'>Would you like to delete your account?</p>
          </div>
          <div className='modalLogout-actions'>
            <Button variant='contained' onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button variant='outlined' onClick={() => setStep(1)}>
              Delete
            </Button>
          </div>
        </Box>
      );
    }
    if (step === 1) {
      return (
        <Box sx={style} className='modalLogout'>
          <div>
            <p className='modalLogout-title'>Delete account</p>
            <p className='modalLogout-subTitle'>
              This action cannot ge undone. Are you sure you want to delete your account?
            </p>
          </div>
          <div className='modalLogout-actions'>
            <Button variant='contained' onClick={() => handleClose()}>
              Close
            </Button>
            <Button
              variant='outlined'
              onClick={() => {
                setStep(2);
                onDeleteAccount();
              }}
            >
              Yes
            </Button>
          </div>
        </Box>
      );
    }
    if (step === 2) {
      return (
        <Box sx={style} className='modalLogout'>
          <div>
            <p className='modalLogout-subTitle'>Your account has been deleted.</p>
            <p className='modalLogout-subTitle'>
              You may not be able to create a new account with the same phone number for upto 48
              hours
            </p>
          </div>
          <div className='modalLogout-actions'>
            <Button variant='contained' onClick={() => logout()}>
              Ok
            </Button>
          </div>
        </Box>
      );
    }
  }, [step, handleClose, logout, onDeleteAccount]);

  return <>{renderSteps}</>;
};

ConfirmDeleteUser.propTypes = {
  logout: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
};

export default ConfirmDeleteUser;
