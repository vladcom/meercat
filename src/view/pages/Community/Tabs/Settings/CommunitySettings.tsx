import React, { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/useRedux";
import {
  currentCommunityEditStep,
  InitEditableCommunitySelector,
  useEditCommunityMutation, useLeaveFromCommunityMutation
} from "../../../../../redux/community";
import {
  changeCommunityStep,
  ECommunityContainer, setSelectedCommunity
} from "../../../../../redux/community/reducer";
import AddCommunityForm from "../../../AddCommunity/AddCommunityForm";
import CommunitySettings from "../../../AddCommunity/CommunitySettings";
import { useHistory, useParams } from "react-router-dom";
import { LocationsList } from "../../../IncidentPage/LocationPage";
import { useNotificationContext } from "../../../../components/NotificationsContext/NotificationsProvider";
import { Button, CircularProgress } from "@mui/material";

const CommunitySingleSettings = () => {
  const { communityId: communityId = '' } = useParams<LocationsList>();
  const history = useHistory();
  const editStep = useAppSelector(currentCommunityEditStep);
  const dispatch = useAppDispatch();
  const editableCommunity = useAppSelector(InitEditableCommunitySelector);
  const { openSnackbar } = useNotificationContext();
  const [editCommunity, { data, isLoading, isSuccess, isError, error }] = useEditCommunityMutation();
  const [leave, { isLoading: isLoadingLeave }] = useLeaveFromCommunityMutation();

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
      dispatch(setSelectedCommunity({ selectedCommunity: data }));
      dispatch(changeCommunityStep({ isCommunityStep: ECommunityContainer.INFO }));
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Community updated successfully',
      });
    }
  }, [isSuccess, data, dispatch, openSnackbar]);

  const onSaveCommunityData = useCallback(() => {
    const { radius, label, latitude, longitude, address } = editableCommunity;
    editCommunity({
      data: {
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
      },
      id: communityId
    });
  }, [editableCommunity, communityId, editCommunity]);

  const renderForm = useMemo(() => {
    if (editStep === ECommunityContainer.INFO) {
      return <AddCommunityForm />;
    }
    if (editStep === ECommunityContainer.PARAMS) {
      return <CommunitySettings onSaveCommunityData={onSaveCommunityData} isLoading={isLoading} />;
    }
  }, [editStep, onSaveCommunityData, isLoading]);

  const onClickLeave = useCallback(() => {
    leave({ communityId })
      // @ts-ignore
      .then(({ data }: { data: boolean }) => {
        if (data) {
          history.push('/dashboard');
          document.location.reload();
        }
      });
  }, [leave, history, communityId]);

  return (
    <div style={{ maxWidth: 650, margin: '50px 0 ', display: 'flex', flexDirection: 'column' }}>
      {renderForm}
      <div style={{ marginTop: '50px' }}>
        <Button onClick={() => onClickLeave()}>
          {isLoadingLeave ? <CircularProgress /> : 'Leave from community'}
        </Button>
      </div>
    </div>
  );
};

export default CommunitySingleSettings;
