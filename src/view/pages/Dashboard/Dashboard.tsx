import React from "react";
import CommunityHeader from "../../components/Community/CommunityHeader/CommunityHeader";
import Login from "../../components/Login/Login";
import { useGetMyProfileQuery } from "../../../redux/auth";
import isEmpty from "lodash.isempty";
import CommunityList from "../../components/Community/CommunityList/CommunityList";
import { clearEditableCommunity } from "../../../redux/community/reducer";
import { useAppDispatch } from "../../../hooks/useRedux";

const Dashboard = () => {
  const { data: user } = useGetMyProfileQuery();
  const dispatch = useAppDispatch();
  dispatch(clearEditableCommunity());

  if (isEmpty(user)) {
    return <Login dashboard />
  }

  return (
    <div>
      <CommunityHeader main />
      <CommunityList />
    </div>
  );
};

export default Dashboard;
