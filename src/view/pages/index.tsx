import { Suspense, lazy, memo, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Mapbox from 'src/view/components/Mapbox';
import { AlertSnackbar } from '../components/AlertSnackbar';
import ReportWindowModal from '../components/ReportWindowModal';
import './styles.scss';

const RoutesList = {
  MAIN: lazy(() => import('./MainPage/MainPage')),
  INCIDENT: lazy(() => import('./IncidentPage/Incident')),
  TERMS: lazy(() => import('./Terms/Terms')),
  PRIVACY: lazy(() => import('./Privacy/Privacy')),
  DASHBOARD: lazy(() => import('./Dashboard/Dashboard')),
  ADD_COMMUNITY: lazy(() => import('./AddCommunity/AddCommunity')),
  COMMUNITY_ITEM: lazy(() => import('./Community/Community')),
} as const;

const Routes = () => {
  const { body } = document;
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes('/terms')
      || pathname.includes('/privacy')
      || pathname.includes('/dashboard')
      || pathname.includes('/dashboard/add-community')
    ) {
      body.setAttribute('class', 'singlePage');
    }

    return () => {
      body.removeAttribute('class');
    };
  }, [pathname, body]);

  return (
    <>
      <ReportWindowModal />
      <Suspense fallback={<div>fallback...</div>}>
        <Switch>
          <Route
            exact
            path='/terms'
            render={() => (
              <Suspense fallback={<></>}>
                <RoutesList.TERMS />
              </Suspense>
            )}
          />
          <Route
            exact
            path='/privacy'
            render={() => (
              <Suspense fallback={<></>}>
                <RoutesList.PRIVACY />
              </Suspense>
            )}
          />
          <Route
            exact
            path='/dashboard'
            render={() => (
              <Suspense fallback={<></>}>
                <RoutesList.DASHBOARD />
              </Suspense>
            )}
          />
          <Route
            exact
            path='/dashboard/add-community'
            render={() => (
              <Suspense fallback={<></>}>
                <RoutesList.ADD_COMMUNITY />
              </Suspense>
            )}
          />
          <Route
            path='/dashboard/community/:communityId([0-9a-fA-F]{24})'
            render={() => (
              <Suspense fallback={<></>}>
                <RoutesList.COMMUNITY_ITEM />
              </Suspense>
            )}
          />
        </Switch>
      </Suspense>
      <div className='map'>
        <Mapbox.Main />
      </div>
      <div className='map-action'>
        <Suspense fallback={<div>fallback...</div>}>
          <Switch>
            <Route
              exact
              path='/'
              render={() => (
                <Suspense fallback={<></>}>
                  <RoutesList.MAIN />
                </Suspense>
              )}
            />
            <Route
              path='/:incidentId([0-9a-fA-F]{24})'
              render={() => (
                <Suspense fallback={<></>}>
                  <RoutesList.INCIDENT />
                </Suspense>
              )}
            />
            <Redirect from={'(new-incident)w+'} to='/' />
          </Switch>
        </Suspense>
      </div>
      <AlertSnackbar />
    </>
  );
};

export default memo(Routes);
