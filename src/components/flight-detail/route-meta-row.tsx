import { StyleSheet, Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import type { FlightTemplate } from "@/data/types";

export function RouteMetaRow({ template }: { template: FlightTemplate }) {
  const h = Math.floor(template.durationMin / 60);
  const m = template.durationMin % 60;
  const duration = m === 0 ? `${h}h` : `${h}h ${m}m`;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 6,
      }}
    >
      <SfSymbol name="clock" size={15} tintColor={colors.secondaryLabel} />
      <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
        {duration} • {template.distanceMi.toLocaleString()} mi •{" "}
      </Text>
      {template.overnight ? (
        <>
          <SfSymbol name="moon.fill" size={13} tintColor={colors.secondaryLabel} />
          <Text style={{ fontSize: 15, color: colors.secondaryLabel }}> Overnight </Text>
        </>
      ) : null}
      <View
        style={{
          flex: 1,
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.hairline,
        }}
      />
    </View>
  );
}
