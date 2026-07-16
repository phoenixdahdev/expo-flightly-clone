import { Image, Text, View, type ImageSourcePropType } from "react-native";

import { getAirline } from "@/data/airlines";

const LOGOS: Record<string, ImageSourcePropType> = {
  AC: require("../../../assets/images/airline-logos/ac-logo.png"),
};

/**
 * Circular airline mark. Airlines with real logo art in assets/images/airline-logos
 * render it; the rest get a brand-colored monogram circle.
 */
export function AirlineLogo({ iata, size = 26 }: { iata: string; size?: number }) {
  const airline = getAirline(iata);
  const logo = LOGOS[airline.iata];

  if (logo) {
    return (
      <Image
        source={logo}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }

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
