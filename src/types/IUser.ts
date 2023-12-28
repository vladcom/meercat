export enum ERole {
  USER = 'User',
  UNAUTHORIZED = 'Unauthorized',
}
export enum EAuthorizedRole {
  USER = 'User',
}
export interface IUser {
  _id: string;
  name?: string;
  phone?: string;
  code?: string;
  email?: string;
  avatar?: string;
  timeZone?: string;
  latitude?: number;
  longitude?: number;
  tokens?: string[];
  notificationsBy?: string[];
}
