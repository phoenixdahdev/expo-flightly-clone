import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import type { ForecastStats } from "@/data/types";

const BUCKETS: {
  key: keyof ForecastStats["buckets"];
  label: string;
  color: string;
}[] = [
  { key: "early", label: "Early", color: "#34A853" },
  { key: "onTime", label: "On Time", color: "#7BC96A" },
  { key: "late15", label: "15m late", color: "#F4C20D" },
  { key: "late30", label: "30m late", color: "#F29900" },
  { key: "late45", label: "45m+ late", color: "#EA4335" },
  { key: "canceled", label: "Canceled", color: "#9AA0A6" },
  { key: "diverted", label: "Diverted", color: "#9AA0A6" },
];

function StatColumn({
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

function BarRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Text style={{ width: 84, fontSize: 15, color: colors.label }}>{label}</Text>
      <View
        style={{
          flex: 1,
          height: 13,
          borderRadius: 7,
          backgroundColor: "#EFEFF4",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${Math.max(pct, pct > 0 ? 4 : 0)}%`,
            height: "100%",
            borderRadius: 7,
            backgroundColor: color,
          }}
        />
      </View>
      <Text
        style={{
          width: 44,
          fontSize: 15,
          color: colors.label,
          textAlign: "right",
          fontVariant: ["tabular-nums"],
        }}
      >
        {pct}%
      </Text>
    </View>
  );
}

export function ForecastCard({
  flightLabel,
  forecast,
}: {
  flightLabel: string;
  forecast: ForecastStats;
}) {
  return (
    <SectionCard style={{ marginHorizontal: 16, gap: 16 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: colors.label }}>
          Arrival Forecast
        </Text>
        <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
          {flightLabel} performance over the last 60 days
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <StatColumn label="Late" icon="clock" value={`${forecast.latePct}%`} />
        <StatColumn label="Average of Late" icon="clock" value={`${forecast.avgLateMin}m`} />
        <StatColumn label="Observed" icon="airplane" value={`${forecast.observed}`} />
      </View>
      <View style={{ gap: 10 }}>
        {BUCKETS.map((bucket) => (
          <BarRow
            key={bucket.key}
            label={bucket.label}
            pct={forecast.buckets[bucket.key]}
            color={bucket.color}
          />
        ))}
      </View>
    </SectionCard>
  );
}
