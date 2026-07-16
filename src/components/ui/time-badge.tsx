import { Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";

interface TimeBadgeProps {
  direction: "departure" | "arrival";
  code: string;
  time: string;
  dayOffset?: number;
  size?: number;
}

/** Green circle arrow + "CGK 9:50 PM" (+1 superscript) row segment. */
export function TimeBadge({ direction, code, time, dayOffset, size = 15 }: TimeBadgeProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.green,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SfSymbol
          name={direction === "departure" ? "arrow.up.right" : "arrow.down.right"}
          size={size * 0.5}
          tintColor="#FFFFFF"
          weight="bold"
        />
      </View>
      <Text style={{ fontSize: size, fontWeight: "600", color: colors.green }}>
        {code} <Text style={{ fontVariant: ["tabular-nums"] }}>{time}</Text>
        {dayOffset ? (
          <Text style={{ fontSize: size * 0.68, color: colors.green }}> +{dayOffset}</Text>
        ) : null}
      </Text>
    </View>
  );
}
