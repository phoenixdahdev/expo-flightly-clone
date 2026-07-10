import { AIRPORTS } from "@/data/airports";
import type { Airport } from "@/data/types";

export interface AirportMatch {
  airport: Airport;
  /** [start, end) ranges into `field`'s text for blue highlighting. */
  ranges: [number, number][];
  field: "name" | "city" | "iata";
}

/**
 * Case-insensitive prefix matching at word boundaries across airport
 * name/city/IATA. Returns match ranges so the UI can paint them blue.
 */
export function searchAirports(query: string, limit = 6): AirportMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: { match: AirportMatch; score: number }[] = [];

  for (const airport of AIRPORTS) {
    let best: { match: AirportMatch; score: number } | undefined;

    const consider = (field: AirportMatch["field"], text: string, baseScore: number) => {
      const lower = text.toLowerCase();
      const ranges: [number, number][] = [];
      let score = 0;

      if (lower.startsWith(q)) {
        ranges.push([0, q.length]);
        score = baseScore + 2;
      } else {
        // word-boundary prefix ("soe" matches "Fatmawati Soekarno")
        let idx = lower.indexOf(` ${q}`);
        if (idx === -1) idx = lower.indexOf(`-${q}`);
        if (idx !== -1) {
          ranges.push([idx + 1, idx + 1 + q.length]);
          score = baseScore + 1;
        }
      }

      if (ranges.length && (!best || score > best.score)) {
        best = { match: { airport, ranges, field }, score };
      }
    };

    consider("iata", airport.iata, 3);
    consider("name", airport.name, 2);
    consider("city", airport.city, 1);

    if (best) results.push(best);
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.match);
}

/** Airports in the same country as `origin` — the destination SUGGESTIONS list. */
export function suggestDestinations(origin: Airport, limit = 6): Airport[] {
  return AIRPORTS.filter(
    (a) => a.countryCode === origin.countryCode && a.icao !== origin.icao
  )
    .concat(AIRPORTS.filter((a) => a.countryCode !== origin.countryCode))
    .slice(0, limit);
}
