import WestIcon from '@mui/icons-material/West';
import { Button, Slider } from '@mui/material';
import React, { memo } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useRedux';
import {
  EUserPlaceContainer,
  InitEditablePlaceSelector,
  changeEditablePlace,
  changeUserStep,
} from '../../../../redux/userPlaces';
import Mapbox from '../../Mapbox/Mapbox';
import UserPlaceMarker from '../../Mapbox/Markers/UserPlaceMarker';
import UserPlaceTypeSelection from './components/UserPlaceTypeSelection';

interface IUserPlaceParams {
  onSaveUserPlace: () => void;
}
const UserPlaceParams: React.FC<IUserPlaceParams> = ({ onSaveUserPlace }) => {
  const dispatch = useAppDispatch();
  const editablePlace = useAppSelector(InitEditablePlaceSelector, shallowEqual);

  if (editablePlace.address) {
    return (
      <div className='userProfile-placeInfo'>
        <div className='userProfile-placeInfo-header'>
          <Button
            onClick={() => dispatch(changeUserStep({ isUserStep: EUserPlaceContainer.INFO }))}
          >
            <WestIcon />
          </Button>
          <div className='userProfile-placeInfo-header-titleLabel'>
            <p>{editablePlace.label}</p>
            <p className='userProfile-placeInfo-header-titleLabel-address'>
              {editablePlace.address}
            </p>
          </div>
          <Button disabled={!editablePlace?.types?.length} onClick={onSaveUserPlace}>
            Save
          </Button>
        </div>
        <p className='userProfile-preview-user-info'>
          Set distance from location and the type of alerts you want to receive
        </p>
        <div className='userProfile-placeInfo-map'>
          <Mapbox
            latitude={editablePlace.latitude}
            longitude={editablePlace.longitude}
            dragPan={false}
            style={{
              width: '100%',
              height: '35vh',
            }}
          >
            <UserPlaceMarker placeData={editablePlace} />;
          </Mapbox>
          <span>{`Up to ${editablePlace?.radius} miles away`}</span>
        </div>
        <div className='userProfile-placeInfo-slider'>
          <Slider
            max={25}
            min={0.5}
            step={0.5}
            value={editablePlace?.radius ?? 1}
            onChange={(e) => {
              const target = e?.target as HTMLInputElement;
              dispatch(changeEditablePlace({ radius: target.value as unknown as number }));
            }}
          />
        </div>
        <UserPlaceTypeSelection />
      </div>
    );
  }
  return <></>;
};

export default memo(UserPlaceParams);
