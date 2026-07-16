import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { CountdownCell } from "@/components/my-flights/countdown-cell";
import { AirlineLogo } from "@/components/ui/airline-logo";
import { Hairline } from "@/components/ui/hairline";
import { TimeBadge } from "@/components/ui/time-badge";
import { colors } from "@/constants/colors";
import { getAirport } from "@/data/airports";
import type { TrackedFlight } from "@/data/types";
import { getTemplate } from "@/data/flight-templates";
import { useNow } from "@/hooks/use-now";
import {
  formatLocalTime,
  getFlightPhase,
  getFlightTimes,
  getStatusParts,
} from "@/utils/flight-time";
import { tapHaptic } from "@/utils/haptics";

export function FlightCard({ flight }: { flight: TrackedFlight }) {
  const now = useNow();
  const template = getTemplate(flight.templateId);
  const times = getFlightTimes(template, flight.dateISO);
  const phase = getFlightPhase(times, now);
  const status = getStatusParts(template, times, now);
  const origin = getAirport(template.from);
  const dest = getAirport(template.to);

  const statusColor =
    status.color === "green"
      ? colors.green
      : status.color === "red"
        ? colors.red
        : colors.secondaryLabel;

  return (
    <Animated.View entering={FadeInDown.duration(350)}>
      <Pressable
        onPress={() => {
          tapHaptic();
          router.push(`/flight/${encodeURIComponent(flight.key)}`);
        }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 18,
          paddingHorizontal: 8,
          gap: 8,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <CountdownCell phase={phase} msUntilDep={times.gateDep - now} />
        <View style={{ flex: 1, gap: 5 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
              <AirlineLogo iata={template.airlineIata} size={24} />
              <Text style={{ fontSize: 15, color: colors.secondaryLabel, fontWeight: "500" }}>
                {template.airlineIata} {template.number}
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
              {status.prefix}
              <Text style={{ color: statusColor, fontWeight: "700" }}>{status.emphasis}</Text>
            </Text>
          </View>
          <Text
            style={{ fontFamily: "ui-rounded", fontSize: 21, fontWeight: "700", color: colors.label }}
          >
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
    </Animated.View>
  );
}
