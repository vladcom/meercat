import { isUndefined } from './isUndefined';

const toCapitalizeString = (str: string) =>
  !isUndefined(str) ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export default toCapitalizeString;
