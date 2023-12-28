import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCommunityUsers, getUserEditStatus, InitEditableUserSelector, useAddUserIntoCommunityMutation,
  useChangeUserRequestStatusMutation,
  useDeleteUserOfCommunityMutation, useEditCommunityUserMutation, useGetCommunityUsersMutation
} from "../../../../../redux/community";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import { LocationsList } from "../../../IncidentPage/LocationPage";
import { ICommunityUser } from "../../../../../types/ICommunity";
import {
  changeEditableUser,
  clearEditableUser,
  EUserRoles, setCommunityUsers, setIsUserEdit
} from "../../../../../redux/community/reducer";
import ModalWindow from "../../../../components/ModalWindow/ModalWindow";
import { useGetMyProfileQuery } from "../../../../../redux/auth";
import CreateUser from "../../../../components/CreateUser/CreateUser";
import toCapitalizeString from "../../../../../utils/toCapitalizeString";
import { useNotificationContext } from "../../../../components/NotificationsContext/NotificationsProvider";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/useRedux";
import { sortByCreatedAt } from "../../../../../utils/sortByCreatedAt";

const CommunityUsers = () => {
  const { data: profile } = useGetMyProfileQuery();
  const { communityId: communityId = '' } = useParams<LocationsList>();
  const dispatch = useAppDispatch();
  const [getUsers, { data, isLoading }] = useGetCommunityUsersMutation();
  const isUserEdit = useAppSelector(getUserEditStatus);
  const editableUser = useAppSelector(InitEditableUserSelector);
  const { openSnackbar } = useNotificationContext();
  const [addUser, { isSuccess: isCreateSuccess, isError: isCreateError, error: createError }] = useAddUserIntoCommunityMutation();
  const [editUser, { isSuccess: isEditSuccess, isError: isEditError, error: editError }] = useEditCommunityUserMutation();
  const [updateUserStatus, { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError}] = useChangeUserRequestStatusMutation();
  const [deleteUser, { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError}] = useDeleteUserOfCommunityMutation();
  const [isOpen, setIsOpen] = useState(false);
  const users = useAppSelector(getCommunityUsers);

  useEffect(() => {
    if (data) {
      dispatch(setCommunityUsers({ communityUsers: data }));
    }
    return void 0;
  }, [data, dispatch]);

  useEffect(() => {
    if (!users.length) {
      getUsers({ communityId, });
    }
    return void 0;
  }, [users, getUsers, communityId]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    dispatch(setIsUserEdit({ isUserEdit: false }));
    dispatch(clearEditableUser());
  };

  useEffect(() => {
    if (isCreateError) {
      const message = (createError as Record<string, Record<string, string>>)?.data?.message ?? '';
      openSnackbar({ open: true, status: 'error', message: `${message}. Please try again`, });
    }
    if (isEditError) {
      const message = (editError as Record<string, Record<string, string>>)?.data?.message ?? '';
      openSnackbar({ open: true, status: 'error', message: `${message}. Please try again`, });
    }
    if (isDeleteError) {
      const message = (deleteError as Record<string, Record<string, string>>)?.data?.message ?? '';
      openSnackbar({ open: true, status: 'error', message: `${message}. Please try again`, });
    }
    if (isUpdateError) {
      const message = (updateError as Record<string, Record<string, string>>)?.data?.message ?? '';
      openSnackbar({ open: true, status: 'error', message: `${message}. Please try again`, });
    }
  }, [isDeleteError, isUpdateError, createError, isEditError, editError, isCreateError, updateError, deleteError, openSnackbar]);

  useEffect(() => {
    if (isCreateSuccess) {
      setIsOpen(false);
      openSnackbar({ open: true, status: 'success', message: 'User created successfully', });
    }
    if (isEditSuccess) {
      setIsOpen(false);
      openSnackbar({ open: true, status: 'success', message: 'User updated successfully', });
    }
    if (isDeleteSuccess) {
      openSnackbar({ open: true, status: 'success', message: 'User deleted successfully', });
    }
    if (isUpdateSuccess) {
      openSnackbar({ open: true, status: 'success', message: 'User updated successfully', });
    }
  }, [isDeleteSuccess, isEditSuccess, isCreateSuccess, isUpdateSuccess, openSnackbar]);

  const onCreateUser = useCallback((values: ICommunityUser) => {
    if (isUserEdit) {
      const { _id } = editableUser;
      const { name, role } = values;
      editUser({ data: { name, userId: _id, role }, communityId })
        // @ts-ignore
        .then(({ data }: { data: any }) => {
          if (data) {
            getUsers({
              communityId,
            });
            dispatch(clearEditableUser());
          }
        });
    } else {
      addUser({ data: values, communityId })
        // @ts-ignore
        .then(({ data }: { data: any }) => {
          if (data) {
            getUsers({
              communityId,
            });
            dispatch(clearEditableUser());
          }
        });
    }
  }, [addUser, editUser, isUserEdit, dispatch, editableUser, communityId]);


  const onClickUserActionButton = ({ action, id }: { action: string, id: string }) => {
    updateUserStatus({ action, userId: id, communityId })
      // @ts-ignore
      .then(({ data }: { data: any }) => {
        if (data) {
          getUsers({
            communityId,
          });
        }
      });
  }

  const onDeleteUser = ({ userId }: { userId: string }) => {
    deleteUser({ communityId, userId, })
      // @ts-ignore
      .then(({ data }: { data: any }) => {
        if (data) {
          getUsers({
            communityId,
          });
        }
      });
  };

  const onClickEditUser = (user: ICommunityUser) => {
    dispatch(setIsUserEdit({ isUserEdit: true }));
    dispatch(changeEditableUser(user));
    setIsOpen(true);
  }

  const renderButtons = (user: ICommunityUser) => {
    const { role, _id: id } = user;
    if (role === EUserRoles.REQUESTED) {
      return (
        <>
          <Button
            variant="contained"
            onClick={() => onClickUserActionButton({ action: 'approve', id })}
          >
            Approve
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            onClick={() => onClickUserActionButton({ action: 'reject', id })}
          >
            Reject
          </Button>
        </>
      );
    }
    if (role !== EUserRoles.REQUESTED) {
      if (profile?._id === id) {
        return (
          <>
            <Button disabled variant="text" onClick={() => onClickEditUser(user)}>Edit</Button>
          </>
        );
      }
      if (role === EUserRoles.INVITED) {
        return (
          <>
            <Button
              variant="text"
              style={{ marginLeft: '10px' }}
              onClick={() => onDeleteUser({ userId: id })}
            >
              Delete
            </Button>
          </>
        );
      }
      return (
        <>
          <Button disabled variant="text" onClick={() => onClickEditUser(user)}>Edit</Button>
          <Button
            variant="text"
            style={{ marginLeft: '10px' }}
            onClick={() => onDeleteUser({ userId: id })}
          >
            Delete
          </Button>
        </>
      );
    }
  };

  const renderTable = useMemo(() => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={3} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    return users && users.length ? (
      sortByCreatedAt(users).map((user: ICommunityUser) => (
        <TableRow
          key={user._id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          style={{ background: user.role === EUserRoles.REQUESTED ? '#fff6e8' : 'transparent' }}
        >
          <TableCell component="th" scope="row">
            {user.name ? user.name : <i>Empty name</i>}
          </TableCell>
          <TableCell align="center">{toCapitalizeString(user.role)}</TableCell>
          <TableCell align="right">
            {renderButtons(user)}
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={3} align="center">No users</TableCell>
      </TableRow>
    )
  }, [isLoading, users, renderButtons]);

  return (
    <div style={{ maxWidth: 650, margin: '50px 0 ' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <Typography variant="h5" gutterBottom>
          Users
        </Typography>
        <Button onClick={handleOpen}>Add new</Button>
      </div>
      <TableContainer component={Paper}
      >
        <Table sx={{  margin: '0 auto' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTable}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalWindow open={isOpen} handleClose={handleClose}>
        <CreateUser handleClose={handleClose} onCreateUser={onCreateUser} />
      </ModalWindow>
    </div>
  );
};

export default CommunityUsers;
