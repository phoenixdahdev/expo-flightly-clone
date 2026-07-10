import { Pressable, Text, View } from "react-native";

import { AirlineLogo } from "@/components/ui/airline-logo";
import { Hairline } from "@/components/ui/hairline";
import { TimeBadge } from "@/components/ui/time-badge";
import { colors } from "@/constants/colors";
import { getAirport } from "@/data/airports";
import type { FlightTemplate } from "@/data/types";
import { formatLocalTime, getFlightTimes } from "@/utils/flight-time";
import { tapHaptic } from "@/utils/haptics";

export function FlightResultRow({
  template,
  dateISO,
  onPress,
}: {
  template: FlightTemplate;
  dateISO: string;
  onPress(): void;
}) {
  const origin = getAirport(template.from);
  const dest = getAirport(template.to);
  const times = getFlightTimes(template, dateISO);
  const hours = Math.round(template.durationMin / 60);

  return (
    <>
      <Pressable
        onPress={() => {
          tapHaptic();
          onPress();
        }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 18,
          paddingHorizontal: 8,
          gap: 8,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <View style={{ width: 74, alignItems: "center", gap: 2 }}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "700",
              color: colors.label,
              fontVariant: ["tabular-nums"],
              letterSpacing: -1,
            }}
          >
            {hours}
          </Text>
          <Text style={{ fontSize: 11, fontWeight: "600", letterSpacing: 0.4, color: colors.label }}>
            {hours === 1 ? "HOUR" : "HOURS"}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
              <AirlineLogo iata={template.airlineIata} size={24} />
              <Text style={{ fontSize: 15, color: colors.secondaryLabel, fontWeight: "500" }}>
                {template.airlineIata} {template.number}
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
              Departs <Text style={{ color: colors.green, fontWeight: "700" }}>On Time</Text>
            </Text>
          </View>
          <Text style={{ fontSize: 21, fontWeight: "700", color: colors.label }}>
            {origin.city}
            <Text style={{ fontWeight: "400" }}> to </Text>
            {dest.city}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <TimeBadge
              direction="departure"
              code={origin.iata}
              time={formatLocalTime(times.gateDep, origin.tzOffsetMinutes)}
            />
            <TimeBadge
              direction="arrival"
              code={dest.iata}
              time={formatLocalTime(times.gateArr, dest.tzOffsetMinutes)}
              dayOffset={template.arrDayOffset}
            />
          </View>
        </View>
      </Pressable>
      <Hairline inset={90} />
    </>
  );
}
