import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import type { FlightTemplate } from "@/data/types";
import {
  formatDurationShort,
  formatLocalTime,
  getFlightPhase,
  getFlightTimes,
} from "@/utils/flight-time";

function Dot({ filled }: { filled: boolean }) {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: filled ? "#5B5B60" : "transparent",
        borderWidth: filled ? 0 : 2,
        borderColor: "#C7C7CC",
      }}
    />
  );
}

interface LegRowProps {
  title: string;
  subtitle: string;
  delta: string;
  deltaColor: string;
}

function LegRow({ title, subtitle, delta, deltaColor }: LegRowProps) {
  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
      <View style={{ flex: 1, gap: 1 }}>
        <Text style={{ fontSize: 17, fontWeight: "700", color: colors.label }}>{title}</Text>
        <Text style={{ fontSize: 14, color: colors.secondaryLabel }}>{subtitle}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: "700", color: deltaColor }}>{delta}</Text>
    </View>
  );
}

/**
 * "This Flight" card — where the aircraft is coming from: this flight's origin
 * at top, then each inbound leg walking backward in time.
 */
export function InboundTimelineCard({
  template,
  dateISO,
  now,
}: {
  template: FlightTemplate;
  dateISO: string;
  now: number;
}) {
  if (!template.inboundChain?.length) return null;

  const legs = template.inboundChain.map(({ templateId, deltaMin }) => {
    const legTemplate = getTemplate(templateId);
    const legTimes = getFlightTimes(legTemplate, dateISO);
    const legPhase = getFlightPhase(legTimes, now);
    const from = getAirport(legTemplate.from);
    const to = getAirport(legTemplate.to);
    const title = `${from.city} to ${to.city}`;
    const subtitle =
      legPhase === "inAir"
        ? `Landing in ${formatDurationShort(legTimes.land - now)}`
        : legPhase === "scheduled"
          ? `Departs ${formatLocalTime(legTimes.gateDep, from.tzOffsetMinutes)}`
          : `Arrived ${formatLocalTime(legTimes.gateArr + deltaMin * 60_000, to.tzOffsetMinutes)}`;
    const delta =
      deltaMin === 0 ? "On Time" : deltaMin < 0 ? `${-deltaMin}m Early` : `${deltaMin}m Late`;
    const deltaColor = deltaMin <= 0 ? colors.green : colors.red;
    return { key: templateId, legTemplate, title, subtitle, delta, deltaColor, legPhase };
  });

  return (
    <SectionCard style={{ marginHorizontal: 16, padding: 0, overflow: "hidden" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#F7F7FA",
          paddingHorizontal: 18,
          paddingVertical: 13,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <SfSymbol name="arrow.up.right" size={15} tintColor={colors.secondaryLabel} />
          <Text style={{ fontSize: 17, fontWeight: "700", color: colors.label }}>This Flight</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: "700", color: colors.green }}>On Time</Text>
      </View>

      <View style={{ paddingHorizontal: 18, paddingVertical: 14, gap: 0 }}>
        {/* This flight's origin */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 14, alignItems: "center" }}>
            <Dot filled={false} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.secondaryLabel }}>
            {getAirport(template.from).iata}
          </Text>
        </View>

        {legs.map((leg) => (
          <View key={leg.key}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ width: 14, alignItems: "center" }}>
                <View style={{ flex: 1, width: 3, backgroundColor: "#5B5B60" }} />
                {leg.legPhase === "inAir" && (
                  <View style={{ position: "absolute", top: 10 }}>
                    <SfSymbol name="airplane" size={16} tintColor={colors.label} />
                  </View>
                )}
              </View>
              <View style={{ flex: 1, paddingVertical: 12 }}>
                <LegRow
                  title={leg.title}
                  subtitle={leg.subtitle}
                  delta={leg.delta}
                  deltaColor={leg.deltaColor}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 14, alignItems: "center" }}>
                <Dot filled />
              </View>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.secondaryLabel }}>
                {getAirport(leg.legTemplate.from).iata}
              </Text>
            </View>
          </View>
        ))}

        {/* Show more */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 12 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#5B5B60",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -4,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>1</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.secondaryLabel }}>
            Show More Flights
          </Text>
        </View>
      </View>
    </SectionCard>
  );
}
