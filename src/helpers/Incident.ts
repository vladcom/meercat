import { AppDispatch } from 'src/redux';
import { GeoMarkerIncident } from 'src/redux/incident';
import { placeOldIncidentInStorage } from 'src/redux/incident/reducer';
import { IGeoMarker } from 'src/types/IGeoTags';
import { IIncident } from 'src/types/IIncident';
import moment from 'moment';
import { frmHoursToTimestamp } from './hoursToTimestamp';

type BaseIncidentArgs = {
  dispatch: AppDispatch;
};

type OpenArgs = BaseIncidentArgs & {
  incident: IIncident;
  geoJSON: IGeoMarker<GeoMarkerIncident>;
  hoursFilterInput: string;
};
type CloseArgs = BaseIncidentArgs;

export const Incident = {
  open(args: OpenArgs) {
    console.log('open');
    const createdAt = args?.incident?.createdAt;
    const creationDate = moment(createdAt);
    const timeStampData = moment(frmHoursToTimestamp(args.hoursFilterInput));
    if (creationDate.isBefore(timeStampData)) {
      args.dispatch(placeOldIncidentInStorage(args.geoJSON));
      return true;
    }
    return false;
  },
  close(args: CloseArgs) {
    args.dispatch(placeOldIncidentInStorage(undefined));
    return true;
  },
};
export const LowTileSourceId = 'low_level_tiles';
