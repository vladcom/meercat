import { Button, Checkbox, CircularProgress } from '@mui/material';
import React, { memo, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { InitEditablePlaceSelector, changeEditablePlace } from 'src/redux/userPlaces';

import { useGetIncidentTypesQuery } from "../../../../../redux/incident";
import { formatIncidentName } from "../../../../../helpers/formatIncidentName";
import { camelToSnake } from "../../../../../utils/camelToSnake";

const UserPlaceTypeSelectionItem = ({
  item,
  types,
  onSelectItem,
}: {
  item: any;
  types: string[] | undefined;
  onSelectItem: any;
}) => {
  const { _id: id, name, icon } = item;

  return (
    <div
      key={id}
      onClick={() => onSelectItem(id)}
      className={`userProfile-types-item ${
        types && types.includes(id) ? 'userProfile-types-item-active' : ''
      }`}
    >
      <Checkbox className='userProfile-types-item-check' checked={types && types.includes(id)} />
      <img src={icon} alt={name} />
      <p className='userProfile-types-item-title'>{formatIncidentName(camelToSnake(name))}</p>
    </div>
  );
};

const UserPlaceTypeSelection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { types } = useAppSelector(InitEditablePlaceSelector);
  const { data: incTypes, isLoading } = useGetIncidentTypesQuery(undefined);

  const onSelectItem = useCallback(
    (id: string) => {
      if (id && types) {
        const sel = [...(types ?? [])];
        const find = types.indexOf(id);
        if (find > -1) {
          sel.splice(find, 1);
        } else {
          sel.push(id);
        }
        dispatch(changeEditablePlace({ types: sel }));
      }
    },
    [types, dispatch]
  );

  const selectAll = useCallback(() => {
    if (incTypes && types?.length === incTypes.length) {
      dispatch(changeEditablePlace({ types: [] }));
    } else {
      if (incTypes) {
        const arr: string[] = [];
        for (let i = 0; i <= incTypes.length; i += 1) {
          if (incTypes[i]) {
            arr.push(incTypes[i]._id);
          }
        }
        dispatch(changeEditablePlace({ types: arr }));
      }
    }
  }, [types?.length, dispatch]);

  const renderItems = useMemo(() => {
    if (isLoading) {
      return <CircularProgress />;
    }

    if (incTypes) {
      return incTypes.map((item, index) => (
        <UserPlaceTypeSelectionItem
          key={index}
          item={item}
          types={types}
          onSelectItem={onSelectItem}
        />
      ));
    }
  }, [onSelectItem, incTypes, types, isLoading]);

  return (
    <div className='userProfile-types'>
      <div className='userProfile-types-header'>
        <Button onClick={selectAll}>
          {incTypes && types?.length === incTypes.length ? 'Unselect all' : 'Select all'}
        </Button>
      </div>
      <div className='userProfile-types-container'>{renderItems}</div>
    </div>
  );
};

export default memo(UserPlaceTypeSelection);
