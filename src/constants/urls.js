export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const API_URLS = {
  // URL FOR TEST
  LOCATIONS: '/incidents',
  CREATE_LOCATION: '/incident',
  DELETE_PLACE: '/delete-place',
};

export const USER_URLS = {
  USER: '/user',
  DELETE_USER: '/delete-user',
  PHONE_VERIFICATION: '/verification-phone',
  APPROVE_AUTH_BY_PHONE: '/approve-auth-by-phone',
  UPLOAD_PHOTO: '/upload',
  GET_IMG: '/getImage',
};
