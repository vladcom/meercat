import { PropsWithChildren } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import { isAuth, useGetMyProfileQuery } from 'src/redux/auth';
import { isMapFinallyMountedSelector } from 'src/redux/map';
import SplashScreen from '../SplashScreen/SplashScreen';

export default function AuthGuard({ children }: PropsWithChildren) {
  const isUserAuthorized = useAppSelector(isAuth);
  const isMapLoaded = useAppSelector(isMapFinallyMountedSelector);
  useGetMyProfileQuery(undefined, {
    skip: isUserAuthorized === false,
    //1000 ms * 60 sec * 2 min
    pollingInterval: 1000 * 60 * 2,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  return (
    <>
      {(isUserAuthorized === null || !isMapLoaded) && <SplashScreen />}
      {children}
    </>
  );
}
