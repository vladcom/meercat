import { Button } from '@mui/material';
import circle from '@turf/circle';
import isNull from 'lodash.isempty';
import { useCallback, useMemo } from 'react';
import { Layer, Marker, Popup, Source } from 'react-map-gl';
import { IPlaces } from 'src/types/IPlaces';
import homeIcon from '../../../../static/img/home.svg';
import toCapitalizeString from '../../../../utils/toCapitalizeString';
import { useAppDispatch } from '../../../../hooks/useRedux';
import { setMainModalState } from '../../../../redux/modals';
import { setEditablePlace } from '../../../../redux/userPlaces';

const paint = {
  'fill-color': 'green',
  'fill-opacity': 0.2,
};
const MyPlaceMarker: React.FC<{
  item: IPlaces;
  showPopup: string | null;
  setShowPopup: (data: string | null) => void;
}> = ({ item, setShowPopup, showPopup }) => {
  const dispatch = useAppDispatch();
  const { _id: id, label, radius, latitude, longitude } = item;

  const circleIcon = useMemo(() => {
    const center = [longitude, latitude];
    return circle(center, radius, { units: 'miles' });
  }, [longitude, latitude, radius]);

  const textLabel = useMemo(() => toCapitalizeString(label), [label]);

  const onClickEdit = useCallback(() => {
    dispatch(setMainModalState({ isProfileWindowOpen: true }));
    dispatch(setEditablePlace({ editablePlace: item }));
  }, [dispatch, item]);

  return (
    <>
      <Marker
        anchor='bottom'
        latitude={latitude}
        longitude={longitude}
        onClick={(event) => {
          event.originalEvent.stopPropagation();
          setShowPopup(id);
        }}
      >
        <img src={homeIcon} alt={id} />
      </Marker>
      <Source id={`${id}_item_source`} type='geojson' data={circleIcon}>
        <Layer id={`${id}_item_layer`} type='fill' paint={paint} />
      </Source>
      {!isNull(showPopup) && showPopup === id && (
        <Popup
          anchor='top'
          latitude={latitude}
          longitude={longitude}
          onClose={() => setShowPopup(null)}
        >
          <div style={{ width: 'auto' }}>
            <p
              style={{
                textAlign: 'center',
                fontSize: '16px',
                padding: 0,
                margin: 0,
                fontWeight: 500,
              }}
            >
              {textLabel}
            </p>
            <p
              className='map-markerInfo-text'
              style={{
                textAlign: 'left',
                fontSize: '16px',
                padding: 0,
                margin: 0,
                fontWeight: 400,
              }}
            >
              {`Alert radius: ${radius} mi`}
            </p>
            <Button onClick={onClickEdit} style={{ margin: '0 auto', display: 'flex' }}>
              Edit
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default MyPlaceMarker;
