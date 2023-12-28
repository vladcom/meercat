import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { LocationsList } from "../IncidentPage/LocationPage";
import {
  currentCommunityTab,
  currentMenuStatus, getSelectedCommunity,
  InitEditableCommunitySelector,
  useGetCommunityQuery
} from "../../../redux/community";
import CommunityHeader from "../../components/Community/CommunityHeader/CommunityHeader";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText, Typography, useMediaQuery
} from "@mui/material";
import './style.scss';
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import {
  changeCommunityTab, changeEditableCommunity,
  changeMenuStatus, ECommunityTabs, setSelectedCommunity
} from "../../../redux/community/reducer";
import MenuIcon from "@mui/icons-material/Menu";
import CommunityUsers from "./Tabs/Users/CommunityUsers";
import CommunityStatistics from "./Tabs/Statistic/CommunityStatistics";
import CommunitySingleSettings from "./Tabs/Settings/CommunitySettings";
import CommunityReports from "./Tabs/Reports/CommunityReports";

const CommunityMenuList = () => {
  const dispatch = useAppDispatch();
  const tab = useAppSelector(currentCommunityTab);
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          selected={tab === ECommunityTabs.DASHBOARD}
          onClick={() => dispatch(changeCommunityTab({ isCommunityTabs: ECommunityTabs.DASHBOARD }))}
        >
          <ListItemText primary='Dashboard' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={tab === ECommunityTabs.USERS}
          onClick={() => dispatch(changeCommunityTab({ isCommunityTabs: ECommunityTabs.USERS }))}
        >
          <ListItemText primary='Users' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={tab === ECommunityTabs.REPORTS}
          onClick={() => dispatch(changeCommunityTab({ isCommunityTabs: ECommunityTabs.REPORTS }))}
        >
          <ListItemText primary='Reports' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          selected={tab === ECommunityTabs.SETTINGS}
          onClick={() => dispatch(changeCommunityTab({ isCommunityTabs: ECommunityTabs.SETTINGS }))}
        >
          <ListItemText primary='Settings' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          disabled
          selected={tab === ECommunityTabs.PAYMENT}
          onClick={() => dispatch(changeCommunityTab({ isCommunityTabs: ECommunityTabs.PAYMENT }))}
        >
          <ListItemText primary='Payment' />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

const CommunityInfo = () => {
  const dispatch = useAppDispatch();
  const mobile = useMediaQuery('(max-width:1000px)');
  const selectedCommunity = useAppSelector(getSelectedCommunity);

  const renderButton = useMemo(() => {
    if (mobile) {
      return (
        <div style={{ position: 'absolute', left: 20, transform: 'translate(0, 50%)' }}>
          <Button onClick={() => dispatch(changeMenuStatus({ isOpenMenu: true }))}><MenuIcon /></Button>
        </div>
      );
    }

    return null;
  }, [mobile, dispatch]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', width: '100%' }}>
      {renderButton}
      <Typography align="center" variant="h4" color="text.secondary" gutterBottom>
        {selectedCommunity?.name}
      </Typography>
    </div>
  )
};

function CustomTabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const Community: React.FC = () => {
  const mobile = useMediaQuery('(max-width:1000px)');
  const { communityId: communityId = '' } = useParams<LocationsList>();
  const editableCommunity = useAppSelector(InitEditableCommunitySelector);
  const dispatch = useAppDispatch();
  const menuStatus = useAppSelector(currentMenuStatus);
  const tab = useAppSelector(currentCommunityTab);

  const { data, isLoading } = useGetCommunityQuery({ id: communityId },
    {
      skip: !communityId,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (data && editableCommunity.latitude === 0) {
      const { name, address, radius, private: privateStatus, geometry: { coordinates } } = data;
      dispatch(setSelectedCommunity({ selectedCommunity: data }));
      dispatch(changeEditableCommunity({
        label: name,
        address,
        radius,
        private: privateStatus,
        longitude: coordinates[1],
        latitude: coordinates[0]
      }));
    }
  }, [data, editableCommunity, dispatch]);

  if (isLoading) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div>
        <CommunityHeader />
        <div className="community">
          <CommunityInfo />
          <div className="community-contatiner">
            {mobile ? null : (
              <div className="community-menu">
                <CommunityMenuList />
              </div>
            )}
            <div style={{ width: '100%' }}>
              <CustomTabPanel value={ECommunityTabs.DASHBOARD} index={tab}>
                <CommunityStatistics />
              </CustomTabPanel>
              <CustomTabPanel value={ECommunityTabs.USERS} index={tab}>
                <CommunityUsers />
              </CustomTabPanel>
              <CustomTabPanel value={ECommunityTabs.REPORTS} index={tab}>
                <CommunityReports />
              </CustomTabPanel>
              <CustomTabPanel value={ECommunityTabs.SETTINGS} index={tab}>
                <CommunitySingleSettings />
              </CustomTabPanel>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        open={menuStatus}
        onClose={() => dispatch(changeMenuStatus({ isOpenMenu: false }))}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-root': {
            position: 'absolute'
          },
          '& .MuiPaper-root': {
            position: 'absolute',
            width: 300
          },
        }}
      >
        <CommunityMenuList />
      </Drawer>
    </>
  );
};

export default Community;
