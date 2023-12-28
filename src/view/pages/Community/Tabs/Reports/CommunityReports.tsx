import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DateRangePicker } from "rsuite";
import { Button, Card, CardContent, Divider, Typography } from "@mui/material";
import { getReportData, useGenerateReportMutation } from "../../../../../redux/community";
import { useParams } from "react-router-dom";
import { LocationsList } from "../../../IncidentPage/LocationPage";
import { isNull } from "../../../../../utils/isNull";
import 'rsuite/dist/rsuite.min.css';
import { useAppDispatch, useAppSelector } from "../../../../../hooks/useRedux";
import { setReportData } from "../../../../../redux/community/reducer";
import { IIncidentType, useGetIncidentTypesQuery } from "../../../../../redux/incident";
import { formatIncidentName } from "../../../../../helpers/formatIncidentName";
import { camelToSnake } from "../../../../../utils/camelToSnake";
import moment from "moment";
const { afterToday} = DateRangePicker;

const reportButtons = [
  {
    id: 1,
    from: moment().subtract(7, 'days').valueOf(),
    to: moment().valueOf(),
  },
  {
    id: 2,
    from: moment().subtract(14, 'days').valueOf(),
    to: moment().subtract(7, 'days').valueOf(),
  },
  {
    id: 3,
    from: moment().subtract(21, 'days').valueOf(),
    to: moment().subtract(15, 'days').valueOf(),
  },
  {
    id: 4,
    from: moment().subtract(28, 'days').valueOf(),
    to: moment().subtract(21, 'days').valueOf(),
  },
  {
    id: 5,
    from: moment().subtract(35, 'days').valueOf(),
    to: moment().subtract(28, 'days').valueOf(),
  },
  {
    id: 6,
    from: moment().subtract(42, 'days').valueOf(),
    to: moment().subtract(35, 'days').valueOf(),
  },
];

const CommunityReports = () => {
  const dispatch = useAppDispatch();
  const { communityId: communityId = '' } = useParams<LocationsList>();
  const [date, setDate] = useState<[Date, Date]>([
    new Date(),
    new Date()
  ]);
  const [getStatistic, response] = useGenerateReportMutation();
  const { data: types } = useGetIncidentTypesQuery(undefined);
  const report = useAppSelector(getReportData);

  useEffect(() => {
    if (response.data) {
      dispatch(setReportData({ report: response.data }));
    }

    return void 0;
  }, [response, dispatch]);

  const onClickGenerate = () => {
    if(date.length) {
      getStatistic({
        communityId,
        to:  new Date(date[1]).valueOf(),
        from: new Date(date[0]).valueOf(),
      });
    }
  };

  const onChangePicker = (e: any) => {
    if (!isNull(e[0]) && !isNull(e[1])) {
      setDate(e);
    }
  };
  const onClickRenderedButtons = ({ from, to }: { from: number, to: number }) => getStatistic({ communityId, from, to, });

  const renderHeader = useMemo(() => (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {reportButtons.map((i) => (
          <Button key={i.id} variant="text" onClick={() => onClickRenderedButtons({ from: i.from, to: i.to })}>
            {moment(i.from).format('MMM DD, YYYY')}
          </Button>
        ))}
      </div>
      <Divider>Or</Divider>
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <DateRangePicker
          value={date}
          character=" - "
          limitEndYear={1}
          format="MM-dd-yyyy"
          onChange={onChangePicker}
          shouldDisableDate={afterToday && afterToday()}
        />
        <Button size={'small'} variant="contained" onClick={onClickGenerate}>Generate report</Button>
      </div>
    </div>
  ), [date, onChangePicker, onClickRenderedButtons, afterToday, onClickGenerate]);

  // @ts-ignore
  const getAmountByType = useCallback((type: string) => {
    if (report) {
      const { incidentsStats } = report;
      return !incidentsStats ? 0 : incidentsStats?.reduce((accumulator, innerArray) => {
        return accumulator + innerArray?.arrayItems?.reduce((innerAccumulator, currentValue) => {
          return innerAccumulator + (currentValue.type === type ? currentValue?.count : 0);
        }, 0);
      }, 0);
    }
    return 0;
  }, [report]);

  const renderReportItem = useMemo(() => {
    if (types) {
      return types.map((i: IIncidentType) => (
        <Card variant="outlined" style={{ width: '280px', marginBottom: 20 }}>
          <CardContent>
            <Typography variant="body1" align="center">
              {formatIncidentName(camelToSnake(i.name))}
            </Typography>
            <Typography align="center" variant="h4" color="text.secondary" gutterBottom>
              {getAmountByType(i.name)}
            </Typography>
          </CardContent>
        </Card>
      ));
    }
  }, [types, getAmountByType]);

  const renderReport = useMemo(() => {
    if (report) {
      const { incidentsStats, postsStats } = report;

      if (!incidentsStats?.length && !postsStats?.length) {
        return (
          <p style={{ textAlign: "center", marginTop: '50px' }}>
            No data for reports by this period.
          </p>
        );
      }
      const incAmount = incidentsStats?.reduce((acc: number, i: { totalIncidents: number; }) => acc + i.totalIncidents, 0);
      const postAmount = postsStats?.reduce((acc: number, i: { totalIncidents: number; }) => acc + i.totalIncidents, 0);

      return (
        <>
          <div style={{ display: "flex", marginTop: '50px', marginBottom: 20, flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Card variant="outlined" style={{ width: '280px' }}>
              <CardContent>
                <Typography variant="body1" align="center">
                  Reports
                </Typography>
                <Typography align="center" variant="h4" color="text.secondary" gutterBottom>
                  {`${incAmount || 0}`}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" style={{ width: '280px' }}>
              <CardContent>
                <Typography variant="body1" align="center">
                  Posts
                </Typography>
                <Typography align="center" variant="h4" color="text.secondary" gutterBottom>
                  {`${postAmount || 0}`}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {renderReportItem}
          </div>
        </>
      );
    }
    return <></>;
  }, [report, getAmountByType, renderReportItem]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: 'row', marginTop: '50px', justifyContent: 'center', maxWidth: '1366px', flexWrap: 'wrap' }}>
        <Typography align="center" variant="h5" color="text.secondary" gutterBottom>
          Weekly reports
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '50px auto', maxWidth: '950px'}}>
        {renderHeader}
        {renderReport}
      </div>
    </div>
  );
};

export default CommunityReports;
