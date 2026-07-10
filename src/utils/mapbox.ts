import Mapbox from "@rnmapbox/maps";

export const MAPBOX_TOKEN_PRESENT = Boolean(
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
);

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? null);
Mapbox.setTelemetryEnabled(false);

export default Mapbox;
