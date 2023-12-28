import { IIncidentType } from "../redux/incident";

export enum EIncidentType {
  SHOOTING = 1, //type of downloaded incidents from GVA
  VIOLENCE = 2,
  THEFT = 3,
  ACCIDENT = 4,
  INJURED = 5,
  HOMELESS = 6,
  CHILD_RELATED = 7,
  LOST_ADULT = 8,
  LOST_PET = 9,
  DISTURBANCE = 10,
  INAPPROPRIATE = 11,
  PROTEST = 12,
  FIRE = 13,
  FLOODING = 14,
  OTHER = 15,
}

export enum EUserProfilePreview {
  PREVIEW = 'preview',
  USEREDIT = 'userEdit',
  PLACEINFO = 'placeInfo',
  PLACEPARAMS = 'placeParams',
}

export interface IPlaces {
  _id: string;
  label: string;
  address: string;
  longitude: number;
  latitude: number;
  radius: number;
  allowComments: boolean;
  type?: IIncidentType;
  types?: string[];
  city?: string;
  state?: string;
  country?: string;
  district?: string;
  stateCode?: string;
  stateName?: string;
  postalCode?: string;
  crossStreet?: string;
  customAddress?: string;
}
export type EditablePlace = Required<
  Pick<IPlaces, 'label' | 'radius' | 'address' | 'latitude' | 'longitude' | 'types'>
> &
  Partial<Pick<IPlaces, '_id'>>;
