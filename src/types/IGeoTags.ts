export interface IGeoMarkers<T> {
  type: 'FeatureCollection';
  features: IGeoMarker<T>[];
}

export interface IGeoMarker<T> {
  type: 'Feature';
  properties: T;
  geometry: Geometry;
}

interface Geometry {
  coordinates: number[];
  type: 'Point';
}
