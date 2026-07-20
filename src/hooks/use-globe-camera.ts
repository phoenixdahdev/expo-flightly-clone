import type Mapbox from "@rnmapbox/maps";
import { RefObject, useCallback } from "react";
import { Dimensions } from "react-native";

import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import type { TrackedFlight } from "@/data/types";
import { getFlightPhase, getFlightTimes, getProgress } from "@/utils/flight-time";
import { pointAlongGreatCircle, routeMidpoint, zoomForDistance } from "@/utils/great-circle";

/** Close-up zoom for an in-air plane, Flighty style. */
const PLANE_ZOOM = 5.5;

/**
 * Fly the camera to a flight. An in-air flight zooms in close on the plane's
 * current position; otherwise the whole arc is framed above the sheet.
 */
export function useFlyToFlight(cameraRef: RefObject<Mapbox.Camera | null>) {
  return useCallback(
    (flight: TrackedFlight) => {
      const template = getTemplate(flight.templateId);
      const from = getAirport(template.from);
      const to = getAirport(template.to);
      const times = getFlightTimes(template, flight.dateISO);
      const now = Date.now();

      if (getFlightPhase(times, now) === "inAir") {
        const { position } = pointAlongGreatCircle(
          from.lngLat,
          to.lngLat,
          getProgress(times, now)
        );
        cameraRef.current?.setCamera({
          centerCoordinate: position,
          zoomLevel: PLANE_ZOOM,
          // Center the plane in the strip visible above the resting sheet,
          // which covers ~57.3% of the screen (detent 0.6125 of max height).
          padding: {
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: Dimensions.get("window").height * 0.573,
          },
          animationMode: "flyTo",
          animationDuration: 1800,
        });
        return;
      }

      const mid = routeMidpoint(from.lngLat, to.lngLat);
      cameraRef.current?.setCamera({
        // Bias the center south so the arc lands in the upper (visible) half.
        centerCoordinate: [mid[0], mid[1] - 14],
        zoomLevel: zoomForDistance(template.distanceMi),
        // Padding is sticky on the native camera — reset it explicitly.
        padding: { paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 },
        animationMode: "flyTo",
        animationDuration: 1600,
      });
    },
    [cameraRef]
  );
}

/**
 * Fly back out to the whole-globe overview after a detail sheet closes,
 * anchored near where the flight is so the camera doesn't jump continents —
 * matching the real app's zoom-out on close.
 */
export function useFlyOutOverview(cameraRef: RefObject<Mapbox.Camera | null>) {
  return useCallback(
    (flight: TrackedFlight) => {
      const template = getTemplate(flight.templateId);
      const from = getAirport(template.from);
      const to = getAirport(template.to);
      const times = getFlightTimes(template, flight.dateISO);
      const now = Date.now();
      const anchor =
        getFlightPhase(times, now) === "inAir"
          ? pointAlongGreatCircle(from.lngLat, to.lngLat, getProgress(times, now)).position
          : routeMidpoint(from.lngLat, to.lngLat);
      cameraRef.current?.setCamera({
        // Bias south so the route sits in the strip visible above the sheet.
        centerCoordinate: [anchor[0], anchor[1] - 18],
        zoomLevel: 1.8,
        padding: { paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 },
        animationMode: "flyTo",
        animationDuration: 1600,
      });
    },
    [cameraRef]
  );
}
