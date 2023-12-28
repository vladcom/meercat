import { IGeoMarker, IGeoMarkers } from 'src/types/IGeoTags';

type ICreateFeature<T> = { properties: T; cords?: { longitude: number; latitude: number } };

export const GeoJSONFabric = {
  createFeature<T>(params: ICreateFeature<T>): IGeoMarker<T> {
    return {
      type: 'Feature',
      properties: params.properties,
      geometry: {
        type: 'Point',
        coordinates: params.cords ? [params.cords.longitude, params.cords.latitude] : [],
      },
    };
  },
  createFeatureCollection<T>(params: IGeoMarker<T>[]): IGeoMarkers<T> {
    return { features: params, type: 'FeatureCollection' };
  },
};
