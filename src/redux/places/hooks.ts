import { useGetMyProfileQuery } from '../auth';
import { useGetMyPlacesQuery, useEditPlaceMutation } from './api';

export function usePlaces() {
  const { data: user } = useGetMyProfileQuery();
  const { data: userPlaces = [] } = useGetMyPlacesQuery(undefined, { skip: !user?._id });
  const [editPlace] = useEditPlaceMutation();
  return { userPlaces, editPlace };
}
