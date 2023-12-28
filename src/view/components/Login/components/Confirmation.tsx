import { Button, CircularProgress } from '@mui/material';
import { memo, useCallback, useEffect, useState } from 'react';
import ReactCodeInput from 'react-code-input';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { selectPhoneSignInMode, useApproveAuthByPhoneMutation } from 'src/redux/auth';
import { isErrorWithMessage } from 'src/redux/heleper';
import { setMainModalState } from 'src/redux/modals';
import { useNotificationContext } from '../../NotificationsContext/NotificationsProvider';
import useLogin from '../hooks/useLogin';

const isCodeTypedFully = (code: string) => code.length === 4;

const ResendCode = () => {
  const [isShouldResend, setShouldResend] = useState(false);
  const signInPhone = useAppSelector(selectPhoneSignInMode);

  const { isLoading, login } = useLogin();

  const resendCode = useCallback(() => {
    login(signInPhone);
    setShouldResend(false);
  }, [signInPhone, login]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldResend(true);
      //30 seconds
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [isShouldResend]);

  if (isShouldResend)
    return (
      <div className='resend'>
        <p>Didn&apos;t get SMS code?</p>
        {isLoading ? (
          <div style={{ marginTop: 20 }}>
            <CircularProgress />
          </div>
        ) : (
          <button onClick={resendCode}>Resent code</button>
        )}
      </div>
    );
  return <></>;
};

const Confirmation: React.FC = () => {
  const dispatch = useAppDispatch();
  const { openSnackbar } = useNotificationContext();

  const signInPhone = useAppSelector(selectPhoneSignInMode);
  const [code, setCode] = useState('');
  const onChangeCode = useCallback((value: string) => setCode(value.replace(/[^0-9.]/g, '')), []);

  const [approveAuthByPhone, { isError, isSuccess, isUninitialized, error }] =
    useApproveAuthByPhoneMutation();

  const onClickConfirm = useCallback(() => {
    approveAuthByPhone({
      code,
      phone: signInPhone,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, [approveAuthByPhone, code, signInPhone]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setMainModalState({ isProfileWindowOpen: false }));
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Success',
      });
    }
  }, [dispatch, openSnackbar, isSuccess]);

  useEffect(() => {
    if (isError) {
      const msg = isErrorWithMessage(error)
        ? error.data.message
        : 'Something went wrong. Please try again';
      openSnackbar({
        open: true,
        status: 'error',
        message: msg,
      });
    }
  }, [isError, openSnackbar, error]);

  useEffect(() => {
    const onKeyPressed = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.keyCode === 13) && isCodeTypedFully(code)) {
        onClickConfirm();
      }
    };
    window.addEventListener('keypress', onKeyPressed);

    return () => {
      window.removeEventListener('keypress', onKeyPressed);
    };
  }, [code, onClickConfirm]);
  return (
    <>
      <ReactCodeInput
        fields={4}
        name='code'
        value={code}
        type='number'
        inputMode='numeric'
        onChange={onChangeCode}
        className='react-code-input'
      />
      <Button
        variant='contained'
        onClick={onClickConfirm}
        className='login-confirm'
        disabled={code.length !== 4}
        style={{ marginBottom: '20px' }}
      >
        Confirm
      </Button>
      {isError && (
        <div className='resend'>
          <p>Wrong code. Please try again</p>
        </div>
      )}
      {isUninitialized && <ResendCode />}
    </>
  );
};
export default memo(Confirmation);
