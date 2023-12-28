import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import { Box, ButtonProps, CircularProgress, Fab } from '@mui/material';
import TextField from '@mui/material/TextField';
import { green, lightBlue } from '@mui/material/colors';
import { Virtualizer } from '@tanstack/react-virtual';
import { PropsWithChildren, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { selectScrollToVirtualState, useCreateCommentMutation } from 'src/redux/chat';
import { setMainModalState } from 'src/redux/modals';
import { LocationsList } from 'src/view/pages/IncidentPage/LocationPage';
import { useNotificationContext } from '../NotificationsContext/NotificationsProvider';

type ISaveButton = ButtonProps & { isLoading?: boolean; isSuccess?: boolean };
const SaveButton = function ({ isLoading, isSuccess, ...props }: ISaveButton) {
  const [success, setSuccess] = useState(false);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  //Add fancy success input animation
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isSuccess) {
      setSuccess(true);
      timerId = setTimeout(() => {
        setSuccess(false);
      }, 1000);
    }
    return () => {
      if (isSuccess) clearTimeout(timerId);
    };
  }, [isSuccess]);

  const renderSendButton = useMemo(() => {
    if (success) {
      return <CheckIcon />;
    }
    return <SendIcon className={props?.disabled ? 'disabledSentButton' : 'activeSentButton'} />;
  }, [success, props]);

  return (
    <Box sx={{ m: 1, position: 'relative' }}>
      <Fab
        type='submit'
        sx={buttonSx}
        aria-label='save'
        className='sendButtonMessage'
        disabled={isLoading || success || props?.disabled}
      >
        {!isLoading ? renderSendButton : (
          <CircularProgress
            size={32}
            sx={{
              color: lightBlue[500],
              // position: 'absolute',
              // top: -6,
              // left: -6,
              // zIndex: 1,
            }}
          />
        )}
      </Fab>
    </Box>
  );
};

type ScrollTo = Virtualizer<HTMLDivElement, HTMLDivElement>['scrollToIndex'];
type MessageFormProps = PropsWithChildren & { scrollTo: ScrollTo; userId: string | undefined };

function useCreateMessage(scrollTo: ScrollTo) {
  const [onCreateMessage, { isSuccess, isLoading }] = useCreateCommentMutation();
  const scrollToVirtualState = useAppSelector(selectScrollToVirtualState);

  useEffect(() => {
    if (isSuccess && scrollToVirtualState && scrollTo) {
      scrollTo(scrollToVirtualState, { behavior: 'smooth', align: 'start' });
    }
  }, [isSuccess, scrollTo, scrollToVirtualState]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ({ onCreateMessage, isLoading, isSuccess }), [isLoading, isSuccess]);
}

const MessageForm = function MessageForm({ children, scrollTo, userId }: MessageFormProps) {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { incidentId: id = '' } = useParams<LocationsList>();

  const [text, setText] = useState('');
  const { isLoading, isSuccess, onCreateMessage } = useCreateMessage(scrollTo);

  const { openSnackbar } = useNotificationContext();
  const isFormDisabled = !text.length;

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setText(e.target.value),
    []
  );

  const clickSend = useCallback(() => {
    if (!userId) return;
    onCreateMessage({ incidentId: id, text, userId });
    setText('');
  }, [userId, onCreateMessage, id, text]);

  const isShouldLogin = useCallback(() => {
    if (!userId) {
      dispatch(setMainModalState({ isProfileWindowOpen: true }));
      openSnackbar({
        open: true,
        status: 'warning',
        message: 'Please, login for sending message',
      });
      history.push('../');
    }
  }, [userId, dispatch, openSnackbar, history]);

  return (
    <>
      {children}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          clickSend();
        }}
        className='messages-form'
      >
        <TextField
          value={text}
          variant='outlined'
          autoComplete="off"
          onChange={onChangeText}
          onClick={isShouldLogin}
          placeholder='Leave your comment...'
          InputProps={{
            endAdornment: (
              <SaveButton isLoading={isLoading} isSuccess={isSuccess} disabled={isFormDisabled} />
            ),
          }}
        />
      </form>
    </>
  );
};

export default memo(MessageForm);
