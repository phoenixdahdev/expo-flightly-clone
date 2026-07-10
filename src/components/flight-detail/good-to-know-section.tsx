import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { getAirline } from "@/data/airlines";
import { getAirport } from "@/data/airports";
import type { FlightTemplate } from "@/data/types";
import { formatLocalTime } from "@/utils/flight-time";

function Row({
  icon,
  title,
  subtitle,
}: {
  icon: Parameters<typeof SfSymbol>[0]["name"];
  title: string;
  subtitle?: string;
}) {
  return (
    <SectionCard style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 16 }}>
      <View style={{ width: 32, alignItems: "center" }}>
        <SfSymbol name={icon} size={24} tintColor={colors.label} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 17, fontWeight: "700", color: colors.label }}>{title}</Text>
        {subtitle ? (
          <Text style={{ fontSize: 14, color: colors.secondaryLabel }}>{subtitle}</Text>
        ) : null}
      </View>
    </SectionCard>
  );
}

export function GoodToKnowSection({
  template,
  gateArr,
}: {
  template: FlightTemplate;
  gateArr: number;
}) {
  const origin = getAirport(template.from);
  const dest = getAirport(template.to);
  const offsetDiffHours = (dest.tzOffsetMinutes - origin.tzOffsetMinutes) / 60;
  const arrInOriginTz = formatLocalTime(gateArr, origin.tzOffsetMinutes);
  const arrInDestTz = formatLocalTime(gateArr, dest.tzOffsetMinutes);

  return (
    <View style={{ paddingHorizontal: 16, gap: 10 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "800",
          color: colors.label,
          paddingHorizontal: 4,
          paddingTop: 10,
        }}
      >
        Good to Know
      </Text>
      {template.operatedAs ? (
        <Row
          icon="airplane"
          title={`Operated as ${template.operatedAs.airlineIata} ${template.operatedAs.number}`}
          subtitle={`By ${getAirline(template.operatedAs.airlineIata).name}`}
        />
      ) : null}
      {offsetDiffHours !== 0 ? (
        <Row
          icon="clock"
          title={`${offsetDiffHours > 0 ? "+" : ""}${offsetDiffHours} Hours Timezone Change`}
          subtitle={`${arrInDestTz} arrival is ${arrInOriginTz} ${origin.city} time`}
        />
      ) : null}
      {template.arrivalWeather ? (
        <Row
          icon="cloud.fill"
          title="Arrival Weather"
          subtitle={`${template.arrivalWeather.tempF}°F and ${template.arrivalWeather.condition}`}
        />
      ) : null}
    </View>
  );
}
