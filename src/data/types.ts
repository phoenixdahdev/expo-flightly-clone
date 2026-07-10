import type { LngLat } from "@/utils/great-circle";

export interface Airport {
  /** IATA code; empty string for small fields without one. */
  iata: string;
  icao: string;
  name: string;
  city: string;
  /** ISO 3166-1 alpha-2, used for the emoji flag circle. */
  countryCode: string;
  lngLat: LngLat;
  /** Fixed fake UTC offset in minutes (no DST) — keeps mock times deterministic. */
  tzOffsetMinutes: number;
}

export type Alliance = "SkyTeam" | "Star Alliance" | "oneworld";

export interface Airline {
  iata: string;
  icao: string;
  name: string;
  callsign: string;
  alliance?: Alliance;
  brandColor: string;
  phone: string;
  website: string;
}

export interface Aircraft {
  type: string;
  registration: string;
  firstFlightISO: string;
}

export interface ForecastStats {
  latePct: number;
  avgLateMin: number;
  observed: number;
  /** Percentages, sum ≈ 100. */
  buckets: {
    early: number;
    onTime: number;
    late15: number;
    late30: number;
    late45: number;
    canceled: number;
    diverted: number;
  };
}

export interface FlightRef {
  airlineIata: string;
  number: string;
}

export interface FlightTemplate {
  id: string; // e.g. 'KE438-CGK-ICN'
  airlineIata: string;
  number: string;
  from: string; // origin airport IATA
  to: string; // destination airport IATA
  depLocal: string; // 'HH:mm' wall clock at origin
  arrLocal: string; // 'HH:mm' wall clock at destination
  arrDayOffset: 0 | 1;
  durationMin: number;
  distanceMi: number;
  taxiOutMin: number;
  taxiInMin: number;
  depTerminal?: string;
  depGate?: string | null; // null renders the yellow '--' pill
  arrTerminal?: string;
  arrGate?: string;
  /** Set on codeshare (marketing) flights, pointing at the operating flight. */
  operatedAs?: FlightRef;
  /** Marketing numbers sold on this operating flight. */
  codeshares?: FlightRef[];
  aircraft: Aircraft;
  forecast: ForecastStats;
  overnight?: boolean;
  /**
   * Where the aircraft comes from before this departure, most recent first:
   * templateId of the previous leg + minutes of delay flavor for that leg.
   */
  inboundChain?: { templateId: string; deltaMin: number }[];
  arrivalWeather?: { tempF: number; condition: string; symbol: string };
}

export interface TrackedFlight {
  key: string; // `${templateId}_${dateISO}`
  templateId: string;
  dateISO: string; // 'YYYY-MM-DD' departure date at origin
  addedAtISO: string;
  bookingCode?: string;
  seat?: string;
  notes?: string;
}

export type FlightPhase = "scheduled" | "inAir" | "landed" | "arrived";
