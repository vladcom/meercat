import { createSelector } from '@reduxjs/toolkit';
import { memo } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import { selectDashboard } from 'src/redux/dashboard';
import DataQuantity from '../../DataQuantity/DataQuantity';
import MapFilter from '../../MapFilter/MapFilter';
import SearchBox from '../SearchBox/SearchBox';

const selectMapboxZoom = createSelector(selectDashboard, (state) => state.mapZoom);

const ZoomCounter = memo(function ZoomCounter() {
  const zoom = useAppSelector(selectMapboxZoom);
  return (
    <div className='devMode'>
      <span>{`zoom: ${Math.ceil(zoom)}`}</span>
    </div>
  );
});

function MapboxBottomContent() {
  return (
    <>
      <span className='watermark'>Meercat</span>
      <MapFilter />
      <SearchBox />
      <DataQuantity />
      <ZoomCounter />
    </>
  );
}

export default memo(MapboxBottomContent);
