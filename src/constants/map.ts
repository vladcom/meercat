export const ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION = 9;
export const ZOOM_FOR_INCIDENT_PREVIEW = 18;
export const isMarkerLayout = (zoom: number) => zoom >= ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION;
export const isHeatmapLayout = (zoom: number) => zoom < ZOOM_FOR_HEATMAP_TO_MARKER_TRANSITION + 1;
