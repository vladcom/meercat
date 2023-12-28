import React, { MouseEventHandler } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Typography
} from "@mui/material";
import { modalWindowStyle } from "../../../constants/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useFormik } from "formik";
import { useGetMyProfileQuery } from "../../../redux/auth";
import * as Yup from "yup";
import { FormComponent, IUserFormValues } from "../UserProfile/UserProfileInfo/UserProfileInfo";

const UpdateProfileSchema = Yup.object({
  name: Yup.string().nullable(true).max(15, 'Must be 15 characters or less').required(),
  email: Yup.string().nullable(true).email('Invalid email address').required(),
});

const UpdateUserProfileModal: React.FC<{
  handleClose: MouseEventHandler;
  onUpdateProfile: any;
  isLoadingUpdating: boolean;
}> = ({ handleClose, onUpdateProfile, isLoadingUpdating }) => {
  const { data: user } = useGetMyProfileQuery();

  const onSubmit = (values: IUserFormValues) => {
    onUpdateProfile(values);
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
    validateOnMount: false,
    validationSchema: UpdateProfileSchema,
    onSubmit,
  });

  return (
    <Box sx={modalWindowStyle} className='modalLogout'>
      <button className='modalLogout-close' onClick={handleClose}>
        <FontAwesomeIcon icon={solid('close')} />
      </button>
      <div style={{ width: '100%' }}>
        <form className='userProfile-info' onSubmit={formik.handleSubmit}>
          <Typography variant='body2' >Please complete your profile for creating communities</Typography>
          <FormControl variant='outlined' style={{ width: '300px', marginTop: '10px' }}>
            <FormComponent
              id='name'
              type='text'
              label='Name'
              size='small'
              margin='dense'
              placeholder='Name'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={!!formik.errors.name}
              helperText={formik.errors.name}
            />
          </FormControl>
          <FormControl variant='outlined' style={{ width: '300px' }}>
            <FormComponent
              id='email'
              type='text'
              size='small'
              label='Email'
              margin='dense'
              placeholder='Email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={!!formik.errors.email}
              helperText={formik.errors.email}
            />
          </FormControl>
          <FormControl variant='outlined' style={{ width: '300px', marginBottom: '30px' }}>
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
          <Button type='submit' variant='contained'>
            {isLoadingUpdating ? (
              <CircularProgress style={{ width: '25px', height: '25px' }} />
            ) : (
              'Update'
            )}
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default UpdateUserProfileModal;
