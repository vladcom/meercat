import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { CircularProgress } from '@mui/material';
import React, { memo } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import css from './CategorySelection.module.scss';
import { IIncidentType, useGetIncidentTypesQuery } from "../../../redux/incident";
import { formatIncidentName } from "../../../helpers/formatIncidentName";
import { camelToSnake } from "../../../utils/camelToSnake";

const CategoryItem = ({ item }: { item: IIncidentType }) => {
  const { url } = useRouteMatch();
  const { _id: id, name, icon } = item;

  return (
    <NavLink to={`${url}/${id}`} className='reportWindow-category-container-item'>
      <img src={icon} alt={id} style={{ width: '70px', height: '70px'}} />
      <span>{formatIncidentName(camelToSnake(name))}</span>
    </NavLink>
  );
};

const CategoryList = (): any => {
  const { data: types, isLoading } = useGetIncidentTypesQuery(undefined);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (types) {
    return types.map((item) => <CategoryItem item={item} key={item._id} />);
  }

  return <></>;
};

const CategorySelection: React.FC = () => (
  <div className={`reportWindow-category ${css.reportWindow}`}>
    <div className='reportWindow-category-header'>
      <NavLink to='/'>
        <ArrowBackIosNewIcon className="closeButtonWindow" />
      </NavLink>
      <div className='reportWindow-category-header-text'>
        <p>Pick incident category</p>
      </div>
    </div>
    <div className='reportWindow-category-container'>
      <CategoryList />
    </div>
  </div>
);

export default memo(CategorySelection);
