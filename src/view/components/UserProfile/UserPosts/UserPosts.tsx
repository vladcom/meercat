import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Pagination } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import moment from 'moment';
import { memo, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from 'src/hooks/useRedux';
import { useGetMyProfileQuery } from 'src/redux/auth';
import { useGetIncidentTypesQuery, useGetMyIncidentsQuery } from 'src/redux/incident';
import { setMainModalState } from 'src/redux/modals';
import { IIncident } from '../../../../types/IIncident';
import { getIncidentIcon } from '../../../../helpers/getIncidentIcon';

const SkeletonLoader = memo(function SkeletonLoader() {
  return (
    <>
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
    </>
  );
});

type IUserPostItem = {
  item: IIncident;
  isLoadingItem: boolean;
  incidentTypes: IIncident[] | undefined;
};

const UserPostItem = ({ item, incidentTypes, isLoadingItem }: IUserPostItem) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { address, type, _id: id, createdAt } = item;
  const iconUrl = incidentTypes && type && getIncidentIcon({ obj: incidentTypes, id: type });

  if (isLoadingItem) {
    return (
      <Skeleton variant='rectangular' width='100%' height={100} style={{ marginBottom: '10px' }} />
    );
  }

  return (
    <div
      key={id}
      className='userProfile-places-myInc'
      onClick={() => {
        dispatch(setMainModalState({ isProfileWindowOpen: false }));
        history.push(`/${id}`);
      }}
    >
      <div>
        <img src={iconUrl} alt={String(createdAt)} />
      </div>
      <div className='userProfile-places-myInc-description'>
        <p className='userProfile-places-myInc-description-address'>{address}</p>
        <p className='userProfile-places-myInc-description-date'>{moment(createdAt).fromNow()}</p>
      </div>
      <NavigateNextIcon />
    </div>
  );
};

const UserPosts = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const { data: user } = useGetMyProfileQuery();
  const {
    data: userIncidents,
    isLoading,
    isFetching,
  } = useGetMyIncidentsQuery({ limit, offset: (page - 1) * limit }, { skip: !user?._id });
  const { data: incidentTypes, isLoading: isLoadingItem } = useGetIncidentTypesQuery(undefined);

  const renderItems = useMemo(() => {
    if (!userIncidents) {
      return <></>;
    }
    return userIncidents.data.map((item) => (
      <UserPostItem
        item={item}
        key={item._id}
        incidentTypes={incidentTypes}
        isLoadingItem={isLoadingItem}
      />
    ));
  }, [userIncidents, incidentTypes, history, dispatch]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderPagination = useMemo(() => {
    if (!userIncidents) {
      return <></>;
    }
    const { count } = userIncidents;
    if (count < 10) {
      return <></>;
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Pagination
          size='small'
          page={page}
          onChange={handleChange}
          count={Math.ceil(count / limit)}
        />
      </div>
    );
  }, [userIncidents, page, limit]);

  return (
    <div style={{ marginTop: '20px' }}>
      {(isFetching || isLoading) && <SkeletonLoader />}
      {!isFetching && !isLoading && renderItems}
      {renderPagination}
    </div>
  );
};

export default UserPosts;
