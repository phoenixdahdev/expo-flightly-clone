import { Pressable, Text, View } from "react-native";

import { AirlineLogo } from "@/components/ui/airline-logo";
import { colors } from "@/constants/colors";
import type { Airline } from "@/data/types";
import { selectionHaptic } from "@/utils/haptics";

export function AirlineRow({ airline, onPress }: { airline: Airline; onPress?: () => void }) {
  return (
    <Pressable
      onPress={() => {
        selectionHaptic();
        onPress?.();
      }}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 13,
        gap: 14,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <AirlineLogo iata={airline.iata} size={32} />
      <View style={{ gap: 2 }}>
        <Text style={{ fontSize: 19, fontWeight: "600", color: colors.label }}>
          {airline.name}
        </Text>
        <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
          {airline.iata} • {airline.icao}
        </Text>
      </View>
    </Pressable>
  );
}
