import { Text, View } from "react-native";

import { colors } from "@/constants/colors";
import type { Airport } from "@/data/types";
import type { LngLat } from "@/utils/great-circle";
import Mapbox from "@/utils/mapbox";

/** Two-tone blue "Jakarta | CGK" chip anchored to an airport on the globe. */
export function AirportChipMarker({ airport }: { airport: Airport }) {
  return (
    <Mapbox.MarkerView
      coordinate={airport.lngLat as LngLat}
      anchor={{ x: 0.5, y: 1.6 }}
      allowOverlap
    >
      <View
        style={{
          flexDirection: "row",
          borderRadius: 8,
          borderCurve: "continuous",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        <View
          style={{
            backgroundColor: colors.chipBlue,
            paddingHorizontal: 9,
            paddingVertical: 5,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>{airport.city}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#7FABF9",
            paddingHorizontal: 8,
            paddingVertical: 5,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
            {airport.iata || airport.icao}
          </Text>
        </View>
      </View>
    </Mapbox.MarkerView>
  );
}
