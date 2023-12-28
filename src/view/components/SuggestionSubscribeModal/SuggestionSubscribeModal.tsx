import React, { useCallback, useEffect, useState } from "react";
import ModalWindow from "../ModalWindow/ModalWindow";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../../../redux/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Box, Button } from "@mui/material";
import { requestForToken } from "../../../firebase/firebaseNotifications";
import { useBrowserNotifications } from "../../hooks/useBrowserNotifications";
import { currentAddedPlaceStatus, setPlaceAddedSuccessfully } from "../../../redux/userPlaces";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

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

const SuggestionSubscribeModal = () => {
  const dispatch = useAppDispatch();
  const isAddedSuccessfully = useAppSelector(currentAddedPlaceStatus);
  const [isOpen, setIsOpen] = useState(false);
  const { checkStatusNotificationsPermissions } = useBrowserNotifications();
  const { data: user } = useGetMyProfileQuery();
  const [update] = useUpdateMyProfileMutation();
  const isNotAllowedPush = user && user.notificationsBy && !user?.notificationsBy.includes('by-push');

  useEffect(() => {
    if (isAddedSuccessfully && checkStatusNotificationsPermissions() === 'default' && isNotAllowedPush) {
      setIsOpen(true);
      dispatch(setPlaceAddedSuccessfully({ isAddedSuccessfully: false }));
    }
  }, [isAddedSuccessfully, dispatch, isNotAllowedPush]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const onClickYes = useCallback(() => {
    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        setIsOpen(false);
        const token: string | null = await requestForToken();
        if (token) {
          const tokens = user?.tokens || [];
          const notificationsBy = user?.notificationsBy || [];
          update({
            id: user!._id,
            tokens: [...tokens, token],
            notificationsBy: [...notificationsBy, 'by-push'],
          });
        }
      } else {
        setIsOpen(false);
      }
    }).catch(() => {
      setIsOpen(false);
    })
  }, []);

  return (
    <ModalWindow open={isOpen} handleClose={handleClose}>
      <Box sx={style} className='modalLogout'>
        <button className='modalLogout-close' onClick={() => handleClose()}>
          <FontAwesomeIcon icon={solid('close')} />
        </button>
        <div>
          <p className='modalLogout-subTitle'>
            Do you want to start receiving PUSH notifications?
          </p>
          <div className='modalLogout-actions'>
            <Button variant='outlined' onClick={() => onClickYes()}>Yes</Button>
            <Button variant='contained' onClick={() => handleClose()}>No</Button>
          </div>
        </div>
      </Box>
    </ModalWindow>
  );
};

export default SuggestionSubscribeModal;
