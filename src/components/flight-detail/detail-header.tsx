import { Text, View } from "react-native";

import { AirlineLogo } from "@/components/ui/airline-logo";
import { colors } from "@/constants/colors";
import { getAirport } from "@/data/airports";
import type { FlightTemplate } from "@/data/types";
import { formatShortDate } from "@/utils/flight-time";

export function DetailHeader({
  template,
  dateISO,
}: {
  template: FlightTemplate;
  dateISO: string;
}) {
  const origin = getAirport(template.from);
  const dest = getAirport(template.to);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 14,
        gap: 12,
      }}
    >
      <AirlineLogo iata={template.airlineIata} size={40} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            letterSpacing: 0.6,
            color: colors.secondaryLabel,
          }}
        >
          {template.airlineIata} {template.number} • {formatShortDate(dateISO)}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "800", color: colors.label }}>
          {origin.city} to {dest.city}
        </Text>
      </View>
    </View>
  );
}
