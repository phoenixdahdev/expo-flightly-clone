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
          // Center the plane in the strip visible above the ~0.58 sheet detent.
          padding: {
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: Dimensions.get("window").height * 0.58,
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
