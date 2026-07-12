import { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";

import { EmptyState } from "@/components/my-flights/empty-state";
import { FlightCard } from "@/components/my-flights/flight-card";
import { SheetHeader } from "@/components/my-flights/sheet-header";
import { seedDemoFlights } from "@/data/dev-seed";
import { getTemplate } from "@/data/flight-templates";
import type { TrackedFlight } from "@/data/types";
import { useNow } from "@/hooks/use-now";
import { useFlightsStore } from "@/stores/flights-store";
import { getFlightTimes } from "@/utils/flight-time";

export default function MyFlightsScreen() {
  const flights = useFlightsStore((s) => s.flights);
  const now = useNow();

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
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SheetHeader title="My Flights" onDevSeed={__DEV__ ? seedDemoFlights : undefined} />
      <FlatList
        data={sorted}
        keyExtractor={(f) => f.key}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 110, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
