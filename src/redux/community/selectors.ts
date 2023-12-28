import { RootState } from "../index";
import { EditCommunity } from "./reducer";
import { createSelector } from "@reduxjs/toolkit";

export const editCommunity = (state: RootState): EditCommunity => state.community;

export const InitEditableCommunitySelector = createSelector(editCommunity,
  (state) => state.editableCommunity
);

export const InitEditableUserSelector = createSelector(editCommunity,
  (state) => state.editableUser
);

export const currentCommunityEditStep = createSelector(editCommunity, (state) => state.isCommunityStep)
export const currentMenuStatus = createSelector(editCommunity, (state) => state.isOpenMenu)

export const currentCommunityTab = createSelector(editCommunity, (state) => state.isCommunityTabs);

export const getSelectedCommunity = createSelector(editCommunity, (state) => state.selectedCommunity)

export const getIsLoadingStatus = createSelector(editCommunity, (state) => state.isGettingStatistics);

export const getReportData = createSelector(editCommunity, (state) => state.report);

export const getCommunityUsers = createSelector(editCommunity, (state) => state.communityUsers);
export const getUserEditStatus = createSelector(editCommunity, (state) => state.isUserEdit);
