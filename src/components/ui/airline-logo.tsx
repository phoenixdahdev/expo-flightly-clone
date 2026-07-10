import { Text, View } from "react-native";

import { getAirline } from "@/data/airlines";

/**
 * Circular airline mark. We render a brand-colored monogram circle — original
 * artwork rather than copying carrier logos.
 */
export function AirlineLogo({ iata, size = 26 }: { iata: string; size?: number }) {
  const airline = getAirline(iata);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: airline.brandColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: size * 0.42,
          fontWeight: "800",
          letterSpacing: -0.5,
        }}
      >
        {airline.iata}
      </Text>
    </View>
  );
}
