import { Alert, Snackbar, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { useNotificationContext } from 'src/view/components/NotificationsContext/NotificationsProvider';

const AlertSnackbar = ({ onClose, notification }) => {
  const top = useMediaQuery('(max-width:768px)');
  const {
    snackStatus: status,
    snackMessage: message,
    isSnackbarOpen: isOpen,
  } = useNotificationContext();
  return (
    <Snackbar
      open={isOpen}
      onClose={onClose}
      style={{ zIndex: 9999999999 }}
      anchorOrigin={{
        vertical: top ? 'top' : 'bottom',
        horizontal: top ? 'center' : 'right',
      }}
      autoHideDuration={5000}
    >
      <Alert
        variant='filled'
        onClose={onClose}
        severity={status}
        className={notification ? 'whiteNotification' : ''}
      >
        {message || ''}
      </Alert>
    </Snackbar>
  );
};

AlertSnackbar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  status: PropTypes.string,
  message: PropTypes.string,
  notification: PropTypes.bool,
};

export default AlertSnackbar;
