import React from 'react';
export interface IOpenSnackbar {
  message: string;
  open: boolean;
  status: string;
}
const missingProvider = () => {
  throw new Error('Attempted to useNotification without NotificationProvider');
};

export type NotificationType = {
  isSnackbarOpen: boolean;
  snackStatus: string | null;
  snackMessage: string;
  openSnackbar: (props: IOpenSnackbar) => void;
};

export const notificationsContextInitialValues: NotificationType = {
  isSnackbarOpen: false,
  snackStatus: null,
  snackMessage: '',
  openSnackbar: missingProvider,
};

export const NotificationsContext = React.createContext<NotificationType>(
  notificationsContextInitialValues
);
