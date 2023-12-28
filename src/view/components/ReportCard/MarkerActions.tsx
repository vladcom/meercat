import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import isEmpty from 'lodash.isempty';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from 'src/hooks/useRedux';
import { useGetMyProfileQuery } from 'src/redux/auth';
import {
  ELikeAction,
  useGetSpecificIncidentQuery,
  useIncidentLikeMutationMutation,
} from 'src/redux/incident';
import { setMainModalState } from 'src/redux/modals';
import ModalWindow from '../ModalWindow/ModalWindow';
import { useNotificationContext } from '../NotificationsContext/NotificationsProvider';
import ShareLinkWindow from '../ShareLinkWindow/ShareLinkWindow';
import '../ReportWindow/style.scss';

type ILikeComponentProps = {
  incidentId: string;
  votedArray?: string[];
  like?: number;
};
const LikeComponent: React.FC<ILikeComponentProps> = memo(function LikeComponent({
  votedArray,
  incidentId,
  like,
}) {
  const { data: user } = useGetMyProfileQuery();
  const dispatch = useAppDispatch();
  const { openSnackbar } = useNotificationContext();
  const [likeIncident, { isLoading }] = useIncidentLikeMutationMutation();

  const isVoted = useMemo(() => {
    if (!user?._id) return false;
    return votedArray?.includes(user?._id as string) ?? false;
  }, [user, votedArray]);

  const onClickLike = useCallback(() => {
    if (isEmpty(user)) {
      dispatch(setMainModalState({ isProfileWindowOpen: true }));
      openSnackbar({
        open: true,
        status: 'warning',
        message: 'Please, login for voting',
      });
    } else if (!isEmpty(user)) {
      likeIncident({
        incidentId,
        userId: user?._id,
        event: isVoted ? ELikeAction.DISLIKE : ELikeAction.LIKE,
      });
    }
  }, [user, dispatch, openSnackbar, incidentId, isVoted, likeIncident]);

  return (
    <div className='reportCard-actions-item'>
      <Tooltip title={!isVoted ? 'Click to like' : 'Click to cancel like'} placement='top'>
        <span>
          <Button onClick={onClickLike} disabled={isLoading}>
            {!isVoted ? (
              <FontAwesomeIcon icon={regular('thumbs-up')} />
            ) : (
              <FontAwesomeIcon icon={solid('thumbs-up')} />
            )}
            <span className='map-markerInfo-actions-vote-count'>{like || 0}</span>
          </Button>
        </span>
      </Tooltip>
    </div>
  );
});

type IMessageComponentProps = {
  commentsCount?: number;
  allowComments?: boolean;
};

const MessageComponent: React.FC<IMessageComponentProps> = memo(function MessageComponent({
  commentsCount,
  allowComments
}) {
  return (
    <div className='reportCard-actions-item'>
      <Tooltip title={!allowComments ? 'Comments disallowed' : 'Click to comment'} placement='top'>
        <Button disabled={!allowComments}>
          {!allowComments ? (
            <FontAwesomeIcon icon={solid('comment-slash')} />
            ) : (
            <FontAwesomeIcon icon={regular('comments')} />
          )}
          <span className='map-markerInfo-actions-vote-count'>{commentsCount || 0}</span>
        </Button>
      </Tooltip>
    </div>
  );
});

const ShareLink: React.FC<{
  incidentId: string;
}> = memo(function ShareLink({ incidentId }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className='reportCard-actions-item'>
      <Tooltip title='Click to copy link' placement='top'>
        <Button onClick={handleOpen}>
          <FontAwesomeIcon icon={solid('share')} />
          <span className='map-markerInfo-actions-vote-count'>Share</span>
        </Button>
      </Tooltip>
      <ModalWindow open={isOpen} handleClose={handleClose}>
        <ShareLinkWindow handleClose={handleClose} incidentId={incidentId} />
      </ModalWindow>
    </div>
  );
});

const MarkerActions: React.FC<{ incidentId: string }> = ({ incidentId }) => {
  const dispatch = useAppDispatch();
  const { data: user } = useGetMyProfileQuery();
  const { data } = useGetSpecificIncidentQuery({ incidentId }, { skip: !incidentId });

  const history = useHistory();

  const { openSnackbar } = useNotificationContext();
  const { like, commentsCount, votedArray, allowComments } = data?.incident ?? {};

  const onClickReport = useCallback(() => {
    if (!isEmpty(user)) {
      history.push(`/${incidentId}/report`);
    }
    if (isEmpty(user)) {
      dispatch(setMainModalState({ isProfileWindowOpen: true }));
      openSnackbar({
        open: true,
        status: 'warning',
        message: 'Please, login for reporting',
      });
    }
  }, [dispatch, user, incidentId, history, openSnackbar]);

  if (data)
    return (
      <div className='markerActions'>
        <div className='reportCard-actions'>
          <LikeComponent like={like} incidentId={incidentId} votedArray={votedArray} />
          <MessageComponent commentsCount={commentsCount} allowComments={allowComments} />
          <ShareLink incidentId={incidentId} />
          <div className='reportCard-actions-item'>
            <Button onClick={onClickReport}>
              <FontAwesomeIcon icon={solid('ellipsis')} />
              <span className='map-markerInfo-actions-vote-count'>More</span>
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className='markerActions'>
      <Skeleton animation='wave' style={{ margin: '0 13%', height: '60px' }} />
    </div>
  );
};

export default memo(MarkerActions);
