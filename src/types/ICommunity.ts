export interface ICommunity {
  _id: string;
  name: string;
  address: string;
  creatorId: string;
  private: boolean;
  geometry: {
    type: string;
    coordinates: number[]
  };
  radius: number;
  createdAt: number;
  participants: string[];
  incidents: string[];
  invitedUsers: string[];
  posts: string[];
  requestedUsers: string[];
  updatedAt: string;
}

export interface ICommunityUser {
  _id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  email: string;
}

export interface ICommunityUserList {
  _id?: string;
  name?: string;
  allUsers?: ICommunityUser[];
}

export interface IIncidentsCounts {
  ids: string[];
  count: number;
  type: string;
}
export interface IIncidentsStats {
  _id?: string;
  year: number;
  week: number;
  totalIncidents: number;
  arrayItems: IIncidentsCounts[];
}

export interface IPostsStats {
  _id?: string;
  totalIncidents: number;
}
