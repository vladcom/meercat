import { IUser } from './IUser';

export type IIncident = {
  _id: string;
  imageUrl?: string;
  date?: string;
  type?: string;
  like?: number;
  state?: string;
  street?: string;
  country?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  external?: string;
  description?: string;
  userId?: string;
  user?: IUser;
  commentsCount?: number;
  votedArray?: string[];
  label?: string;
  willCreateAt?: number;
  createdAt?: number;
  previewLink?: object;
  source?: string;
  reporter?: string;
  allowComments?: boolean;
};
