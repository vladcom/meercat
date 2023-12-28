import { Box, Skeleton } from '@mui/material';
import ReactHtmlParser from 'html-react-parser';
import moment from 'moment/moment';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetIncidentTypesQuery, useGetSpecificIncidentQuery } from 'src/redux/incident';
import { IIncident } from 'src/types/IIncident';
import { PickRename } from 'src/types/helpers';
import { LocationsList } from 'src/view/pages/IncidentPage/LocationPage';
import { formatIncidentName } from '../../../helpers/formatIncidentName';
import { getIncidentName } from '../../../helpers/getIncidentName';
import { isNull } from '../../../utils/isNull';
import { isUndefined } from '../../../utils/isUndefined';
import PreviewLink from '../PreviewLink/PreviewLink';
import './style.scss';
import { useNotificationContext } from "../NotificationsContext/NotificationsProvider";
import MarkerActions from "./MarkerActions";
import Mapbox from "../Mapbox/Mapbox";
import Messages from "../Messages/Messages";

const SkeletonImage: React.FC<Pick<IIncident, 'imageUrl'> & PickRename<IIncident, '_id', 'id'>> = ({
  id,
  imageUrl,
}) => {
  return (
    <div className='reportCard-container-box-image'>
      <img src={imageUrl} alt={id} />
    </div>
  );
};

const DescriptionPreview: React.FC<Required<Pick<IIncident, 'description'>>> = ({
  description,
}) => {
  const [isReadMore, setIsReadMore] = useState(false);
  const toggleReadMore = useCallback(() => setIsReadMore((prev) => !prev), []);

  const formatDescription = useMemo(
    () => ReactHtmlParser(isReadMore ? description : description.slice(0, 150)),
    [isReadMore, description]
  );

  if (description)
    return (
      <p className='reportCard-container-box-text'>
        {formatDescription}
        {!isNull(description) && !isUndefined(description) && description.length > 150 && (
          <span onClick={toggleReadMore} className='map-markerInfo-text-showMore'>
            {isReadMore ? ' show less' : ' ...read more'}
          </span>
        )}
      </p>
    );
  return <></>;
};

const ReportCard = ({ onClose }: { onClose: () => void }) => {
  const { openSnackbar } = useNotificationContext();
  const { incidentId = '' } = useParams<LocationsList>();
  const { data: incidentTypes } = useGetIncidentTypesQuery(undefined);
  const { data, isSuccess, isError, isLoading, isFetching } = useGetSpecificIncidentQuery(
    { incidentId },
    {
      skip: !incidentId,
    }
  );
  if (isLoading || isFetching)
    return (
      <Box sx={{ width: '100%', px: 3, marginRight: 0.5, my: 5 }}>
        <Skeleton variant='rectangular' width='100%' height={200} />{' '}
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width='60%' />
        </Box>
      </Box>
    );

  if (isError) {
    onClose();
    openSnackbar({
      open: true,
      status: 'warning',
      message: 'Sorry, we do not have this incident in our database.',
    });
  }

  if (isSuccess) {
    const { type, latitude, longitude, address, createdAt, willCreateAt, imageUrl, previewLink, source, description } =
      data?.incident;
    return (
      <div className='reportCard'>
        <div className='reportCard-container'>
          <div className='reportCard-container-box'>
            <div className='reportCard-header-title'>
              <Mapbox
                latitude={latitude}
                longitude={longitude}
                dragPan={false}
                zoom={18}
                style={{
                  width: '100%',
                  height: '20vh',
                }}
              />
              <div className='reportCard-header-title-header'>
                <p className='reportCard-header-title-text'>
                  {formatIncidentName(getIncidentName({ obj: incidentTypes, type }))}
                </p>
                <p className='reportCard-container-box-time'>{moment(createdAt).fromNow()}</p>
                {!isNull(willCreateAt) && (
                  <p className='reportCard-container-box-time'>{`Will publish ${moment(willCreateAt).format('LT ll')}`}</p>
                )}
              </div>
              <p className='reportCard-container-box-time'>{address || ''}</p>
            </div>
            <MarkerActions incidentId={incidentId} />
            {description && <DescriptionPreview description={description} />}
            {imageUrl && <SkeletonImage id={data.incident._id} imageUrl={imageUrl} />}
            <div>
              {!isUndefined(previewLink) || !isNull(previewLink) ? (
                <PreviewLink previewLink={previewLink} source={source} />
              ) : null}
            </div>
          </div>
          <Messages />
        </div>
      </div>
    );
  }
  return <></>;
};

export default memo(ReportCard);
