import React from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import './style.scss';

const ModalWindow = ({
  open,
  children,
  handleClose
}) => (
  <Modal
    keepMounted
    open={open}
    closeAfterTransition
    onClose={handleClose}
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    slots={{
      backdrop: Backdrop
    }}
    slotsProps={{
      backdrop: {
        timeout: 500
      }
    }}
  >
    <Fade in={open}>
      <Box>
        {children}
      </Box>
    </Fade>
  </Modal>
);

ModalWindow.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.object,
  handleClose: PropTypes.func
};

export default ModalWindow;
