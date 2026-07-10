import { View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import type { TrackedFlight } from "@/data/types";
import { useNowMinute } from "@/hooks/use-now";
import { getFlightTimes, getProgress } from "@/utils/flight-time";
import { pointAlongGreatCircle } from "@/utils/great-circle";
import Mapbox from "@/utils/mapbox";

/** Airplane glyph positioned along the selected flight's route while in air. */
export function RoutePlaneMarker({ flight }: { flight: TrackedFlight }) {
  const nowMinute = useNowMinute();
  const template = getTemplate(flight.templateId);
  const times = getFlightTimes(template, flight.dateISO);
  if (nowMinute <= times.takeOff || nowMinute >= times.land) return null;

  const from = getAirport(template.from);
  const to = getAirport(template.to);
  const progress = getProgress(times, nowMinute);
  const { position, bearingDeg } = pointAlongGreatCircle(from.lngLat, to.lngLat, progress);

  return (
    <Mapbox.MarkerView coordinate={position} anchor={{ x: 0.5, y: 0.5 }} allowOverlap>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
          transform: [{ rotate: `${bearingDeg - 90}deg` }],
        }}
      >
        <SfSymbol name="airplane" size={20} tintColor="#1D5FD6" />
      </View>
    </Mapbox.MarkerView>
  );
}
