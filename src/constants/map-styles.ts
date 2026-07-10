export const MAP_STYLES = {
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  standard: "mapbox://styles/mapbox/streets-v12",
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;

// Space/star look matching Flighty's globe-from-orbit aesthetic.
export const ATMOSPHERE_STYLE = {
  spaceColor: "#000000",
  starIntensity: 0.85,
  horizonBlend: 0.02,
  color: "#dbe7f5",
  highColor: "#2a4a8a",
} as const;

export const ARC_CASING_STYLE = {
  lineColor: "#FFFFFF",
  lineWidth: 7,
  lineOpacity: 0.9,
  lineCap: "round",
  lineJoin: "round",
} as const;

export const ARC_LINE_STYLE = {
  lineColor: [
    "match",
    ["get", "segment"],
    "flown",
    "#1D5FD6",
    "#6EA8FF",
  ] as unknown as string,
  lineWidth: 4.5,
  lineCap: "round",
  lineJoin: "round",
} as const;

export const ENDPOINT_CIRCLE_STYLE = {
  circleRadius: 5,
  circleColor: "#4F8EF7",
  circleStrokeColor: "#FFFFFF",
  circleStrokeWidth: 2,
} as const;

export const INBOUND_DASH_STYLE = {
  lineColor: "#D8D8DC",
  lineWidth: 3,
  lineDasharray: [0.8, 1.6] as unknown as number[],
  lineCap: "round",
} as const;
