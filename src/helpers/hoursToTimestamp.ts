import moment from 'moment';
import debounce from 'lodash/debounce';

export const frmHoursToTimestamp = (hour: string) => {
  switch (hour) {
    case '24':
      return moment().subtract(1, 'days').valueOf();
    case '48':
      return moment().subtract(2, 'days').valueOf();
    case '72':
      return moment().subtract(3, 'days').valueOf();
    case '120':
      return moment().subtract(5, 'days').valueOf();
    case '168':
      return moment().subtract(7, 'days').valueOf();
    case '744':
      return moment().subtract(31, 'days').valueOf();
    case 'all':
      return moment().subtract(1, 'years').valueOf();
    case 'day':
      return moment().add(1, 'days').valueOf();
    case 'week':
      return moment().add(1, 'week').valueOf();
    case 'month':
      return moment().add(1, 'month').valueOf();
    default:
      return moment().subtract(1, 'days').valueOf();
  }
};

export const formatHoursToTimestamp = debounce(frmHoursToTimestamp, 1000);
