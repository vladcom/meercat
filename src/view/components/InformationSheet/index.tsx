import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Sheet from 'react-modal-sheet';
import { Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { LocationsList } from 'src/view/pages/IncidentPage/LocationPage';

import { Incident } from 'src/helpers/Incident';
import { useAppDispatch } from 'src/hooks/useRedux';
// import Messages from '../Messages/Messages';
import ReportCard from '../ReportCard/ReportCard';
import ReportReport from '../ReportCard/ReportReport';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button } from "@mui/material";

function useSheetAnimation() {
  const [isAnim, setIsAnim] = useState(true);
  const location = useRouteMatch<LocationsList>('/:incidentId/messages');
  useEffect(() => {
    if (location?.url) {
      setIsAnim(true);
    } else {
      setIsAnim(false);
    }
  }, [location?.url]);

  return isAnim;
}

const InformationSheet = memo(function InformationSheet() {
  const { incidentId = '' } = useParams<LocationsList>();
  const history = useHistory();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>();
  const dispatch = useAppDispatch();

  const animMotion = useSheetAnimation();

  const onClose = useCallback(() => {
    if (!!incidentId) {
      history.push('/');
      Incident.close({
        dispatch,
      });
    }
  }, [history, incidentId, dispatch]);
  const snapGatcher = useCallback(
    (index: number) => {
      if (index === 2) {
        onClose();
      }
    },
    [onClose]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  // useOnClickOutside(containerRef, onClose);

  return (
    <Switch location={location}>
      <Sheet
        ref={ref}
        initialSnap={1}
        prefersReducedMotion={animMotion}
        snapPoints={[0.96, 0.96, 0]}
        className='markerSheet'
        style={{
          zIndex: 3,
        }}
        isOpen={!!incidentId}
        onClose={onClose}
        disableDrag
        onSnap={snapGatcher}
      >
        <div ref={containerRef}>
          <Sheet.Container>
            <Sheet.Header>
              <div className='incidentCardHeader'>
                <Button onClick={() => onClose()}><ArrowBackIosNewIcon /></Button>
              </div>
            </Sheet.Header>
            <Sheet.Content>
              <Switch location={location}>
                <Route path='/:incidentId/report' component={ReportReport} />
                <Route path='/:incidentId'>
                  <ReportCard onClose={onClose} />
                </Route>
              </Switch>
            </Sheet.Content>
          </Sheet.Container>
        </div>
      </Sheet>
    </Switch>
  );
});

export default memo(InformationSheet);
