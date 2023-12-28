import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEditableComm } from "../../view/pages/AddCommunity/AddCommunityForm";
import { ICommunity } from "../../types/ICommunity";
import { IGetStatisticsResponse } from "./api";
import { ICreateUser, IEditableUser } from "../../view/components/CreateUser/CreateUser";

export interface EditCommunity {
  isEdit: boolean;
  isOpenMenu: boolean;
  report: IGetStatisticsResponse | null;
  editableCommunity: IEditableComm;
  isAddedSuccessfully: boolean;
  isCommunityStep: ECommunityContainer | {};
  isCommunityTabs: ECommunityTabs;
  selectedCommunity: ICommunity;
  isGettingStatistics: boolean;
  communityUsers: [];
  isUserEdit: boolean;
  editableUser: IEditableUser;
}

export enum ECommunityContainer {
  INFO = 'info',
  PARAMS = 'params',
}

export enum ECommunityTabs {
  DASHBOARD = 'dashboard',
  USERS = 'users',
  REPORTS = 'reports',
  SETTINGS = 'settings',
  PAYMENT = 'payment',
}

export enum EUserRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  SUBSCRIBER = 'subscriber',
  REQUESTED = 'requested',
  INVITED = 'invited',
}

const initialState: EditCommunity = {
  editableCommunity: {
    address: '',
    label: '',
    latitude: 0,
    longitude: 0,
    radius: 0.5,
    private: true,
  },
  editableUser: {
    _id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    latitude: 0,
    longitude: 0,
  },
  isUserEdit: false,
  report: null,
  isEdit: false,
  isOpenMenu: false,
  communityUsers: [],
  isAddedSuccessfully: true,
  isCommunityStep: ECommunityContainer.INFO,
  isCommunityTabs: ECommunityTabs.DASHBOARD,
  selectedCommunity: {
    _id: '',
    name: '',
    address: '',
    creatorId: '',
    private: true,
    geometry: {
      type: '',
      coordinates: [0, 0]
    },
    radius: 0,
    createdAt: 0,
    participants: [],
    incidents: [],
    invitedUsers: [],
    posts: [],
    requestedUsers: [],
    updatedAt: '',
  },
  isGettingStatistics: false,
};

export const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearEditableCommunity: () => {
      return initialState;
    },
    clearEditableUser: (state) => {
      state.editableUser = initialState.editableUser;
    },
    setCommunityAddedSuccessfully: (state, action) => {
      if (typeof action.payload.isAddedSuccessfully !== 'undefined') {
        state.isAddedSuccessfully = action.payload.isAddedSuccessfully;
      }
    },
    changeCommunityStep: (state, action) => {
      if (typeof action.payload.isCommunityStep !== 'undefined') {
        state.isCommunityStep = action.payload.isCommunityStep;
      }
    },
    changeCommunityTab: (state, action) => {
      if (typeof action.payload.isCommunityTabs !== 'undefined') {
        state.isCommunityTabs = action.payload.isCommunityTabs;
        state.isOpenMenu = false;
      }
    },
    setIsGettingStatistics: (state, action) => {
      if (typeof action.payload.report !== 'undefined') {
        state.report = action.payload.report;
      }
    },
    setSelectedCommunity: (state, action) => {
      if (typeof action.payload.selectedCommunity !== 'undefined') {
        state.selectedCommunity = action.payload.selectedCommunity;
      }
    },
    setReportData: (state, action) => {
      if (typeof action.payload.report !== 'undefined') {
        state.report = action.payload.report;
      }
    },
    setCommunityUsers: (state, action) => {
      if (typeof action.payload.communityUsers !== 'undefined') {
        state.communityUsers = action.payload.communityUsers;
      }
    },
    changeMenuStatus: (state, action) => {
      if (typeof action.payload.isOpenMenu !== 'undefined') {
        state.isOpenMenu = action.payload.isOpenMenu;
      }
    },
    setIsUserEdit: (state, action) => {
      if (typeof action.payload.isUserEdit !== 'undefined') {
        state.isUserEdit = action.payload.isUserEdit;
      }
    },
    changeEditableUser: (state, action: PayloadAction<Partial<ICreateUser>>) => {
      if (typeof action.payload.address !== 'undefined') {
        state.editableUser.address = action.payload.address;
      }
      if (typeof action.payload._id !== 'undefined') {
        state.editableUser._id = action.payload._id;
      }
      if (typeof action.payload.name !== 'undefined') {
        state.editableUser.name = action.payload.name;
      }
      if (typeof action.payload.latitude !== 'undefined') {
        state.editableUser.latitude = action.payload.latitude;
      }
      if (typeof action.payload.longitude !== 'undefined') {
        state.editableUser.longitude = action.payload.longitude;
      }
      if (typeof action.payload.email !== 'undefined') {
        state.editableUser.email = action.payload.email;
      }
      if (typeof action.payload.phone !== 'undefined') {
        state.editableUser.phone = action.payload.phone;
      }
      if (typeof action.payload.role !== 'undefined') {
        state.editableUser.role = action.payload.role;
      }
    },
    changeEditableCommunity: (state, action: PayloadAction<Partial<IEditableComm>>) => {
      if (typeof action.payload.address !== 'undefined') {
        state.editableCommunity.address = action.payload.address;
      }
      if (typeof action.payload._id !== 'undefined') {
        state.editableCommunity._id = action.payload._id;
      }
      if (typeof action.payload.label !== 'undefined') {
        state.editableCommunity.label = action.payload.label;
      }
      if (typeof action.payload.latitude !== 'undefined') {
        state.editableCommunity.latitude = action.payload.latitude;
      }
      if (typeof action.payload.longitude !== 'undefined') {
        state.editableCommunity.longitude = action.payload.longitude;
      }
      if (typeof action.payload.radius !== 'undefined') {
        state.editableCommunity.radius = action.payload.radius;
      }
      if (typeof action.payload.private !== 'undefined') {
        state.editableCommunity.private = action.payload.private;
      }
    },
  }
});

export const {
  clearEditableUser,
  changeMenuStatus,
  clearEditableCommunity,
  setCommunityAddedSuccessfully,
  changeCommunityTab,
  changeCommunityStep,
  changeEditableCommunity,
  setSelectedCommunity,
  setIsGettingStatistics,
  setReportData,
  setCommunityUsers,
  changeEditableUser,
  setIsUserEdit,
} = communitySlice.actions;

export default communitySlice.reducer;
