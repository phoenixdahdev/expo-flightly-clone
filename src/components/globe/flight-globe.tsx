import { memo, RefObject } from "react";
import { Text, View } from "react-native";

import { MapControls } from "@/components/globe/map-controls";
import { RouteArcs } from "@/components/globe/route-arcs";
import { ATMOSPHERE_STYLE, MAP_STYLES } from "@/constants/map-styles";
import { useUiStore } from "@/stores/ui-store";
import Mapbox, { MAPBOX_TOKEN_PRESENT } from "@/utils/mapbox";

function TokenMissingBanner() {
  if (MAPBOX_TOKEN_PRESENT) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 64,
        left: 16,
        right: 16,
        backgroundColor: "#B3261E",
        borderRadius: 12,
        borderCurve: "continuous",
        padding: 12,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>
        Mapbox token missing — the map can't load tiles. Add
        EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN to .env and restart Metro.
      </Text>
    </View>
  );
}

export const FlightGlobe = memo(function FlightGlobe({
  cameraRef,
  children,
  extraControls,
}: {
  cameraRef?: RefObject<Mapbox.Camera | null>;
  children?: React.ReactNode;
  extraControls?: boolean;
}) {
  const mapStyle = useUiStore((s) => s.mapStyle);

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={MAP_STYLES[mapStyle]}
        projection="globe"
        compassEnabled={false}
        scaleBarEnabled={false}
        pitchEnabled={false}
        logoEnabled
        attributionEnabled
        attributionPosition={{ bottom: 8, left: 96 }}
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{ centerCoordinate: [110, 5], zoomLevel: 1.8 }}
        />
        <Mapbox.Atmosphere style={ATMOSPHERE_STYLE} />
        <RouteArcs />
        {children}
      </Mapbox.MapView>
      <MapControls extraControls={extraControls} />
      <TokenMissingBanner />
    </View>
  );
});
