import { createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { detect } from 'detect-browser';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'src/redux';
import AuthGuard from '../components/AuthorisationContext/AuthGuard';
import FirebaseNotificationsProvider from '../components/FirebaseNotificationsContext/FirebaseNotificationsContext';
import { MapProvider } from '../components/MapContext';
import { NotificationsProvider } from '../components/NotificationsContext';
import DashboardRoutes from './DashboardRoutes/DashboardRoutes';

const theme = createTheme({});

const Routing = () => {
  useEffect(() => {
    const body = document.querySelector('body');
    const browser = detect();
    if (browser && body) {
      body?.setAttribute('data-os', browser?.os ?? '');
      body?.setAttribute('data-browserversion', browser.version ?? '');
      body.setAttribute('data-browsername', browser.name);
    }
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={import.meta.env.PUBLIC_URL}>
          <Provider store={store}>
            <AuthGuard>
              <FirebaseNotificationsProvider>
                <NotificationsProvider>
                  <MapProvider>
                    <DashboardRoutes />
                    <CssBaseline />
                  </MapProvider>
                </NotificationsProvider>
              </FirebaseNotificationsProvider>
            </AuthGuard>
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default Routing;
