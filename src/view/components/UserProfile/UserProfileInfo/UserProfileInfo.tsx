import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl, FormControlLabel, FormGroup, FormHelperText,
  TextField,
  TextFieldProps
} from "@mui/material";
import { useFormik } from 'formik';
import React, { useEffect, useRef } from "react";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from 'src/redux/auth';
import * as Yup from 'yup';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'yup-phone';
import { requestForToken } from "../../../../firebase/firebaseNotifications";
import { useNotificationContext } from "../../NotificationsContext/NotificationsProvider";

const UpdateProfileSchema = Yup.object({
  name: Yup.string().nullable(true).max(15, 'Must be 15 characters or less').notRequired(),
  email: Yup.string().nullable(true).email('Invalid email address').notRequired(),
  // phone: Yup.string().phone().required('Required'),
  bySMS: Yup.boolean(),
  byEMAIL: Yup.boolean(),
  byPush: Yup.boolean(),
});

export const FormComponent: React.FC<TextFieldProps> = ({ ...props }) => {
  const ref = useRef<HTMLInputElement>(null);

  // const [isReadyTeEdit, setReadyToEdit] = useState(() =>
  //   typeof isInitiallyDisabled === 'undefined' ? true : !isInitiallyDisabled
  // );
  //
  // const [update, { isLoading }] = useUpdateMyProfileMutation();
  // useEffect(() => {
  //   if (!isReadyTeEdit) {
  //     ref?.current?.focus();
  //   }
  // }, [isReadyTeEdit]);
  //
  // useEffect(() => {
  //   if (isSuccess) {
  //     setReadyToEdit(true);
  //   }
  // }, [isSuccess]);

  // const isValid = !props.error && !props.disabled && !!props.value;

  // const endAdornment = useMemo(() => {
  //   if (isLoading) {
  //     return (
  //       <LinearProgress />
  //     );
  //   }
  // return (
  //   <>
  //     {isReadyTeEdit && (
  //       <EditIcon
  //         color={'action'}
  //         onClick={() => {
  //           setReadyToEdit(false);
  //         }}
  //       />
  //     )}
  //     {isValid && !isReadyTeEdit && (
  //       <CheckIcon
  //         color={isValid ? 'success' : 'action'}
  //         onClick={() => {
  //           update({ id: profileId, [props.id]: props.value });
  //         }}
  //         style={{ cursor: 'pointer' }}
  //       />
  //     )}
  //   </>
  // );
  // }, [isLoading]);

  return (
    <TextField
      {...props}
      inputRef={ref}
      disabled={props.disabled}
      // InputProps={{
      //   endAdornment,
      // }}
    />
  );
};

export interface IUserFormValues {
  name?: string;
  email?: string;
  phone: string;
  bySMS?: boolean;
  byEMAIL?: boolean;
  byPUSH?: boolean;
}

const UserProfileInfo = () => {
  const { data: user } = useGetMyProfileQuery();
  const [update, { isLoading, isError, isSuccess, error }] = useUpdateMyProfileMutation();
  const { openSnackbar } = useNotificationContext();

  useEffect(() => {
    if (isError) {
      const message = (error as Record<string, Record<string, string>>)?.data?.message ?? '';
      openSnackbar({ open: true, status: 'error', message: `${message}. Please try again`, });
    }
  }, [isError, error, openSnackbar]);

  useEffect(() => {
    if (isSuccess) {
      openSnackbar({ open: true, status: 'success', message: 'User updated successfully', });
    }
  }, [openSnackbar, isSuccess]);

  const onSubmit = (values: IUserFormValues) => {
    if (user) {
      const { name: userName, email: userEmail } = user;
      const { name, email, bySMS, byEMAIL, byPUSH } = values;
      const isName = name && name.length && userName !== name ? { name } : {};
      const isEmail = email && email.length && userEmail !== email ? { email } : {};
      const notificationsBy = [];
      if (byEMAIL) {
        notificationsBy.push('by-email');
      }
      if (bySMS) {
        notificationsBy.push('by-sms');
      }
      if (byPUSH) {
        notificationsBy.push('by-push');
        Notification.requestPermission().then(async (permission) => {
          if (permission === "granted") {
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
          }
        })
      }
      update({
        id: user?._id,
        ...isName,
        ...isEmail,
        notificationsBy: [...notificationsBy]
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      bySMS: user?.notificationsBy?.includes('by-sms') ?? false,
      byEMAIL: user?.notificationsBy?.includes('by-email') ?? false,
      byPUSH: user?.notificationsBy?.includes('by-push') ?? false,
    },
    validateOnMount: false,
    validationSchema: UpdateProfileSchema,
    onSubmit,
  });

  if (user)
    return (
      <>
        <p className='userProfile-preview-user-info'>
          Your profile information is private and is never shown on any of your posts on comments
        </p>
        <form className='userProfile-info' onSubmit={formik.handleSubmit}>
          <FormControl variant='outlined' style={{ width: '85%', marginTop: '10px' }}>
            <FormComponent
              id='name'
              type='text'
              label='Name'
              size='small'
              margin='dense'
              placeholder='Name'
              disabled={isLoading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={!!formik.errors.name}
              helperText={formik.errors.name}
            />
          </FormControl>
          <FormControl variant='outlined' style={{ width: '85%' }}>
            <FormComponent
              id='email'
              type='text'
              size='small'
              label='Email'
              margin='dense'
              placeholder='Email'
              disabled={isLoading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={!!formik.errors.email}
              helperText={formik.errors.email}
            />
          </FormControl>
          <FormControl variant='outlined' style={{ width: '85%' }}>
            <FormComponent
              disabled
              id='phone'
              size='small'
              type='text'
              label='Phone'
              margin='dense'
              placeholder='Phone'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              error={!!formik.errors.phone}
              helperText={formik.errors.phone}
            />
          </FormControl>
          <div className="userProfile-info-notifications">
            <p className="userProfile-info-notifications-title">Notifications</p>
            <p className='userProfile-info-notifications-subTitle userProfile-preview-user-info'>
              Select preferable way to receive notifications
            </p>
            <FormControl component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="bySMS"
                      size='small'
                      name="bySMS"
                      checked={formik.values.bySMS}
                      onChange={formik.handleChange}
                      disabled={!formik.values.byEMAIL && !formik.values.byPUSH}
                    />
                  }
                  label="By SMS"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id="byEMAIL"
                      size='small'
                      name="byEMAIL"
                      onChange={formik.handleChange}
                      checked={formik.values.byEMAIL}
                      disabled={(!formik.values.bySMS && !formik.values.byPUSH) || !formik.values.email.length}
                    />
                  }
                  label={`By email${!formik.values.email?.length ? ' (you should add you email before selection this option)' : ''}`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id="byPUSH"
                      size='small'
                      name="byPUSH"
                      checked={formik.values.byPUSH}
                      onChange={formik.handleChange}
                      disabled={!formik.values.bySMS && !formik.values.byEMAIL}
                    />
                  }
                  label="By push notifications"
                />
              </FormGroup>
              <FormHelperText>At least one option must be selected</FormHelperText>
            </FormControl>
          </div>
          <div className='userProfile-info-submit'>
            <Button
              disabled={isLoading}
              type='submit'
              variant='contained'
              className='userProfile-info-submit'
            >
              {isLoading ? (
                <CircularProgress style={{ width: '25px', height: '25px' }} />
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </form>
      </>
    );
  return <div></div>;
};

export default UserProfileInfo;
