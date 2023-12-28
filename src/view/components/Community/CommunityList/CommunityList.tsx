import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGetMyCommunitiesQuery } from "../../../../redux/community";
import isEmpty from "lodash.isempty";
import './style.scss';
import { CircularProgress, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { ICommunity } from "../../../../types/ICommunity";
import ModalWindow from "../../ModalWindow/ModalWindow";
import UpdateUserProfileModal from "../../UpdateUserProfileModal/UpdateUserProfileModal";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../../../../redux/auth";
import { isNull } from "../../../../utils/isNull";
import { useNotificationContext } from "../../NotificationsContext/NotificationsProvider";

interface ICommunityListItem {
  item: ICommunity;
}

const CommunityListItem: React.FC<ICommunityListItem> = ({ item }) => {
  const history = useHistory();
  const onClickItem = useCallback(() => {
    history.push(`/dashboard/community/${item?._id}`)
  }, [history, item]);
  return (
    <div key={item._id} className="commList-container-item" onClick={onClickItem}>
      <p>{item.name}</p>
      <p>{item.address}</p>
    </div>
  );
};

const CommunityList = () => {
  const history = useHistory();
  const { data: user } = useGetMyProfileQuery();
  const { data: list = [], isLoading } = useGetMyCommunitiesQuery(undefined);
  const [update, { isLoading: isLoadingUpdating, isError, isSuccess, error }] = useUpdateMyProfileMutation();
  const { openSnackbar } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (isError) {
      const message = (error as Record<string, Record<string, string>>)?.data?.message ?? '';
      openSnackbar({ open: true, status: 'error', message: `${message}. Please try again`, });
    }
  }, [isError, error, openSnackbar]);

  const onClickAdd = useCallback(() => {
    if (user) {
      const { name, email } = user;
      if (isNull(name) || isNull(email)) {
        handleOpen();
      } else {
        return  history.push("/dashboard/add-community");
      }
    }
  }, [history, user, handleOpen]);

  useEffect(() => {
    if (isSuccess) {
      openSnackbar({ open: true, status: 'success', message: 'User updated successfully', });
      return  history.push("/dashboard/add-community");
    }
  }, [openSnackbar, history, isSuccess]);

  const renderCommunitiesList = useMemo(() => {
    if (isLoading) {
      return (
        <div className="commList-noCom">
          <CircularProgress />
        </div>
      );
    }
    if (isEmpty(list)) {
      return (
        <div className="commList-noCom" onClick={onClickAdd}>
          <p>Add your first Community</p>
        </div>
      );
    }
    return list?.map((i: ICommunity) => (<CommunityListItem item={i} key={i._id} />));
  }, [list, onClickAdd, isLoading]);

  const onUpdateProfile = useCallback((values: any) => {
    if (user) {
      const { name: userName, email: userEmail } = user;
      const { name, email } = values;
      const isName = name && name.length && userName !== name ? { name } : {};
      const isEmail = email && email.length && userEmail !== email ? { email } : {};
      console.log(values)
      update({
        id: user?._id,
        ...isName,
        ...isEmail,
      });
    }
  }, [user, update]);

  return (
    <div className="commList">
      <div className="commList-container">
        <div className="commList-container-header">
          <h3 className="commList-container-title">My Communities</h3>
          <IconButton
            aria-label="add"
            onClick={onClickAdd}
            style={{ height: '40px', width: '40px' }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </div>
        {renderCommunitiesList}
      </div>
      <ModalWindow open={isOpen} handleClose={handleClose}>
        <UpdateUserProfileModal handleClose={handleClose} onUpdateProfile={onUpdateProfile} isLoadingUpdating={isLoadingUpdating} />
      </ModalWindow>
    </div>
  );
};

export default CommunityList;
