import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CircularProgress, useMediaQuery } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import cls from 'classnames';
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION } from 'src/constants/map';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { isAuth } from 'src/redux/auth';
import { useIsMyGeoAvailableAtPageLoadQuery } from 'src/redux/helpers';
import { setMainModalState } from 'src/redux/modals';
import { useBrowserGeolocation } from 'src/view/hooks/useBrowserGeolocation';
import LogoIcon from '../../../static/img/yellow.svg';
import { useMapStore } from 'src/view/components/MapContext';
import { useNotificationContext } from '../NotificationsContext/NotificationsProvider';
import css from './NavBar.module.scss';

function useGeolocation() {
  const history = useHistory();

  const { openSnackbar } = useNotificationContext();

  const [isGettingCords, setIsGettingCords] = useState(false);
  const planTo = useMapStore((state) => state.planTo);
  const {
    coords,
    isGeolocationEnabled,
    getPosition: manuallyGetPosition,
  } = useBrowserGeolocation({
    suppressLocationOnMount: true,
    watchPosition: false,
    onSuccess(position) {
      if (!isGettingCords) return;
      if (
        !position?.coords?.latitude &&
        !position?.coords?.longitude &&
        position?.coords?.altitude &&
        position?.coords?.altitude <= 0
      )
        return;
      setIsGettingCords(false);
      planTo({
        latitude: position?.coords?.latitude,
        longitude: position?.coords?.longitude,
        zoom: ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION,
        animate: false,
      });
      history.push('/new-incident');
    },
    onError() {
      setIsGettingCords(false);
      openSnackbar({
        open: true,
        status: 'error',
        message: 'You should share your geo locations for report',
      });
    },
  });

  const getPosition = useCallback(() => {
    setIsGettingCords(true);
    manuallyGetPosition();
  }, [manuallyGetPosition]);

  return useMemo(
    () => ({ isGeolocationEnabled, getPosition, isGettingCords, coords } as const),
    [getPosition, isGeolocationEnabled, isGettingCords, coords]
  );
}
const NavBar: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { openSnackbar } = useNotificationContext();
  const { coords, isGettingCords, getPosition } = useGeolocation();
  const { refetch } = useIsMyGeoAvailableAtPageLoadQuery(undefined);
  const isUserAuthorized = useAppSelector(isAuth);
  const [isSinglePage, setIsSinglePage] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);

  console.log('isGettingCords', isGettingCords);

  useEffect(() => {
    if (pathname.includes('/terms') || pathname.includes('/privacy') || pathname.includes('/dashboard')) {
      setIsSinglePage(true);
    }
    if (pathname.includes('/dashboard')) {
      setIsDashboard(true);
    }

    return () => {
      setIsSinglePage(false);
      setIsDashboard(false);
    };
  }, [pathname]);

  const width768 = useMediaQuery('(max-width:768px)');

  const openProfile = useCallback(() => {
    dispatch(setMainModalState({ isProfileWindowOpen: true }));
  }, [dispatch]);

  const onClickUnAuth = useCallback(() => {
    if (isUserAuthorized) {
      return;
    }
    openProfile();
    return openSnackbar({
      open: true,
      status: 'warning',
      message: 'You should Sign-in for report',
    });
  }, [isUserAuthorized, openProfile, openSnackbar]);

  const onLink = useCallback(
    async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      try {
        const geolocationStatus = (await refetch())?.data;
        const isGeolocationEnabled = geolocationStatus === 'granted' || !!coords;
        if (isGeolocationEnabled && isUserAuthorized) {
          return history.push('/new-incident');
        } else if (isUserAuthorized && !isGeolocationEnabled) {
          event.preventDefault();
          getPosition();
          return;
        } else {
          event.preventDefault();
          onClickUnAuth();
        }
      } catch {}
    },
    [coords, history, refetch, isUserAuthorized, onClickUnAuth]
  );

  const onClickBack = useCallback(() => history.goBack(), [history]);

  if (isDashboard) {
    return null;
  }
  if (isSinglePage) {
    return (
      <div className={css.navBar}>
        <div className={cls(css.navBarContainer, css.navBarContainerTop)}>
          <Button startIcon={<ArrowBackIosIcon />} onClick={onClickBack}>Back</Button>
          <span>&nbsp;</span>
          <span>&nbsp;</span>
        </div>
      </div>
    );
  }
  if (width768) {
    return (
      <div className={css.navBar}>
        <div className={css.navBarContainer}>
          <div onClick={onLink}>
            <Button disabled={isGettingCords} className={css.navBarContainerButton}>
              {isGettingCords ? (
                <CircularProgress style={{ width: 25, height: 25 }} />
              ) : (
                <FontAwesomeIcon icon={solid('map-location-dot')} />
              )}
            </Button>
          </div>
          <img src={LogoIcon} alt='logo' title='Meercat' className={css.navBarContainerLogo} />
          <Button onClick={openProfile} className={css.navBarContainerButton}>
            <FontAwesomeIcon icon={regular('user')} />
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className={cls(css.navBar, css.navBarTop)}>
      <div className={cls(css.navBarContainer, css.navBarContainerTop)}>
        <Button onClick={openProfile} className={css.navBarContainerButton}>
          <FontAwesomeIcon icon={regular('user')} />
        </Button>
        <p className={css.navBarContainerLogo}>Meercat</p>
        <div onClick={onLink}>
          <Button
            // disabled={isGettingCords}
            size='small'
            color='error'
            variant='contained'
            className={css.navBarContainerReport}
          >
            Report
            {/*{isGettingCords ? <CircularProgress style={{ width: 25, height: 25 }} /> : 'Report'}*/}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(NavBar);
