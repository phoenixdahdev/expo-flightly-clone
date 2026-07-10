import { Text, View } from "react-native";

import { Hairline } from "@/components/ui/hairline";
import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/constants/colors";
import { getAirport } from "@/data/airports";
import type { FlightTemplate } from "@/data/types";
import { formatLocalTime, getFlightTimes } from "@/utils/flight-time";

function CapsHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.8,
        color: colors.secondaryLabel,
        paddingTop: 14,
        paddingBottom: 4,
      }}
    >
      {title}
    </Text>
  );
}

function TimetableRow({
  label,
  scheduled,
  estimated,
}: {
  label: string;
  scheduled: string;
  estimated: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}>
      <Text style={{ flex: 1, fontSize: 17, fontWeight: "600", color: colors.label }}>{label}</Text>
      <View style={{ width: 110, gap: 2 }}>
        <Text style={{ fontSize: 13, color: colors.secondaryLabel }}>Scheduled</Text>
        <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label, fontVariant: ["tabular-nums"] }}>
          {scheduled}
        </Text>
      </View>
      <View style={{ width: 100, gap: 2 }}>
        <Text style={{ fontSize: 13, color: colors.secondaryLabel }}>Estimated</Text>
        <Text style={{ fontSize: 17, fontWeight: "600", color: colors.green, fontVariant: ["tabular-nums"] }}>
          {estimated}
        </Text>
      </View>
    </View>
  );
}

export function TimetableCard({
  template,
  dateISO,
}: {
  template: FlightTemplate;
  dateISO: string;
}) {
  const times = getFlightTimes(template, dateISO);
  const origin = getAirport(template.from);
  const dest = getAirport(template.to);

  const depTz = origin.tzOffsetMinutes;
  const arrTz = dest.tzOffsetMinutes;
  const airMin = Math.round((times.land - times.takeOff) / 60_000);
  const airTime = `${Math.floor(airMin / 60)}h ${airMin % 60 ? `${airMin % 60}m` : ""}`.trim();
  const totalMin = Math.round((times.gateArr - times.gateDep) / 60_000);
  const totalTime = `${Math.floor(totalMin / 60)}h ${totalMin % 60 ? `${totalMin % 60}m` : ""}`.trim();

  return (
    <SectionCard style={{ marginHorizontal: 16, paddingVertical: 8 }}>
      <View style={{ paddingTop: 10, gap: 4 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: colors.label }}>
          Detailed Timetable
        </Text>
        <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
          Scheduled, Estimated, Predicted, and Actual
        </Text>
      </View>

      <CapsHeader title="DEPART" />
      <TimetableRow
        label="Gate Departure"
        scheduled={formatLocalTime(times.gateDep, depTz)}
        estimated={formatLocalTime(times.gateDep, depTz)}
      />
      <Hairline />
      <TimetableRow label="Taxi" scheduled={`${template.taxiOutMin}m`} estimated={`${template.taxiOutMin}m`} />
      <Hairline />
      <TimetableRow
        label="Take Off"
        scheduled={formatLocalTime(times.takeOff, depTz)}
        estimated={formatLocalTime(times.takeOff, depTz)}
      />

      <CapsHeader title="ARRIVE" />
      <TimetableRow
        label="Land"
        scheduled={formatLocalTime(times.land, arrTz)}
        estimated={formatLocalTime(times.land, arrTz)}
      />
      <Hairline />
      <TimetableRow label="Taxi" scheduled={`${template.taxiInMin}m`} estimated={`${template.taxiInMin}m`} />
      <Hairline />
      <TimetableRow
        label="Gate Arrival"
        scheduled={formatLocalTime(times.gateArr, arrTz)}
        estimated={formatLocalTime(times.gateArr, arrTz)}
      />

      <CapsHeader title="TOTALS" />
      <TimetableRow label="Air Time" scheduled={airTime} estimated={airTime} />
      <Hairline />
      <TimetableRow label="Total Time" scheduled={totalTime} estimated={totalTime} />
    </SectionCard>
  );
}
