import { Button, CircularProgress } from '@mui/material';
import { E164Number } from 'libphonenumber-js/types';
import { memo, useCallback, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { useAppDispatch } from 'src/hooks/useRedux';
import { setSignInPhone } from 'src/redux/auth';
import { isUndefined } from 'src/utils/isUndefined';
import inputLogin from '../InputLogin';
import useLogin from '../hooks/useLogin';
import { isPhoneValid } from '../utils';
import { useNotificationContext } from "../../NotificationsContext/NotificationsProvider";

const DEFAULT_COUNTRY = 'US';

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();

  const { openSnackbar } = useNotificationContext();

  const [phone, setPhone] = useState('');
  const [validNumber, setValidNumber] = useState(false);

  const { isError, login, isSuccess, error, isLoading } = useLogin();
  const onChangePhone = useCallback((value: E164Number) => {
    if (isUndefined(value)) {
      setPhone('');
    }
    if (!isUndefined(value)) {
      setPhone(value);
      setValidNumber(isPhoneValid(value));
    }
  }, []);

  const onLogin = useCallback(() => {
    dispatch(setSignInPhone(phone));
    login(phone);
  }, [phone, login, dispatch]);

  useEffect(() => {
    if (isError) {
      const message = (error as Record<string, Record<string, string>>)?.data?.message ?? '';
      openSnackbar({
        open: true,
        status: 'error',
        message: `${message}. Please try again`,
      });
    }
  }, [isError, error, openSnackbar]);

  useEffect(() => {
    if (isSuccess) {
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Code successfully sent',
      });
    }
  }, [isSuccess, openSnackbar]);

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.keyCode === 13) {
        onLogin();
      }
    };
    window.addEventListener('keypress', onKeyPress);
    return () => {
      window.removeEventListener('keypress', onKeyPress);
    };
  }, [onLogin]);

  return (
    <>
      <PhoneInput
        value={phone}
        onChange={onChangePhone}
        inputComponent={inputLogin}
        defaultCountry={DEFAULT_COUNTRY}
        placeholder='Enter phone number'
      />
      {isLoading ? (
        <div style={{ marginTop: 20 }}>
          <CircularProgress />
        </div>
      ) : (
        <Button variant="contained" onClick={onLogin} disabled={!validNumber} className='login-confirm'>
          Send verification code
        </Button>
      )}
      <p style={{ padding: 0, margin: '20px 0 0', fontSize: '12px', lineHeight: 'inherit' }}>
        By continuing you agree to our <a style={{ color: '#1976d2' }} href={'/terms'} target="_blank">terms</a> and <a style={{ color: '#1976d2' }} href={'/privacy'} target="_blank">privacy policy</a>
      </p>
    </>
  );
};

export default memo(SignIn);
