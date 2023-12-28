import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CircularProgress } from '@mui/material';
import isEmpty from 'lodash.isempty';
import { memo, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppDispatch } from 'src/hooks/useRedux';
import { useGetMyProfileQuery } from 'src/redux/auth';
import {
  EReportReason,
  useCreateReportIncidentMutation,
  useDeleteMyIncidentMutation,
  useGetSpecificIncidentQuery,
} from 'src/redux/incident';
import { setMainModalState } from 'src/redux/modals';
import { LocationsList } from 'src/view/pages/IncidentPage/LocationPage';

import ModalWindow from '../ModalWindow/ModalWindow';
import { useNotificationContext } from '../NotificationsContext/NotificationsProvider';
import ConfirmDelete from './ConfirmDelete';

const MyIncidentReport: React.FC<{ incidentId: string }> = memo(function MyIncidentReport({
  incidentId,
}) {
  const { openSnackbar } = useNotificationContext();

  const history = useHistory();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteIncident, { isLoading, isSuccess }] = useDeleteMyIncidentMutation();

  const onDeleteInc = useCallback(() => {
    deleteIncident({
      incidentId,
    });
  }, [incidentId]);

  useEffect(() => {
    if (isSuccess) {
      openSnackbar({
        open: true,
        status: 'success',
        message: 'Your request to delete an incident has been queued. The approximate time to delete an incident is 10 minutes.',
      });
      history.push('/');
    }
  }, [history, isSuccess, openSnackbar]);

  const handleOpen = useCallback(() => {
    setIsConfirm(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsConfirm(false);
    history.push('./');
  }, [history]);

  return (
    <div className='reportReport'>
      <div className='reportReport-header'>
        <p style={{ margin: '0 auto' }} className='reportReport-header-title'>Delete this Incident</p>
        <div style={{ width: '40px' }} />
      </div>
      <div className='reportReport-bodyMy'>
        <p>Are you sure you want to delete this incident?</p>
        <div className='reportReport-bodyMy-actions'>
          <Button variant='outlined' onClick={() => history.push('./')}>
            Cancel
          </Button>
          <Button variant='contained' color='error' onClick={handleOpen}>
            Delete
          </Button>
        </div>
      </div>
      <ModalWindow open={isConfirm} handleClose={handleClose}>
        <ConfirmDelete
          handleClose={handleClose}
          onDeleteInc={onDeleteInc}
          createReportLoading={isLoading}
        />
      </ModalWindow>
    </div>
  );
});

const ReportOtherPeopleIncident: React.FC<{ incidentId: string }> = memo(
  function ReportOtherPeopleIncident({ incidentId }) {
    const history = useHistory();

    const dispatch = useAppDispatch();

    const { data: user } = useGetMyProfileQuery();
    const { openSnackbar } = useNotificationContext();

    const [createReport, { isSuccess, isLoading }] = useCreateReportIncidentMutation();

    const [label, setLabel] = useState<EReportReason | null>(null);

    const onCreateReport = useCallback(
      (text: EReportReason) => {
        if (!isEmpty(user)) {
          setLabel(text);
          createReport({ text, incidentId });
        }
        if (isEmpty(user)) {
          dispatch(setMainModalState({ isProfileWindowOpen: true }));
          openSnackbar({
            open: true,
            status: 'warning',
            message: 'Please, login for reporting',
          });
        }
      },
      [createReport, dispatch, incidentId, openSnackbar, user]
    );

    useEffect(() => {
      if (isSuccess) {
        history.push('./');
        openSnackbar({
          open: true,
          status: 'success',
          message: 'Incident reported successfully',
        });
        setLabel(null);
      }
    }, [isSuccess, history, openSnackbar]);

    return (
      <div className='reportReport'>
        <div className='reportReport-header'>
          <p style={{ margin: '0 auto' }} className='reportReport-header-title'>Report this incident</p>
          <div style={{ width: '40px' }} />
        </div>
        <div className={`reportReport-body ${isLoading ? 'disabledBlock' : ''}`}>
          <div
            className='reportReport-body-item'
            onClick={() => onCreateReport(EReportReason.SPAM)}
          >
            <p>It&apos;s spam</p>
            {label === EReportReason.SPAM ? (
              <CircularProgress style={{ width: '16px', height: '16px' }} />
            ) : (
              <FontAwesomeIcon icon={solid('arrow-right')} />
            )}
          </div>
          <div
            className='reportReport-body-item'
            onClick={() => onCreateReport(EReportReason.SCAM)}
          >
            <p>Scam or fraud</p>
            {label === EReportReason.SCAM ? (
              <CircularProgress style={{ width: '16px', height: '16px' }} />
            ) : (
              <FontAwesomeIcon icon={solid('arrow-right')} />
            )}
          </div>
          <div
            className='reportReport-body-item'
            onClick={() => onCreateReport(EReportReason.FALSE_INFORMATION)}
          >
            <p>False information</p>
            {label === EReportReason.FALSE_INFORMATION ? (
              <CircularProgress style={{ width: '16px', height: '16px' }} />
            ) : (
              <FontAwesomeIcon icon={solid('arrow-right')} />
            )}
          </div>
          <div
            className='reportReport-body-item'
            onClick={() => onCreateReport(EReportReason.DONT_LIKE)}
          >
            <p>I just don&apos;t like it</p>
            {label === EReportReason.DONT_LIKE ? (
              <CircularProgress style={{ width: '16px', height: '16px' }} />
            ) : (
              <FontAwesomeIcon icon={solid('arrow-right')} />
            )}
          </div>
        </div>
      </div>
    );
  }
);

const ReportReport = () => {
  const { incidentId = '' } = useParams<LocationsList>();
  const { data } = useGetSpecificIncidentQuery({ incidentId }, { skip: !incidentId });

  const { data: user } = useGetMyProfileQuery();

  const isMyIncident = user && user?._id && data && user?._id === data?.incident.reporter;

  if (isMyIncident) {
    return <MyIncidentReport incidentId={incidentId} />;
  }
  return <ReportOtherPeopleIncident incidentId={incidentId} />;
};

export default memo(ReportReport);
