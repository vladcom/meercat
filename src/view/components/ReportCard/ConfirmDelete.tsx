import { Box, Button, CircularProgress } from '@mui/material';
import { memo } from 'react';

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

const ConfirmDelete: React.FC<{
  handleClose: () => void;
  onDeleteInc: () => void;
  createReportLoading: boolean;
}> = ({ handleClose, onDeleteInc, createReportLoading }) => (
  <Box sx={style} className='modalLogout'>
    <div>
      <p className='modalLogout-title'>Delete Incident</p>
      <p className='modalLogout-subTitle'>
        This action cannot ge undone. Are you sure you want to delete this incident?
      </p>
    </div>
    <div className='modalLogout-actions'>
      <Button variant='outlined' onClick={handleClose} disabled={createReportLoading}>
        Cancel
      </Button>
      <Button
        style={{ width: '89px' }}
        color='error'
        variant='contained'
        onClick={onDeleteInc}
        disabled={createReportLoading}
      >
        {createReportLoading ? (
          <CircularProgress style={{ width: '16px', height: '16px' }} />
        ) : (
          'Delete'
        )}
      </Button>
    </div>
  </Box>
);

export default memo(ConfirmDelete);
