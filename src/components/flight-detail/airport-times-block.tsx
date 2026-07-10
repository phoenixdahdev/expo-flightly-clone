import { Text, View } from "react-native";

import { GatePill } from "@/components/flight-detail/gate-pill";
import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import type { Airport } from "@/data/types";

interface AirportTimesBlockProps {
  direction: "departure" | "arrival";
  airport: Airport;
  time: string;
  dayOffset?: number;
  statusLine: string; // e.g. "Departs in 5h 55m" / "Arrives in 12h 55m"
  terminal?: string;
  gate: string | null | undefined;
}

export function AirportTimesBlock({
  direction,
  airport,
  time,
  dayOffset,
  statusLine,
  terminal,
  gate,
}: AirportTimesBlockProps) {
  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 14, gap: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colors.label,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SfSymbol
            name={direction === "departure" ? "arrow.up.right" : "arrow.down.right"}
            size={11}
            tintColor="#FFFFFF"
            weight="bold"
          />
        </View>
        <Text style={{ fontSize: 17, fontWeight: "700", color: colors.label }}>
          {airport.iata} <Text style={{ fontWeight: "400" }}>• {airport.name}</Text>
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
        <View style={{ gap: 3 }}>
          <Text
            style={{
              fontSize: 52,
              fontWeight: "800",
              color: colors.green,
              letterSpacing: -1.5,
              fontVariant: ["tabular-nums"],
            }}
          >
            {time}
            {dayOffset ? (
              <Text style={{ fontSize: 26, fontWeight: "700" }}> +{dayOffset}</Text>
            ) : null}
          </Text>
          <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
            <Text style={{ color: colors.green, fontWeight: "700" }}>On Time</Text> • {statusLine}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 6 }}>
          <GatePill gate={gate} direction={direction} />
          {terminal ? (
            <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
              Terminal <Text style={{ fontWeight: "700", color: colors.label }}>{terminal}</Text>
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
