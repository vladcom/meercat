import React, { useCallback, useMemo } from "react";
import { useGetMyProfileQuery } from "../../../../redux/auth";
import isEmpty from "lodash.isempty";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import {
  changeCommunityStep,
  clearEditableCommunity, ECommunityContainer
} from "../../../../redux/community/reducer";
import { useAppDispatch } from "../../../../hooks/useRedux";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const CommunityHeader = ({ main }: { main?: boolean; }) => {
  const { data: profile } = useGetMyProfileQuery();
  const dispatch = useAppDispatch();

  const history = useHistory();
  const onClickBack = useCallback(() => {
    history.push("/dashboard");
    dispatch(clearEditableCommunity());
    dispatch(changeCommunityStep(ECommunityContainer.INFO));
  }, [dispatch, history]);

  const goToMainApp = useCallback(() => history.push('/'), [history]);

  const renderButton = useMemo(() => {
    if (main) {
      return <Button onClick={goToMainApp}><ArrowBackIosNewIcon />Go to main App</Button>;
    }

    return <Button onClick={onClickBack}><ArrowBackIosNewIcon /></Button>
  }, [main, goToMainApp, onClickBack]);

  return isEmpty(profile) ? null : (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 20 }}>
      <span>{profile?.name}</span>
      {renderButton}
    </div>
  );
};

export default CommunityHeader;
