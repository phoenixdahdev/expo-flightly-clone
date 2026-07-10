import { useMemo } from "react";

import { INBOUND_DASH_STYLE } from "@/constants/map-styles";
import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import type { FlightTemplate } from "@/data/types";
import { greatCircleCoords } from "@/utils/great-circle";
import Mapbox from "@/utils/mapbox";

/**
 * Dashed gray lines for the selected flight's inbound aircraft legs
 * (only legs on a different city pair than the selected route itself).
 */
export function InboundDashLine({ template }: { template: FlightTemplate }) {
  const shape = useMemo(() => {
    const legs = (template.inboundChain ?? [])
      .map(({ templateId }) => getTemplate(templateId))
      .filter(
        (leg) =>
          !(
            (leg.from === template.from && leg.to === template.to) ||
            (leg.from === template.to && leg.to === template.from)
          )
      );
    return {
      type: "FeatureCollection",
      features: legs.map((leg) => ({
        type: "Feature",
        properties: { legId: leg.id },
        geometry: {
          type: "LineString",
          coordinates: greatCircleCoords(getAirport(leg.from).lngLat, getAirport(leg.to).lngLat),
        },
      })),
    } as GeoJSON.FeatureCollection;
  }, [template]);

  if (!shape.features.length) return null;

  return (
    <Mapbox.ShapeSource id="inbound-dash" shape={shape}>
      <Mapbox.LineLayer id="inbound-dash-line" style={INBOUND_DASH_STYLE} />
    </Mapbox.ShapeSource>
  );
}
