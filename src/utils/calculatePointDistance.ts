import { IMapCenter } from 'src/redux/dashboard/reducer';

export const isRadiusFeatureEnabled = () => !!import.meta.env.VITE_APP_RADIUS_FOR_CREATING_INCIDENT;

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
// This function calculates the distance between two points on the Earth's surface.
// The distance can be calculated in either kilometers or meters based on the 'unit' parameter.
// The function takes two parameters: point1 and point2, which are objects of type IMapCenter.
// The IMapCenter type represents a geographical point on a map with 'lat' and 'lng' properties.

export function calculateDistance(point1: IMapCenter, point2: IMapCenter, unit: 'km' | 'm') {
  // Set the radius of the Earth based on the 'unit' parameter.
  // If 'unit' is 'km', the radius is set to 6371 kilometers.
  // If 'unit' is 'm', the radius is set to 6371000 meters.
  const R = unit === 'km' ? 6371 : 6371000;

  // Calculate the difference in latitude and convert it to radians.
  const dLat = deg2rad(point2.lat - point1.lat);

  // Calculate the difference in longitude and convert it to radians.
  const dLon = deg2rad(point2.lng - point1.lng);

  // Calculate the intermediate result 'a' using the Haversine formula.
  // 'a' is used to calculate the central angle between the two points.
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) *
      Math.cos(deg2rad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  // Calculate the central angle 'c' using the inverse tangent function and 'a'.
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance between the two points by multiplying the radius by 'c'.
  const distance = R * c;

  // Return the calculated distance.
  return distance;
}
