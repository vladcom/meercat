import { CircularProgress, useMediaQuery } from '@mui/material';
import { createSelector } from '@reduxjs/toolkit';
import cls from 'classnames';
import React, { memo, useMemo } from 'react';
import { frmHoursToTimestamp } from "src/helpers/hoursToTimestamp";
import { useAppSelector } from 'src/hooks/useRedux';
import { selectDashboard, useGetDebouncedBoundsAndCenter } from 'src/redux/dashboard';
import { IMapBounds } from 'src/redux/dashboard/reducer';
import { useFetchHeatmapCountQuery } from 'src/redux/incident';
import style from './DataQuantity.module.scss';

const selectDataQuantity = createSelector(selectDashboard, (state) => ({
    type: state.type,
    isUserDensity: state.isUserDensity,
    formatedHoursFilterInput: frmHoursToTimestamp(state.hoursFilterInput),
}));

type SelectorReturn = ReturnType<typeof selectDataQuantity>;

const equality = (a: SelectorReturn, b: SelectorReturn) => {
  return a.isUserDensity !== b.isUserDensity;
};

const DataQuantity: React.FC = () => {
  const { type, isUserDensity, formatedHoursFilterInput } = useAppSelector(selectDataQuantity, equality);
  const values = useGetDebouncedBoundsAndCenter();

  const {
    data: count,
    isLoading: heatmapCountLoading,
    isFetching: heatmapCountFetching,
  } = useFetchHeatmapCountQuery(
    {
      type,
      isUser: isUserDensity,
      bounds: values?.debouncedBounds as IMapBounds,
      periodFilter: formatedHoursFilterInput,
    },
    { skip: !values?.debouncedBounds || !formatedHoursFilterInput }
  );

  const isMobile = useMediaQuery('(max-width:768px)');
  const counterLabel = useMemo(
    () => (isUserDensity ? 'users' : 'actual incidents'),
    [isUserDensity]
  );

  const loader = heatmapCountLoading || heatmapCountFetching;
  return (
    <div className={cls(`${style.dataQuantity}`, isMobile && style.dataQuantityMobile)}>
      {loader ? (
        <CircularProgress
          style={{ width: '16px', height: '16px', color: '#4c4c4c', margin: '10px 0 4px' }}
        />
      ) : (
        <p>{`${count || 0} ${counterLabel}`}</p>
      )}
    </div>
  );
};

export default memo(DataQuantity);
