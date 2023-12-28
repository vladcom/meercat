import React, { useState, useCallback, useEffect, PropsWithChildren, useContext } from 'react';
import {
  NotificationsContext,
  IOpenSnackbar,
  notificationsContextInitialValues,
  NotificationType,
} from './notificationsContext';

const NotificationsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(
    notificationsContextInitialValues.isSnackbarOpen
  );
  const [snackStatus, setSnackStatus] = useState<string | null>(
    notificationsContextInitialValues.snackStatus
  );
  const [snackMessage, setSnackMessage] = useState(notificationsContextInitialValues.snackMessage);

  useEffect(() => {
    setTimeout(() => {
      if (isSnackbarOpen) {
        setIsSnackbarOpen(false);
      }
    }, 5000);
  }, [isSnackbarOpen]);

  const openSnackbar: typeof notificationsContextInitialValues.openSnackbar = useCallback(
    ({ open, status, message }: IOpenSnackbar) => {
      setSnackStatus(status);
      setIsSnackbarOpen(open);
      setSnackMessage(message);
    },
    []
  );

  const contextData: NotificationType = {
    snackStatus,
    openSnackbar,
    snackMessage,
    isSnackbarOpen,
  };

  return (
    <NotificationsContext.Provider value={contextData}>{children}</NotificationsContext.Provider>
  );
};

export function useNotificationContext() {
  return useContext(NotificationsContext);
}

export default NotificationsProvider;
