import isUndefined from 'lodash/isUndefined';
import { memo, useState } from 'react';
import { usePlaces } from 'src/redux/places/hooks';
import MyPlaceMarker from '../Markers/MyPlaceMarker';

function MapboxMyAddress() {
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const { userPlaces } = usePlaces();
  if (isUndefined(userPlaces)) {
    return <></>;
  }
  return (
    <>
      {userPlaces.map((i) => (
        <MyPlaceMarker item={i} key={i._id} showPopup={showPopup} setShowPopup={setShowPopup} />
      ))}
    </>
  );
}

export default memo(MapboxMyAddress);
