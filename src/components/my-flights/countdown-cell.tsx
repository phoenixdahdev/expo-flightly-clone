import { Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import type { FlightPhase } from "@/data/types";
import { formatCountdown } from "@/utils/flight-time";

const CELL_WIDTH = 74;

export function CountdownCell({
  phase,
  msUntilDep,
}: {
  phase: FlightPhase;
  msUntilDep: number;
}) {
  if (phase === "inAir") {
    return (
      <View style={{ width: CELL_WIDTH, alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.fieldBackground,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SfSymbol name="airplane" size={18} tintColor={colors.label} />
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.6,
            color: colors.secondaryLabel,
          }}
        >
          IN AIR
        </Text>
      </View>
    );
  }

  if (phase === "landed" || phase === "arrived") {
    return (
      <View style={{ width: CELL_WIDTH, alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.fieldBackground,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SfSymbol name="checkmark" size={17} tintColor={colors.green} weight="semibold" />
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.6,
            color: colors.secondaryLabel,
          }}
        >
          ARRIVED
        </Text>
      </View>
    );
  }

  const { big, small } = formatCountdown(msUntilDep);
  return (
    <View style={{ width: CELL_WIDTH, alignItems: "center", gap: 2 }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: "700",
          color: colors.label,
          fontVariant: ["tabular-nums"],
          letterSpacing: -1,
        }}
      >
        {big}
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.4,
          color: colors.label,
        }}
      >
        {small}
      </Text>
    </View>
  );
}
