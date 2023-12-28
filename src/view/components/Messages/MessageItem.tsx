import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import cls from 'classnames';
import moment from 'moment';
import React, { memo, useCallback, useState } from 'react';
import 'react-contexify/ReactContexify.css';
import { useGetMyProfileQuery } from 'src/redux/auth';
import { IIncidentComment, useDeleteCommentMutation } from 'src/redux/chat';
import css from './MessageItem.module.scss';

const StyledListItemText = styled((props: ListItemTextProps) => <ListItemText {...props} />)(
  () => ({
    '& .MuiTypography-root': {
      fontSize: 16,
    },
  })
);

enum EMessageActionType {
  EDIT = 'edit',
  DELETE = 'delete',
}

type IActionsProps = {
  onSelectedAction: (action: EMessageActionType) => void;
};
const Actions = memo(function Action({ onSelectedAction }: IActionsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const getSelected: React.MouseEventHandler<HTMLLIElement> = (event) => {
    event.stopPropagation();
    const target = event.currentTarget as HTMLLIElement;
    const name = target.dataset.name as EMessageActionType;
    if (!name) return;
    onSelectedAction(name);
  };

  return (
    <>
      <Button
        className='messages-container-box-item-action'
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={solid('ellipsis')} />
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        className='message-item-menu'
        sx={{ width: 320, maxWidth: '100%', zIndex: 3 }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuList>
          {/* <MenuItem data-name={EMessageActionType.EDIT} onClick={getSelected}>
            <ListItemIcon>
              <EditIcon fontSize='inherit' />
            </ListItemIcon>
            <StyledListItemText>Edit</StyledListItemText>
          </MenuItem> */}
          <MenuItem data-name={EMessageActionType.DELETE} onClick={getSelected}>
            <ListItemIcon>
              <DeleteIcon fontSize='inherit' />
            </ListItemIcon>
            <StyledListItemText>Delete</StyledListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
});

type IMessageItemProps = { item: IIncidentComment };
const MessageItem: React.FC<IMessageItemProps> = ({ item }) => {
  const { _id: id, userId, text, createdAt, incidentId } = item;

  const { data: user } = useGetMyProfileQuery();

  const [deleteComment, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteCommentMutation();

  const currentUserId = user?._id;

  const isMyMessage = userId?._id === currentUserId;

  const onSelectedAction = useCallback(
    (action: EMessageActionType) => {
      switch (action) {
        case EMessageActionType.EDIT:
          break;
        case EMessageActionType.DELETE:
          deleteComment({ commentId: id, incidentId, userId: userId?._id });
          break;
        default:
          console.log('Default');
      }
    },
    [deleteComment, id, incidentId, userId?._id]
  );
  return (
    <div
      className={cls(css.messageElement, isDeleted && css.deleted)}
    >
      <div className={cls(css['messageElement-container'])}>
        <div
          className={cls(
            css['messageElement-message'],
            isDeleting && css.deleting
          )}
        >
          <div className={cls(css["messageElement-message-header"])}>
            <p>{`Meercat ${userId?._id && userId?._id.slice(10, 11)}`}</p>
            <div>
              <span>{moment(createdAt).fromNow()}</span>
              {isMyMessage && <Actions onSelectedAction={onSelectedAction} />}
            </div>
          </div>
          <p>{text}</p>
        </div>
        {isDeleting && (
          <div className={cls(css.deletingSpinnerContainer)}>
            <CircularProgress />
          </div>
        )}
      </div>

    </div>
  );
};

export default memo(MessageItem);
