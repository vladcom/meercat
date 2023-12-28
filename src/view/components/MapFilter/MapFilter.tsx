import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Drawer } from '@mui/material';
import { useState } from 'react';
import FilterOptions from './FilterOptions';
import cls from 'classnames';
import css from './MapFilter.module.scss';

const MapFilter = () => {
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const handleOpen = () => setIsOpenFilter(true);

  const handleClose = () => setIsOpenFilter(false);

  return (
    <>
      <div className={css.filterButton} onClick={handleOpen} title='Map filter'>
        <FontAwesomeIcon icon={solid('filter')} />
      </div>
      <Drawer anchor='left' open={isOpenFilter} onClose={handleClose}>
        <FilterOptions handleClose={handleClose} />
      </Drawer>
    </>
  );
};

export default MapFilter;
