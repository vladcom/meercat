import { IIncidentType } from "../redux/incident";
import Logo from '../static/img/caution.svg';

export const getIncidentIcon = ({ obj, id }: { obj: IIncidentType[] | undefined | any, id: string | undefined | any}) => {
  if (obj && id) {
    const item = obj.find((i: { _id: string; }) => {
      return i._id == id && i;
    });
    return item ? item.icon : Logo;
  } else {
    return Logo;
  }
};
