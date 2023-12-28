import React, { useCallback, useEffect, useMemo } from "react";
import CommunityHeader from "../../components/Community/CommunityHeader/CommunityHeader";
import './style.scss';
import AddCommunityForm from "./AddCommunityForm";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  currentCommunityEditStep,
  InitEditableCommunitySelector,
  useAddCommunityMutation
} from "../../../redux/community";
import {
  changeCommunityStep,
  clearEditableCommunity,
  ECommunityContainer
} from "../../../redux/community/reducer";
import CommunitySettings from "./CommunitySettings";
import { useHistory } from "react-router-dom";
import { useNotificationContext } from "../../components/NotificationsContext/NotificationsProvider";
import { useGetMyProfileQuery } from "../../../redux/auth";
import { isNull } from "../../../utils/isNull";

const AddCommunity = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { openSnackbar } = useNotificationContext();
  const { data: user } = useGetMyProfileQuery();
  const editStep = useAppSelector(currentCommunityEditStep);
  const editableCommunity = useAppSelector(InitEditableCommunitySelector);
  const [addCommunity, { isLoading, isSuccess, isError, error }] = useAddCommunityMutation();

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
    if (user) {
      const { name, email } = user;
      if (isNull(name) || isNull(email)) {
        openSnackbar({
          open: true,
          status: 'warning',
          message: 'Please complete your profile with name or/and email information',
        });
        history.push("/dashboard");
      }
    }
  }, [user, openSnackbar, history]);

  useEffect(() => {
    if (isSuccess) {
      history.push('/dashboard');
      dispatch(clearEditableCommunity());
      dispatch(changeCommunityStep({ isCommunityStep: ECommunityContainer.INFO }));
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Community created successfully',
      });
    }
  }, [isSuccess, history, dispatch, openSnackbar]);

  const onSaveCommunityData = useCallback(() => {
    const { radius, label, latitude, longitude, address } = editableCommunity;
    addCommunity({
      radius,
      address,
      name: label,
      geometry: {
        type: 'Point',
        coordinates: [
          longitude,
          latitude
        ]
      }
    });
  }, [addCommunity, editableCommunity]);

  const renderForm = useMemo(() => {
    if (editStep === ECommunityContainer.INFO) {
      return <AddCommunityForm />;
    }
    if (editStep === ECommunityContainer.PARAMS) {
      return <CommunitySettings onSaveCommunityData={onSaveCommunityData} isLoading={isLoading} />;
    }
  }, [editStep, onSaveCommunityData, isLoading]);

  return (
    <div>
      <CommunityHeader />
      <div className="add-comm">
        <div className="add-comm-container">
          <p className="add-comm-container-title">Add community</p>
          {renderForm}
        </div>
      </div>
    </div>
  );
};

export default AddCommunity;
