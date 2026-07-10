import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";

function Stat({
  label,
  icon,
  value,
}: {
  label: string;
  icon: Parameters<typeof SfSymbol>[0]["name"];
  value: string;
}) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <SfSymbol name={icon} size={17} tintColor={colors.label} />
        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.label }}>{value}</Text>
      </View>
    </View>
  );
}

export function RouteHistoryCard({ fromIata, toIata }: { fromIata: string; toIata: string }) {
  return (
    <SectionCard style={{ marginHorizontal: 16, gap: 14 }}>
      <View style={{ gap: 3 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: colors.label }}>
          My History on This Route
        </Text>
        <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
          {fromIata} → {toIata}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Stat label="Flights" icon="airplane" value="0" />
        <Stat label="Distance" icon="location" value="0 mi" />
        <Stat label="Flight Time" icon="clock" value="0m" />
      </View>
      <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
        No past flights on this route
      </Text>
    </SectionCard>
  );
}
