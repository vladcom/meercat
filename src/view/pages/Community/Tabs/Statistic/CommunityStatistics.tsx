import React, { useMemo } from "react";
import { useGetCommunityStatisticsQuery } from "../../../../../redux/community";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { LocationsList } from "../../../IncidentPage/LocationPage";
import moment from "moment/moment";
import useDebounce from "../../../../../hooks/useDebounce";

const CommunityStatisticsWeek: React.FC = () => {
  const { communityId: communityId = '' } = useParams<LocationsList>();
  const today = moment().valueOf();
  const debouncedToday = useDebounce(today, 1000000);
  const sevenDays = moment().subtract(7, 'days').valueOf();
  const debouncedSevenDays = useDebounce(sevenDays, 1000000);
  const { data, isLoading } = useGetCommunityStatisticsQuery({
    communityId,
    to: debouncedToday,
    from: debouncedSevenDays,
  }, {
    skip: !communityId
  });


  const renderData = useMemo(() => {
    if (data) {
      const { incidentsStats, postsStats } = data;
      const incAmount = incidentsStats?.reduce((acc: number, i: { totalIncidents: number; }) => acc + i.totalIncidents, 0);
      const postAmount = postsStats?.reduce((acc: number, i: { totalIncidents: number; }) => acc + i.totalIncidents, 0);
      return (
        <CardContent>
          <Typography align="center" variant="h5" color="text.secondary" gutterBottom>
            This week
          </Typography>
          <Typography variant="body1">
            {`${incAmount || 0} incidents`}
          </Typography>
          <Typography variant="body1">
            {`${postAmount || 0} posts`}
          </Typography>
        </CardContent>
      );
    }
  }, [data]);

  if (isLoading) {
    return (
      <CardContent>
        <CircularProgress />
      </CardContent>
    );
  }

  return (
    <Card variant="outlined" style={{ maxWidth: '280px' }}>
      {renderData}
    </Card>
  );
};

const CommunityStatisticsPrevWeek = () => {
  const { communityId: communityId = '' } = useParams<LocationsList>();
  const today = moment().subtract(8, 'days').valueOf();
  const debouncedToday = useDebounce(today, 1000000);
  const sevenDays = moment().subtract(15, 'days').valueOf();
  const debouncedSevenDays = useDebounce(sevenDays, 1000000);
  const { data, isLoading } = useGetCommunityStatisticsQuery({
    communityId,
    to: debouncedToday,
    from: debouncedSevenDays,
  }, {
    skip: !communityId
  });

  const renderData = useMemo(() => {
    if (data) {
      const { incidentsStats, postsStats } = data;
      const incAmount = incidentsStats?.reduce((acc: number, i: { totalIncidents: number; }) => acc + i.totalIncidents, 0);
      const postAmount = postsStats?.reduce((acc: number, i: { totalIncidents: number; }) => acc + i.totalIncidents, 0);
      return (
        <CardContent>
          <Typography align="center" variant="h5" color="text.secondary" gutterBottom>
            Last week
          </Typography>
          <Typography variant="body1">
            {`${incAmount || 0} incidents`}
          </Typography>
          <Typography variant="body1">
            {`${postAmount || 0} posts`}
          </Typography>
        </CardContent>
      );
    }
  }, [data]);

  if (isLoading) {
    return (
      <CardContent>
        <CircularProgress />
      </CardContent>
    );
  }

  return (
    <Card variant="outlined" style={{ maxWidth: '280px' }}>
      {renderData}
    </Card>
  );
};

const CommunityStatistics = () => (
  <div className="community-stats">
    <CommunityStatisticsWeek />
    <CommunityStatisticsPrevWeek />
  </div>
);

export default CommunityStatistics;
