import type Mapbox from "@rnmapbox/maps";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { FlatList, View } from "react-native";

import { AirportChipMarker } from "@/components/globe/airport-chip-marker";
import { FlightGlobe } from "@/components/globe/flight-globe";
import { InboundDashLine } from "@/components/globe/inbound-dash-line";
import { RoutePlaneMarker } from "@/components/globe/route-plane-marker";
import { HomePanel } from "@/components/home-panel";
import { EmptyState } from "@/components/my-flights/empty-state";
import { FlightCard } from "@/components/my-flights/flight-card";
import { SheetHeader } from "@/components/my-flights/sheet-header";
import { seedDemoFlights } from "@/data/dev-seed";
import { getAirport } from "@/data/airports";
import { getTemplate } from "@/data/flight-templates";
import type { TrackedFlight } from "@/data/types";
import { useFlyToFlight } from "@/hooks/use-globe-camera";
import { useNow } from "@/hooks/use-now";
import { useFlightsStore } from "@/stores/flights-store";
import { useUiStore } from "@/stores/ui-store";
import { getFlightTimes } from "@/utils/flight-time";

export default function MyFlightsScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const flyToFlight = useFlyToFlight(cameraRef);
  const flights = useFlightsStore((s) => s.flights);
  const selectedFlightKey = useUiStore((s) => s.selectedFlightKey);
  const lastCountRef = useRef(flights.length);
  const now = useNow();

  const selectedFlight = selectedFlightKey
    ? flights.find((f) => f.key === selectedFlightKey)
    : undefined;
  const selectedTemplate = selectedFlight ? getTemplate(selectedFlight.templateId) : undefined;

  // When a flight is added, fly the camera to its arc.
  useEffect(() => {
    if (flights.length > lastCountRef.current) {
      const newest = flights[flights.length - 1];
      flyToFlight(newest.templateId);
    }
    lastCountRef.current = flights.length;
  }, [flights, flyToFlight]);

  // When a detail sheet opens, frame that flight's route.
  useEffect(() => {
    if (selectedFlight) flyToFlight(selectedFlight.templateId);
  }, [selectedFlight, flyToFlight]);

  const sorted = useMemo(() => {
    return [...flights].sort((a, b) => {
      const ta = getFlightTimes(getTemplate(a.templateId), a.dateISO);
      const tb = getFlightTimes(getTemplate(b.templateId), b.dateISO);
      const doneA = now > ta.gateArr ? 1 : 0;
      const doneB = now > tb.gateArr ? 1 : 0;
      if (doneA !== doneB) return doneA - doneB;
      return ta.gateDep - tb.gateDep;
    });
  }, [flights, now]);

  const renderItem = useCallback(
    ({ item }: { item: TrackedFlight }) => <FlightCard flight={item} />,
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
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
      <HomePanel>
        <SheetHeader title="My Flights" onDevSeed={__DEV__ ? seedDemoFlights : undefined} />
        <FlatList
          data={sorted}
          keyExtractor={(f) => f.key}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 110, paddingTop: 6 }}
          showsVerticalScrollIndicator={false}
        />
      </HomePanel>
    </View>
  );
}
