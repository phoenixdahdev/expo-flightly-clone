import type Mapbox from "@rnmapbox/maps";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";

import { AirportChipMarker } from "@/components/globe/airport-chip-marker";
import { FlightGlobe } from "@/components/globe/flight-globe";
import { InboundDashLine } from "@/components/globe/inbound-dash-line";
import { RoutePlaneMarker } from "@/components/globe/route-plane-marker";
import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import { useFlyOutOverview, useFlyToFlight } from "@/hooks/use-globe-camera";
import { useFlightsStore } from "@/stores/flights-store";
import { useUiStore } from "@/stores/ui-store";

/**
 * The single, always-mounted globe. Tab switches happen inside the (panel)
 * sheet presented above this screen, so the map never re-renders on tab
 * change — it only reacts to flight/selection state from the stores.
 */
export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const flyToFlight = useFlyToFlight(cameraRef);
  const flyOutOverview = useFlyOutOverview(cameraRef);
  const flights = useFlightsStore((s) => s.flights);
  const selectedFlightKey = useUiStore((s) => s.selectedFlightKey);
  const lastCountRef = useRef(flights.length);

  const selectedFlight = selectedFlightKey
    ? flights.find((f) => f.key === selectedFlightKey)
    : undefined;
  const selectedTemplate = selectedFlight ? getTemplate(selectedFlight.templateId) : undefined;

  // Present the persistent home panel over the globe on launch. navigate (not
  // push) so a remount — e.g. Fast Refresh of this file — reuses the existing
  // panel instance instead of stacking a duplicate with a back button.
  useEffect(() => {
    router.navigate("/my-flights");
  }, []);

  // When a flight is added, fly the camera to its arc.
  useEffect(() => {
    if (flights.length > lastCountRef.current) {
      const newest = flights[flights.length - 1];
      flyToFlight(newest);
    }
    lastCountRef.current = flights.length;
  }, [flights, flyToFlight]);

  // When a detail sheet opens, frame that flight's route; when it closes,
  // fly back out to the overview like the real app.
  const prevSelectedRef = useRef(selectedFlight);
  useEffect(() => {
    if (selectedFlight) {
      flyToFlight(selectedFlight);
    } else if (prevSelectedRef.current) {
      flyOutOverview(prevSelectedRef.current);
    }
    prevSelectedRef.current = selectedFlight;
  }, [selectedFlight, flyToFlight, flyOutOverview]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlightGlobe cameraRef={cameraRef} extraControls={!!selectedFlight}>
        {selectedTemplate && (
          <>
            <InboundDashLine template={selectedTemplate} />
            <AirportChipMarker airport={getAirport(selectedTemplate.from)} />
            <AirportChipMarker airport={getAirport(selectedTemplate.to)} />
          </>
        )}
        {selectedFlight && <RoutePlaneMarker flight={selectedFlight} />}
      </FlightGlobe>
    </View>
  );
}
