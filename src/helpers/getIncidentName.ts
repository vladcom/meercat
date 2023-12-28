import { IIncidentType } from '../redux/incident';

export const getIncidentName = ({
  obj,
  type,
}: {
  obj: IIncidentType[] | undefined;
  type: string | undefined;
}) => {
  if (obj && type) {
    const item = obj.find((i: { _id: string }) => {
      return i._id == type && i;
    });
    return item ? item.name : 'SHOOTING';
  } else {
    return 'SHOOTING';
  }
};
