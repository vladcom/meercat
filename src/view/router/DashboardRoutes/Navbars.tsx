import { Drawer } from '@mui/material';
import memoize from 'lodash/memoize';
import { memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { isProfileWindowOpen, setMainModalState } from 'src/redux/modals';
import NavBar from 'src/view/components/NavBar/NavBar';
import Navigation from 'src/view/components/Navigation/Navigation';

type OpenStrategy = 'open' | 'close';

const NavbarWrapper = () => {
  const dispatch = useAppDispatch();
  const isProfileWindow = useAppSelector(isProfileWindowOpen);
  const openProfileWindow = useCallback(
    (strategy: OpenStrategy) => {
      return memoize((event: React.SyntheticEvent<unknown, Event>) => {
        event.stopPropagation();
        dispatch(setMainModalState({ isProfileWindowOpen: strategy === 'open' ? true : false }));
      });
    },
    [dispatch]
  );

  return (
    <>
      <NavBar />
      <Drawer
        anchor='left'
        open={isProfileWindow}
        onClose={openProfileWindow('close')}
        style={{ zIndex: 13 }}
      >
        <Navigation />
      </Drawer>
    </>
  );
};

export default memo(NavbarWrapper);
