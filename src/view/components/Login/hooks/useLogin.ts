import { useCallback } from 'react';
import { useAppDispatch } from 'src/hooks/useRedux';
import { setSignInMode, signInProcess, useLoginConfirmationMutation } from 'src/redux/auth';
import { isPhoneDevMode } from '../utils';
import { useNotificationContext } from "../../NotificationsContext/NotificationsProvider";

/**
 * This hook is used for getting ``load`` function to proceed with login query
 * @return {void}
 */
function useLogin() {
  const dispatch = useAppDispatch();

  const { openSnackbar } = useNotificationContext();

  const [loginConfirmation, data] = useLoginConfirmationMutation();

  const login = useCallback(
    (phone: string) => {
      if (isPhoneDevMode(phone)) {
        dispatch(signInProcess('push'));
        dispatch(setSignInMode(true));
        openSnackbar({
          open: true,
          status: 'success',
          message: 'Enter any code',
        });
      } else {
        dispatch(setSignInMode(false));
        loginConfirmation({ phone });
      }
    },
    [loginConfirmation, dispatch, openSnackbar]
  );

  return { ...data, login };
}

export default useLogin;
