import WestIcon from '@mui/icons-material/West';
import { Button } from '@mui/material';
import { useCallback } from 'react';
import 'react-phone-number-input/style.css';
import Logo from '../../../static/img/yellow.svg';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import {
  ESignInFlow,
  selectCurrentSignInProcess,
  selectPhoneSignInMode,
  signInProcess,
} from 'src/redux/auth';
import { setMainModalState } from 'src/redux/modals';
import Confirmation from './components/Confirmation';
import SignIn from './components/SignIn';
import './style.scss';

const Login = ({ dashboard }: { dashboard?: boolean }) => {
  const dispatch = useAppDispatch();

  const currentSignIn = useAppSelector(selectCurrentSignInProcess);
  const phone = useAppSelector(selectPhoneSignInMode);

  const onClickBack = useCallback(() => {
    if (currentSignIn === ESignInFlow.ENTER_CODE) {
      dispatch(signInProcess('back'));
    } else {
      dispatch(setMainModalState({ isProfileWindowOpen: false }));
    }
  }, [currentSignIn, dispatch]);

  return (
    <>
      {dashboard ? null : (
        <Button onClick={onClickBack} className='navigation-hidden'>
          <WestIcon />
        </Button>
      )}
      <div className='login'>
        <div className='login-container'>
          <div className='login-header'>
            <img className='login-logo' src={Logo} alt="logo" />
            <p className='login-title'>
              {currentSignIn === ESignInFlow.ENTER_CODE
                ? `Enter code. SMS sent to ${phone}`
                : 'Login'}
            </p>
            <p className='login-subTitle'>
              {currentSignIn === ESignInFlow.SIGN_IN
                ? `Enter your phone number and we'll send you a short code`
                : null}
            </p>
          </div>
          {currentSignIn === ESignInFlow.SIGN_IN && <SignIn />}
          {currentSignIn === ESignInFlow.ENTER_CODE && <Confirmation />}
        </div>
      </div>
    </>
  );
};

export default Login;
