import { useMemo } from "react";

import {
  ARC_CASING_STYLE,
  ARC_LINE_STYLE,
  ENDPOINT_CIRCLE_STYLE,
} from "@/constants/map-styles";
import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import { useFlightsStore } from "@/stores/flights-store";
import { useNowMinute } from "@/hooks/use-now";
import { getFlightTimes, getProgress } from "@/utils/flight-time";
import { routeFeatures } from "@/utils/great-circle";
import Mapbox from "@/utils/mapbox";

/**
 * All tracked-flight arcs in one ShapeSource (+ endpoints in another).
 * Recomputed only when the flight list changes or the minute ticks over.
 */
export function RouteArcs() {
  const flights = useFlightsStore((s) => s.flights);
  const nowMinute = useNowMinute();

  const { arcs, endpoints } = useMemo(() => {
    const lineFeatures: GeoJSON.Feature<GeoJSON.LineString>[] = [];
    const pointFeatures: GeoJSON.Feature<GeoJSON.Point>[] = [];
    const seenAirports = new Set<string>();

    for (const flight of flights) {
      const template = getTemplate(flight.templateId);
      const from = getAirport(template.from);
      const to = getAirport(template.to);
      const times = getFlightTimes(template, flight.dateISO);
      const airborne =
        nowMinute > times.takeOff && nowMinute < times.land
          ? getProgress(times, nowMinute)
          : undefined;
      lineFeatures.push(...routeFeatures(flight.key, from.lngLat, to.lngLat, airborne));

      for (const airport of [from, to]) {
        const code = airport.iata || airport.icao;
        if (seenAirports.has(code)) continue;
        seenAirports.add(code);
        pointFeatures.push({
          type: "Feature",
          properties: { code },
          geometry: { type: "Point", coordinates: airport.lngLat },
        });
      }
    }

    return {
      arcs: { type: "FeatureCollection", features: lineFeatures } as GeoJSON.FeatureCollection,
      endpoints: {
        type: "FeatureCollection",
        features: pointFeatures,
      } as GeoJSON.FeatureCollection,
    };
  }, [flights, nowMinute]);

  if (flights.length === 0) return null;

  return (
    <>
      <Mapbox.ShapeSource id="route-arcs" shape={arcs}>
        <Mapbox.LineLayer id="route-arc-casing" style={ARC_CASING_STYLE} />
        <Mapbox.LineLayer id="route-arc-line" style={ARC_LINE_STYLE} />
      </Mapbox.ShapeSource>
      <Mapbox.ShapeSource id="route-endpoints" shape={endpoints}>
        <Mapbox.CircleLayer id="route-endpoint-circles" style={ENDPOINT_CIRCLE_STYLE} />
      </Mapbox.ShapeSource>
    </>
  );
}
