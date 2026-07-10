import type Mapbox from "@rnmapbox/maps";
import { RefObject, useCallback } from "react";

import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import { routeMidpoint, zoomForDistance } from "@/utils/great-circle";

/** Fly the camera so a flight's arc sits in the visible area above the sheet. */
export function useFlyToFlight(cameraRef: RefObject<Mapbox.Camera | null>) {
  return useCallback(
    (templateId: string) => {
      const template = getTemplate(templateId);
      const from = getAirport(template.from);
      const to = getAirport(template.to);
      const mid = routeMidpoint(from.lngLat, to.lngLat);
      cameraRef.current?.setCamera({
        // Bias the center south so the arc lands in the upper (visible) half.
        centerCoordinate: [mid[0], mid[1] - 14],
        zoomLevel: zoomForDistance(template.distanceMi),
        animationMode: "flyTo",
        animationDuration: 1600,
      });
    },
    [cameraRef]
  );
}
