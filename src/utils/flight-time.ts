import { getAirport } from "@/data/airports";
import type { FlightPhase, FlightTemplate } from "@/data/types";

export interface FlightTimes {
  gateDep: number; // UTC ms
  takeOff: number;
  land: number;
  gateArr: number;
}

function localToUtc(dateISO: string, hhmm: string, tzOffsetMinutes: number, dayOffset = 0): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  return Date.UTC(y, m - 1, d + dayOffset, hh, mm) - tzOffsetMinutes * 60_000;
}

export function getFlightTimes(template: FlightTemplate, dateISO: string): FlightTimes {
  const origin = getAirport(template.from);
  const dest = getAirport(template.to);
  const gateDep = localToUtc(dateISO, template.depLocal, origin.tzOffsetMinutes);
  const gateArr = localToUtc(dateISO, template.arrLocal, dest.tzOffsetMinutes, template.arrDayOffset);
  return {
    gateDep,
    takeOff: gateDep + template.taxiOutMin * 60_000,
    land: gateArr - template.taxiInMin * 60_000,
    gateArr,
  };
}

export function getFlightPhase(times: FlightTimes, now: number): FlightPhase {
  if (now < times.takeOff) return "scheduled";
  if (now < times.land) return "inAir";
  if (now < times.gateArr) return "landed";
  return "arrived";
}

/** 0..1 fraction of the airborne portion completed. */
export function getProgress(times: FlightTimes, now: number): number {
  if (now <= times.takeOff) return 0;
  if (now >= times.land) return 1;
  return (now - times.takeOff) / (times.land - times.takeOff);
}

export function formatDurationShort(ms: number): string {
  const totalMin = Math.max(0, Math.round(ms / 60_000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Big/small pair for the card's left countdown column. */
export function formatCountdown(msUntil: number): { big: string; small: string } {
  const totalMin = Math.max(0, Math.round(msUntil / 60_000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h >= 48) {
    const days = Math.floor(h / 24);
    return { big: `${days}`, small: days === 1 ? "DAY" : "DAYS" };
  }
  if (h >= 1) {
    return { big: `${h}h`, small: `${m} ${m === 1 ? "MINUTE" : "MINUTES"}` };
  }
  return { big: `${m}`, small: m === 1 ? "MINUTE" : "MINUTES" };
}

export function formatLocalTime(utcMs: number, tzOffsetMinutes: number): string {
  const d = new Date(utcMs + tzOffsetMinutes * 60_000);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatShortDate(dateISO: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
}

export function formatFriendlyDate(dateISO: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
}

export function todayISO(now: number, tzOffsetMinutes = 0): string {
  const d = new Date(now + tzOffsetMinutes * 60_000);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
}

export function addDaysISO(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate()
  ).padStart(2, "0")}`;
}

/** Right-aligned status text on cards/results, e.g. `Departs |On Time|`. */
export function getStatusParts(
  template: FlightTemplate,
  times: FlightTimes,
  now: number
): { prefix: string; emphasis: string; color: "green" | "red" | "gray" } {
  const phase = getFlightPhase(times, now);
  switch (phase) {
    case "scheduled":
      return { prefix: "Departs ", emphasis: "On Time", color: "green" };
    case "inAir":
      return {
        prefix: "Landing in ",
        emphasis: formatDurationShort(times.land - now),
        color: "green",
      };
    case "landed":
    case "arrived": {
      const dest = getAirport(template.to);
      return {
        prefix: "Arrived ",
        emphasis: formatLocalTime(times.gateArr, dest.tzOffsetMinutes),
        color: "gray",
      };
    }
  }
}
