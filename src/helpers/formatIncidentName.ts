import toCapitalizeString from '../utils/toCapitalizeString';

export const formatIncidentName = (name: string) =>
  name && toCapitalizeString(name.toLowerCase()).replace('_', ' ');
