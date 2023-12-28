import React, { MouseEventHandler, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Box, Button, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { modalWindowStyle } from "../../../constants/styles";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import UserProfileAutocomplete from "../UserProfile/UserProfilePlaces/components/UserProfileAutocomplete";
import {
  changeEditableUser
} from "../../../redux/community/reducer";
import { getUserEditStatus, InitEditableUserSelector } from "../../../redux/community";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";

export interface ICreateUser {
  _id?: string;
  role: string;
  name: string;
  email?: string;
  phone?: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface IEditableUser extends Omit<ICreateUser, 'address'> {
  address: string;
}

const CreateUser: React.FC<{
  handleClose: MouseEventHandler;
  onCreateUser: any;
}> = ({ handleClose, onCreateUser }) => {
  const dispatch = useAppDispatch();
  const editableUser = useAppSelector(InitEditableUserSelector);
  const isUserEdit = useAppSelector(getUserEditStatus);
  const CreateUserFormSchema = useMemo(() =>
    Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email().required('Required'),
      phone: Yup.string().required('Required'),
      address: Yup.string().when(`${isUserEdit}`, {
        is: 'false',
        then: Yup.string().required('Required'),
      }),
      role: Yup.string().required('Required'),
      latitude: Yup.number().when(`${isUserEdit}`, {
        is: 'false',
        then: Yup.number().required('Required'),
      }),
      longitude: Yup.number().when(`${isUserEdit}`, {
        is: 'false',
        then: Yup.number().required('Required'),
      }),
    }), [isUserEdit]);

  const onHandleSave = useCallback(
    (values: ICreateUser) => {
      const { email, phone, address, name, role, latitude, longitude } = values;
      dispatch(changeEditableUser({ email, phone, address, name, role: role.toLowerCase(), latitude, longitude }));
      onCreateUser(values);
    },
    [dispatch, onCreateUser]
  );

  return (
    <Box sx={modalWindowStyle} className='modalLogout'>
      <button className='modalLogout-close' onClick={handleClose}>
        <FontAwesomeIcon icon={solid('close')} />
      </button>
      <div style={{ width: '100%' }}>
        <Formik<ICreateUser>
          initialValues={{
            name: editableUser?.name ?? '',
            role:  editableUser?.role ?? '',
            email:  editableUser?.email ?? '',
            phone:  editableUser?.phone ?? '',
            address:  editableUser?.address ?? '',
            latitude:  editableUser?.latitude ?? 0,
            longitude:  editableUser?.longitude ?? 0,
          }}
          enableReinitialize
          validateOnMount={false}
          onSubmit={onHandleSave}
          validationSchema={CreateUserFormSchema}
        >
          {({ isValid, handleChange, handleBlur, values, errors }) => {
            return (
              <Form>
                <div style={{ display: 'flex', width: '100%', flexDirection: 'column', marginBottom: '10px' }}>
                  <span>Name</span>
                  <TextField
                    required
                    fullWidth
                    size='small'
                    id='name'
                    name='name'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    error={!!errors.name}
                    helperText={errors.name ?? ''}
                    margin='dense'
                  />
                </div>
                <div style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', width: '47%', flexDirection: 'column' }}>
                    <span>Email</span>
                    <TextField
                      disabled={isUserEdit}
                      required
                      fullWidth
                      size='small'
                      id='email'
                      name='email'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={!!errors.email}
                      helperText={errors.email ?? ''}
                      margin='dense'
                    />
                  </div>
                  <div style={{ display: 'flex', width: '47%', flexDirection: 'column' }}>
                    <span>Phone</span>
                    <TextField
                      required
                      disabled={isUserEdit}
                      fullWidth
                      size='small'
                      id='phone'
                      name='phone'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      error={!!errors.phone}
                      helperText={errors.phone ?? ''}
                      margin='dense'
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <span>Address</span>
                  <UserProfileAutocomplete />
                </div>
                <div>
                  <FormControl fullWidth>
                    <span>Role</span>
                    <Select
                      required
                      id="role"
                      name="role"
                      size="small"
                      margin='dense'
                      value={values.role}
                      error={!!errors.role}
                      onChange={handleChange}
                    >
                      <MenuItem value="owner">Owner</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="subscriber">Subscriber</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className='userProfile-places-modal-actions'>
                  <Button variant='outlined' onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={!isValid}
                    variant='contained'
                  >
                    {isUserEdit ? 'Edit' : 'Create'}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Box>
  );
};

export default CreateUser;
