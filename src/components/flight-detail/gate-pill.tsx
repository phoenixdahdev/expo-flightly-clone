import { Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";

/** Yellow gate pill: "--" when unknown, or "↘241". */
export function GatePill({
  gate,
  direction,
}: {
  gate: string | null | undefined;
  direction: "departure" | "arrival";
}) {
  return (
    <View
      style={{
        backgroundColor: colors.yellowPillBg,
        borderRadius: 12,
        borderCurve: "continuous",
        paddingHorizontal: 14,
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      {gate ? (
        <>
          <SfSymbol
            name={direction === "departure" ? "arrow.up.right" : "arrow.down.right"}
            size={15}
            tintColor={colors.label}
            weight="bold"
          />
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.label }}>{gate}</Text>
        </>
      ) : (
        <Text style={{ fontSize: 22, fontWeight: "800", color: colors.label }}>--</Text>
      )}
    </View>
  );
}
