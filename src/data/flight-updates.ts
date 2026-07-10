import type { FlightUpdate } from "@/components/flight-detail/updates-card";
import { getAirport } from "@/data/airports";
import type { FlightTemplate } from "@/data/types";
import { formatLocalTime, getFlightTimes } from "@/utils/flight-time";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function stamp(utcMs: number, tzOffsetMinutes: number): string {
  const d = new Date(utcMs + tzOffsetMinutes * 60_000);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} at ${formatLocalTime(utcMs, tzOffsetMinutes)}`;
}

/** Ten canned updates with timestamps derived from the flight's schedule. */
export function getUpdatesFor(template: FlightTemplate, dateISO: string): FlightUpdate[] {
  const times = getFlightTimes(template, dateISO);
  const origin = getAirport(template.from);
  const tz = origin.tzOffsetMinutes;
  const dep = times.gateDep;

  const entries: [string, number][] = [
    [
      `Arrival at Terminal ${template.arrTerminal ?? "1"}${template.arrGate ? ` • Gate ${template.arrGate}` : ""}`,
      dep - 6.7 * 3_600_000,
    ],
    ["Departure gate assignment expected 1h before departure", dep - 8 * 3_600_000],
    ["Inbound aircraft departed on time", dep - 9 * 3_600_000],
    ["Check-in opens", dep - 12 * 3_600_000],
    ["Schedule confirmed by airline", dep - 24 * 3_600_000],
    ["Aircraft assignment updated", dep - 30 * 3_600_000],
    ["Minor schedule adjustment (+5m)", dep - 48 * 3_600_000],
    ["Codeshare partners synced", dep - 72 * 3_600_000],
    ["Flight schedule published", dep - 30 * 24 * 3_600_000],
    ["Flight added to your tracking", dep - 31 * 24 * 3_600_000],
  ];

  return entries.map(([title, at]) => ({ title, timestamp: stamp(at, tz) }));
}
