import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, FormControl, InputAdornment, TextField } from '@mui/material';
import {
  FacebookIcon,
  FacebookShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'next-share';
import React, { MouseEventHandler, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetSpecificIncidentQuery } from '../../../redux/incident';
import { useNotificationContext } from '../NotificationsContext/NotificationsProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 300,
  maxWidth: 600,
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

const ShareLinkWindow: React.FC<{
  handleClose: MouseEventHandler;
  incidentId: string;
}> = ({ handleClose, incidentId }) => {
  const { openSnackbar } = useNotificationContext();
  const location = useLocation();
  const link = window.location.origin;
  const width = 40;
  const shareLink = link + location.pathname;
  const { data } = useGetSpecificIncidentQuery({ incidentId }, { skip: !incidentId });
  // const category = data ? categories.find((i) => i.id === data?.incident?.type)?.name : '';
  // const hashtag = `#meercat #${category}`;
  const hashtag = `#meercat`;

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(link + location.pathname).then(
      () => {
        openSnackbar({
          open: true,
          status: 'success',
          message: 'Link copied to clipboard',
        });
      },
      () => {
        openSnackbar({
          open: true,
          status: 'warning',
          message: 'Something went wrong. Please, try again',
        });
      }
    );
  }, [location.pathname, openSnackbar]);

  return (
    <Box sx={style} className='modalLogout'>
      <button className='modalLogout-close' onClick={handleClose}>
        <FontAwesomeIcon icon={solid('close')} />
      </button>
      <p>Share</p>
      <div style={{ width: '100%' }}>
        <div className='modalLogout-soc'>
          <FacebookShareButton blankTarget url={shareLink} quote='Meercat' hashtag={hashtag}>
            <FacebookIcon size={width} round />
          </FacebookShareButton>
          <InstapaperShareButton url={shareLink} title='Meercat'>
            <InstapaperIcon size={width} round />
          </InstapaperShareButton>
          <TwitterShareButton url={shareLink} title='Meercat'>
            <TwitterIcon size={width} round />
          </TwitterShareButton>
          <PinterestShareButton url={shareLink} media='Meercat'>
            <PinterestIcon size={width} round />
          </PinterestShareButton>
          <RedditShareButton url={shareLink} title='Meercat'>
            <RedditIcon size={width} round />
          </RedditShareButton>
          <TelegramShareButton url={shareLink} title='Meercat'>
            <TelegramIcon size={width} round />
          </TelegramShareButton>
          <LinkedinShareButton url={shareLink}>
            <LinkedinIcon size={width} round />
          </LinkedinShareButton>
        </div>
        <div style={{ width: '100%' }}>
          <FormControl fullWidth>
            <TextField
              value={`${link}${location.pathname}`}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <Button variant='contained' onClick={copyLink}>
                      Copy
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </div>
      </div>
    </Box>
  );
};

export default ShareLinkWindow;
