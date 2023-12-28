import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React, { useCallback } from 'react';
import { IPlaces } from 'src/types/IPlaces';
import { useAppDispatch } from '../../../../hooks/useRedux';
import { setEditablePlace } from '../../../../redux/userPlaces';
import toCapitalizeString from '../../../../utils/toCapitalizeString';

interface IUserProfilePlaceItem {
  item: IPlaces;
}

const UserProfilePlaceItem: React.FC<IUserProfilePlaceItem> = ({ item }) => {
  const { label, radius, types } = item;
  const dispatch = useAppDispatch();

  const onClickItem = useCallback(() => {
    dispatch(setEditablePlace({ editablePlace: item }));
  }, [dispatch, item]);

  return (
    <div className='userProfile-places-item' onClick={onClickItem}>
      <div className='userProfile-places-item-info'>
        <p>{toCapitalizeString(label)}</p>
        <span>{`${radius} miles`}</span>
        &nbsp; - &nbsp;
        {types && <span>{`${types.length} alert types`}</span>}
      </div>
      <NavigateNextIcon />
    </div>
  );
};

export default UserProfilePlaceItem;
