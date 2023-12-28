import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { createSelector } from '@reduxjs/toolkit';
import React, { memo, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { selectDashboard } from 'src/redux/dashboard';
import { setHoursFilter, setIsUserDensity, setType } from 'src/redux/dashboard/reducer';

import { shallowEqual } from 'react-redux';
import CategoryListWrapper from './CategorySelector';
import css from './FilterOptions.module.scss';

const selectFilterOptions = createSelector(selectDashboard, (state) => ({
  type: state.type,
  isUserDensity: state.isUserDensity,
  hoursFilterInput: state.hoursFilterInput,
}));

type IDateRangeProps = {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  isUserDensity: boolean;
};
const DateRange: React.FC<IDateRangeProps> = memo(function DateRange({
  setTime,
  time,
  isUserDensity,
}: IDateRangeProps) {
  return (
    <div>
      <p className={css['filterOptions-container-title']}>Date Range:</p>
      <div className={css['filterOptions-container-categories']}>
        <button onClick={() => setTime('24')} disabled={isUserDensity}>
          Last 24 hours
          {time === '24' ? (
            <div className={css['filterOptions-check']}>
              <FontAwesomeIcon icon={solid('check')} />
            </div>
          ) : null}
        </button>
        <button onClick={() => setTime('48')} disabled={isUserDensity}>
          Last 2 days
          {time === '48' ? (
            <div className={css['filterOptions-check']}>
              <FontAwesomeIcon icon={solid('check')} />
            </div>
          ) : null}
        </button>
        <button onClick={() => setTime('72')} disabled={isUserDensity}>
          Last 3 days
          {time === '72' ? (
            <div className={css['filterOptions-check']}>
              <FontAwesomeIcon icon={solid('check')} />
            </div>
          ) : null}
        </button>
        <button onClick={() => setTime('168')} disabled={isUserDensity}>
          Last 7 days
          {time === '168' ? (
            <div className={css['filterOptions-check']}>
              <FontAwesomeIcon icon={solid('check')} />
            </div>
          ) : null}
        </button>
        <button onClick={() => setTime('744')} disabled={isUserDensity}>
          Last month
          {time === '744' ? (
            <div className={css['filterOptions-check']}>
              <FontAwesomeIcon icon={solid('check')} />
            </div>
          ) : null}
        </button>
        <button onClick={() => setTime('all')} disabled={isUserDensity}>
          All time
          {time === 'all' ? (
            <div className={css['filterOptions-check']}>
              <FontAwesomeIcon icon={solid('check')} />
            </div>
          ) : null}
        </button>
      </div>
    </div>
  );
});

type IHeatMapSetingsProps = {
  uDensity: boolean;
  setUDensity: React.Dispatch<React.SetStateAction<boolean>>;
};
const HeatMapSettings: React.FC<IHeatMapSetingsProps> = memo(function HeatmapSettings({
  uDensity,
  setUDensity,
}: IHeatMapSetingsProps) {
  return (
    <div>
      <p className={css['filterOptions-container-title']}>Heat Map at higher zoom:</p>
      <div>
        <button className={css['filterOptions-density-button']} onClick={() => setUDensity(false)}>
          <div className={css['filterOptions-density']}>
            <p className={css['filterOptions-density-title']}>Incident Density</p>
            <span className={css['filterOptions-density-description']}>
              (using no of incidents)
            </span>
          </div>
          {!uDensity ? (
            <div className={css['filterOptions-check']}>
              <FontAwesomeIcon icon={solid('check')} />
            </div>
          ) : null}
        </button>
        <button onClick={() => setUDensity(true)} className={css['filterOptions-density-button']}>
          <div className={css['filterOptions-density']}>
            <p className={css['filterOptions-density-title']}>User Density</p>
            <span className={css['filterOptions-density-description']}>
              (using last user locations for each user)
            </span>
          </div>
          {uDensity ? (
            <div className={css['filterOptions-check']}>
              <FontAwesomeIcon icon={solid('check')} />
            </div>
          ) : null}
        </button>
      </div>
    </div>
  );
});

const FilterOptions: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const dispatch = useAppDispatch();
  const { type, isUserDensity, hoursFilterInput } = useAppSelector(
    selectFilterOptions,
    shallowEqual
  );

  const [time, setTime] = useState(hoursFilterInput);
  const [uDensity, setUDensity] = useState(isUserDensity);
  const [category, setCategory] = useState(() => new Set(type));

  const onClickApply = useCallback(() => {
    dispatch(setType([...category]));
    dispatch(setHoursFilter(time));
    dispatch(setIsUserDensity(uDensity));
    handleClose();
  }, [time, dispatch, uDensity, category, handleClose]);

  return (
    <div className={css.filterOptions}>
      <div className={css['filterOptions-header']}>
        <button className={css['filterOptions-header-button']} onClick={handleClose}>
          <FontAwesomeIcon icon={solid('arrow-left')} />
        </button>
        <p>Filter</p>
        <Button onClick={onClickApply} variant='contained'>
          Apply
        </Button>
      </div>
      <div className={css['filterOptions-container']}>
        <DateRange time={time} setTime={setTime} isUserDensity={uDensity} />
        <HeatMapSettings uDensity={uDensity} setUDensity={setUDensity} />

        <CategoryListWrapper
          selectedCategory={category}
          setCategory={setCategory}
          isUserDensity={uDensity}
        />
      </div>
    </div>
  );
};

export default memo(FilterOptions);
