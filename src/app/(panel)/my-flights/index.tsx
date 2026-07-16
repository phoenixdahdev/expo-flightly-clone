import { Stack } from "expo-router";
import { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";

import { EmptyState } from "@/components/my-flights/empty-state";
import { FlightCard } from "@/components/my-flights/flight-card";
import { PanelTitle } from "@/components/ui/panel-title";
import { renderProfileToolbarMenu } from "@/components/ui/profile-toolbar-item";
import { colors } from "@/constants/colors";
import { seedDemoFlights } from "@/data/dev-seed";
import { getTemplate } from "@/data/flight-templates";
import type { TrackedFlight } from "@/data/types";
import { useNow } from "@/hooks/use-now";
import { useFlightsStore } from "@/stores/flights-store";
import { tapHaptic } from "@/utils/haptics";
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
    // collapsable={false} keeps this view in the native hierarchy so
    // react-native-screens' formSheet scroll-view coercion (RNSScreen.mm
    // updateBounds) can't find the FlatList through a first-subview chain
    // and pin it full-sheet over the title.
    <View collapsable={false} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          tintColor={colors.label}
          accessibilityLabel="Share"
          separateBackground
          onPress={tapHaptic}
        />
        {renderProfileToolbarMenu(__DEV__ ? seedDemoFlights : undefined)}
      </Stack.Toolbar>
      <PanelTitle>My Flights</PanelTitle>
      <FlatList
        data={sorted}
        keyExtractor={(f) => f.key}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 110,
          paddingTop: 6,
          flexGrow: sorted.length === 0 ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
