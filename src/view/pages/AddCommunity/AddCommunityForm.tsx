import React, { useCallback, useMemo } from "react";
import { Form, Formik } from "formik";
import { Button, FormControlLabel, FormGroup, Switch as MatSwitch, TextField } from "@mui/material";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  changeCommunityStep,
  changeEditableCommunity,
  ECommunityContainer
} from "../../../redux/community/reducer";
import CommunityAutocomplete from "./CommunityAutocomplete";
import { InitEditableCommunitySelector } from "../../../redux/community";

export interface IAddCommunityFormikValues {
  _id?: string;
  label: string;
  address: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  private?: boolean;
}

export interface IEditableComm extends Omit<IAddCommunityFormikValues, 'address'> {
  address: string;
}

const AddCommunityForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const editableCommunity = useAppSelector(InitEditableCommunitySelector);

  const CommunityFormSchema = useMemo(
    () =>
      Yup.object({
        label: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
        latitude: Yup.number().required('Required'),
        longitude: Yup.number().required('Required'),
        private: Yup.boolean().required('Required'),
      }),
    []);

  const onHandleSave = useCallback(
    (values: IAddCommunityFormikValues) => {
      dispatch(changeEditableCommunity(values));
      dispatch(changeCommunityStep({ isCommunityStep: ECommunityContainer.PARAMS }));
    },
    [dispatch]
  );

  return (
    <Formik<IAddCommunityFormikValues>
      initialValues={{
        label: editableCommunity?.label ?? '',
        address: editableCommunity?.address ?? '',
        latitude: editableCommunity?.latitude ?? 0,
        longitude: editableCommunity?.longitude ?? 0,
        private: editableCommunity?.private ?? true,
      }}
      enableReinitialize
      validationSchema={CommunityFormSchema}
      validateOnMount={false}
      onSubmit={onHandleSave}
    >
      {({ isValid, values, handleBlur, handleChange, errors,  }) => {
        return (
          <Form>
            <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
              <span>Name of Community</span>
              <TextField
                fullWidth
                size='small'
                id='label'
                name='label'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.label}
                error={!!errors.label}
                helperText={errors.label ?? ' '}
                margin='dense'
              />
              <div>
                <span>Address</span>
                <CommunityAutocomplete />
              </div>
              <div>
                <FormGroup>
                  <FormControlLabel
                    disabled
                    labelPlacement="start"
                    control={
                      <MatSwitch checked={values.private} onChange={handleChange} id="private" name="private" />
                    }
                    label="Private"
                  />
                </FormGroup>
              </div>
              <div className='userProfile-places-modal-actions'>
                <Button type='submit' disabled={!isValid} variant='contained'>
                  Continue
                </Button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  );
};

export default AddCommunityForm;
