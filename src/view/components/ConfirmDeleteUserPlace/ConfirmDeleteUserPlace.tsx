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

type ConfirmDeleteUserPlaceProps = {
  handleClose: () => void;
  onDeletePlace: () => void;
};
const ConfirmDeleteUserPlace: React.FC<ConfirmDeleteUserPlaceProps> = ({
  handleClose,
  onDeletePlace,
}) => {
    return  (
    <Box sx={style} className='modalLogout'>
      <div>
        <p className='modalLogout-title'>Delete location</p>
        <p className='modalLogout-subTitle'>
          This action cannot be undone. Are you sure you want to delete your location?
        </p>
      </div>
      <div className='modalLogout-actions'>
        <Button variant='contained' onClick={() => handleClose()}>
          Close
        </Button>
        <Button
          variant='outlined'
          onClick={onDeletePlace}
        >
          Yes
        </Button>
      </div>
    </Box>
  );
};
export default ConfirmDeleteUserPlace;
