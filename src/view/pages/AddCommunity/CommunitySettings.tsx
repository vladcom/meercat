import React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { shallowEqual } from "react-redux";
import { InitEditableCommunitySelector } from "../../../redux/community";
import Mapbox from "../../components/Mapbox/Mapbox";
import UserPlaceMarker from "../../components/Mapbox/Markers/UserPlaceMarker";
import { Button, CircularProgress, Slider } from "@mui/material";
import {
  changeCommunityStep,
  changeEditableCommunity,
  ECommunityContainer
} from "../../../redux/community/reducer";

interface ICommunitySettings {
  onSaveCommunityData: () => void;
  isLoading?: boolean;
}
const CommunitySettings: React.FC<ICommunitySettings> = ({ onSaveCommunityData, isLoading }) => {
  const dispatch = useAppDispatch();
  const editablePlace = useAppSelector(InitEditableCommunitySelector, shallowEqual);

  return (
    <div>
      <div>
        <p>Name of Community: {editablePlace.label}</p>
        <p>Address: {editablePlace.address}</p>
      </div>
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
            dispatch(changeEditableCommunity({ radius: target.value as unknown as number }));
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button onClick={() => dispatch(changeCommunityStep({ isCommunityStep: ECommunityContainer.INFO }))} variant="outlined">
          Back
        </Button>
        <Button onClick={onSaveCommunityData} variant="outlined">
          {isLoading ? <CircularProgress /> : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default CommunitySettings;
