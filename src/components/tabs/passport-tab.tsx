import {
  Button,
  Host,
  HStack,
  Image,
  Spacer,
  Text as UiText,
  VStack,
} from "@expo/ui/swift-ui";
import {
  foregroundColor,
  font,
  frame,
  glassEffect,
  kerning,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Image as RNImage, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { colors } from "@/constants/colors";
import { getTemplate } from "@/data/flight-templates";
import { useFlightsStore } from "@/stores/flights-store";
import { selectionHaptic } from "@/utils/haptics";

const EARTH_CIRCUMFERENCE_KM = 40_075;

function usePassportStats() {
  const flights = useFlightsStore((s) => s.flights);
  return useMemo(() => {
    const templates = flights.map((f) => getTemplate(f.templateId));
    const distanceKm = Math.round(
      templates.reduce((sum, t) => sum + t.distanceMi * 1.60934, 0)
    );
    const totalMin = templates.reduce((sum, t) => sum + t.durationMin, 0);
    const airports = new Set(templates.flatMap((t) => [t.from, t.to])).size;
    const airlines = new Set(
      templates.map((t) => t.operatedAs?.airlineIata ?? t.airlineIata)
    ).size;
    const longHaul = templates.filter((t) => t.durationMin >= 6 * 60).length;
    const aircraftCounts = new Map<string, number>();
    for (const t of templates) {
      aircraftCounts.set(t.aircraft.type, (aircraftCounts.get(t.aircraft.type) ?? 0) + 1);
    }
    let topAircraft = { type: "", count: 0 };
    for (const [type, count] of aircraftCounts) {
      if (count > topAircraft.count) topAircraft = { type, count };
    }
    return {
      flights: flights.length,
      longHaul,
      distanceKm,
      aroundWorld: (distanceKm / EARTH_CIRCUMFERENCE_KM).toFixed(1),
      flightTime: `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`,
      airports,
      airlines,
      delayedMin: 33,
      // "Boeing 777-300 ER" → "B777-300 ER", matching Flighty's short form.
      aircraftType: topAircraft.type.replace("Boeing ", "B").replace("Airbus ", "A"),
      aircraftFlights: topAircraft.count,
    };
  }, [flights]);
}

function StatLabel({ children }: { children: string }) {
  return (
    <UiText
      modifiers={[foregroundColor("#B9B3E4"), font({ size: 11, weight: "semibold" }), kerning(0.6)]}
    >
      {children}
    </UiText>
  );
}

function StatValue({ children, size = 31 }: { children: string; size?: number }) {
  return (
    <UiText modifiers={[foregroundColor("#FFFFFF"), font({ size, weight: "bold" })]}>
      {children}
    </UiText>
  );
}

function StatCaption({ children }: { children: string }) {
  return (
    <UiText modifiers={[foregroundColor("#B9B3E4"), font({ size: 12, weight: "regular" })]}>
      {children}
    </UiText>
  );
}

function IosPassportCard() {
  const stats = usePassportStats();
  const { width } = useWindowDimensions();
  // Same intrinsic-width workaround as IosDelayCard: matchContents means the
  // button row won't stretch on its own, so pin it to the card's inner width.
  const rowWidth = width - 72;

  return (
    <View style={{ borderRadius: 22, borderCurve: "continuous", overflow: "hidden" }}>
      <LinearGradient
        colors={["#1A0E3E", "#252371", "#2F55A8"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Host matchContents ignoreSafeArea="all" style={{ width: "100%" }}>
          <VStack
            alignment="leading"
            spacing={14}
            modifiers={[padding({ top: 14, leading: 20, trailing: 20, bottom: 16 })]}
          >
            <HStack>
              <VStack alignment="leading" spacing={4}>
                <UiText
      modifiers={[foregroundColor("#FFFFFF"), font({ size: 17, weight: "semibold" }), kerning(0.8)]}
                >
                  ALL-TIME FLIGHTY PASSPORT
                </UiText>
                <HStack spacing={6}>
                  <Image systemName="person.text.rectangle" size={12} color="#B9B3E4" />
                  <StatCaption>PASSPORT • PASS • PASAPORTE</StatCaption>
                </HStack>
              </VStack>
              <Spacer />
              <Image systemName="square.and.arrow.up" size={19} color="#FFFFFF" />
            </HStack>

            <HStack alignment="top" spacing={0}>
              <VStack
                alignment="leading"
                spacing={2}
                modifiers={[frame({ minWidth: 130, alignment: "leading" })]}
              >
                <StatLabel>FLIGHTS</StatLabel>
                <StatValue>{`${stats.flights}`}</StatValue>
                <StatCaption>{`${stats.longHaul} Long Haul`}</StatCaption>
              </VStack>
              <VStack alignment="leading" spacing={2}>
                <StatLabel>DISTANCE</StatLabel>
                <StatValue>{`${stats.distanceKm.toLocaleString()} km`}</StatValue>
                <StatCaption>{`${stats.aroundWorld}x around the world`}</StatCaption>
              </VStack>
              <Spacer />
            </HStack>

            <HStack alignment="top" spacing={0}>
              <VStack
                alignment="leading"
                spacing={2}
                modifiers={[frame({ minWidth: 130, alignment: "leading" })]}
              >
                <StatLabel>FLIGHT TIME</StatLabel>
                <StatValue size={21}>{stats.flightTime}</StatValue>
              </VStack>
              <VStack
                alignment="leading"
                spacing={2}
                modifiers={[frame({ minWidth: 90, alignment: "leading" })]}
              >
                <StatLabel>AIRPORTS</StatLabel>
                <StatValue size={21}>{`${stats.airports}`}</StatValue>
              </VStack>
              <VStack alignment="leading" spacing={2}>
                <StatLabel>AIRLINES</StatLabel>
                <StatValue size={21}>{`${stats.airlines}`}</StatValue>
              </VStack>
              <Spacer />
            </HStack>

            <Button onPress={selectionHaptic}>
              <HStack
                modifiers={[
                  padding({ vertical: 12, horizontal: 16 }),
                  frame({ width: rowWidth }),
                  glassEffect({
                    shape: "roundedRectangle",
                    cornerRadius: 12,
                    // "regular" adapts to backdrop brightness and flips to a washed-out
                    // light appearance on these gradient cards — "clear" stays translucent.
                    glass: { variant: "clear", interactive: true, tint: "#FFFFFF1A" },
                  }),
                ]}
              >
                <UiText modifiers={[foregroundColor("#FFFFFF"), font({ size: 16, weight: "semibold" })]}>
                  All Flight Stats
                </UiText>
                <Spacer />
                <Image systemName="chevron.right" size={14} color="#FFFFFF" />
              </HStack>
            </Button>
          </VStack>
        </Host>
      </LinearGradient>
    </View>
  );
}

function IosDelayCard() {
  const stats = usePassportStats();
  const { width } = useWindowDimensions();
  // matchContents sizes the SwiftUI host to intrinsic content, so Spacer has
  // nothing to expand into — pin the row to the card's inner width instead
  // (window − 16pt scroll padding ×2 − 20pt card padding ×2).
  const rowWidth = width - 72;
  return (
    <View style={{ borderRadius: 22, borderCurve: "continuous", overflow: "hidden" }}>
      <LinearGradient
        colors={["#420A0E", "#7A1F1C", "#A03A30"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Host matchContents ignoreSafeArea="all" style={{ width: "100%" }}>
          <VStack alignment="leading" spacing={2} modifiers={[padding({ all: 20 })]}>
            <HStack alignment="top" modifiers={[frame({ width: rowWidth })]}>
              <StatValue size={64}>{`${stats.delayedMin}`}</StatValue>
              <Spacer />
              <Image systemName="square.and.arrow.up" size={19} color="#FFFFFF" />
            </HStack>
            <UiText modifiers={[foregroundColor("#F6C9CD"), font({ size: 15, weight: "semibold" })]}>
              minutes lost from delays
            </UiText>
            <Button onPress={selectionHaptic}>
              <HStack
                modifiers={[
                  padding({ vertical: 12, horizontal: 16 }),
                  frame({ width: rowWidth }),
                  glassEffect({
                    shape: "roundedRectangle",
                    cornerRadius: 12,
                    // "regular" adapts to backdrop brightness and flips to a washed-out
                    // light appearance over this red gradient — "clear" stays translucent.
                    glass: { variant: "clear", interactive: true, tint: "#FFFFFF12" },
                  }),
                  padding({ top: 14 }),
                ]}
              >
                <UiText modifiers={[foregroundColor("#FFFFFF"), font({ size: 16, weight: "semibold" })]}>
                  All Delay Stats
                </UiText>
                <Spacer />
                <Image systemName="chevron.right" size={14} color="#FFFFFF" />
              </HStack>
            </Button>
          </VStack>
        </Host>
      </LinearGradient>
    </View>
  );
}

function IosAircraftCard() {
  const stats = usePassportStats();
  const { width } = useWindowDimensions();
  // Same intrinsic-width workaround as the other cards.
  const rowWidth = width - 72;

  return (
    <View style={{ borderRadius: 22, borderCurve: "continuous", overflow: "hidden" }}>
      <LinearGradient
        colors={["#D9D2F0", "#C9DCF3"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Host matchContents ignoreSafeArea="all" style={{ width: "100%" }}>
          <VStack alignment="leading" spacing={2} modifiers={[padding({ top: 20, leading: 20, trailing: 20 })]}>
            <HStack alignment="top" modifiers={[frame({ width: rowWidth })]}>
              <UiText modifiers={[foregroundColor("#2A3B5F"), font({ size: 22, weight: "semibold" })]}>
                Most flown aircraft
              </UiText>
              <Spacer />
              <Image systemName="square.and.arrow.up" size={19} color="#2A3B5F" />
            </HStack>
            <UiText modifiers={[foregroundColor("#2A3B5F"), font({ size: 40, weight: "semibold" })]}>
              {stats.aircraftType}
            </UiText>
            <UiText modifiers={[foregroundColor("#6B7A99"), font({ size: 16, weight: "regular" })]}>
              {`${stats.aircraftFlights} flight${stats.aircraftFlights === 1 ? "" : "s"}`}
            </UiText>
          </VStack>
        </Host>
        <RNImage
          source={require("../../../assets/images/plane-side/AC-plane-side.png")}
          style={{
            alignSelf: "center",
            // Match the button's width (card inner width, 20pt in from each edge).
            width: rowWidth,
            // Explicit height, not aspectRatio: see image-aspectratio-ignored-fabric.
            height: Math.round((rowWidth * 259) / 789),
            // Let the tail ride up over the text block, like the real Flighty card.
            marginTop: -16,
            marginBottom: 6,
          }}
          resizeMode="contain"
        />
        <Host matchContents ignoreSafeArea="all" style={{ width: "100%" }}>
          <Button onPress={selectionHaptic}>
            <HStack
              modifiers={[
                padding({ vertical: 12, horizontal: 16 }),
                frame({ width: rowWidth }),
                glassEffect({
                  shape: "roundedRectangle",
                  cornerRadius: 12,
                  glass: { variant: "clear", interactive: true, tint: "#FFFFFF4D" },
                }),
                padding({ horizontal: 20, bottom: 20, top: 4 }),
              ]}
            >
              <UiText modifiers={[foregroundColor("#2A3B5F"), font({ size: 16, weight: "semibold" })]}>
                All Aircraft Stats
              </UiText>
              <Spacer />
              <Image systemName="chevron.right" size={14} color="#2A3B5F" />
            </HStack>
          </Button>
        </Host>
      </LinearGradient>
    </View>
  );
}

function IosChips({
  range,
  onChangeRange,
}: {
  range: "all" | "2026";
  onChangeRange(r: "all" | "2026"): void;
}) {
  return (
    <Host matchContents ignoreSafeArea="all" style={{ width: "100%" }}>
      {/* Same fixed height as the friends tab's chip row so the two rows align. */}
      <HStack spacing={6} modifiers={[frame({ height: 48 })]}>
        {(
          [
            { key: "all", label: "All-Time" },
            { key: "2026", label: "2026" },
          ] as const
        ).map((chip) => (
          <Button
            key={chip.key}
            onPress={() => {
              selectionHaptic();
              onChangeRange(chip.key);
            }}
          >
            <UiText modifiers={[foregroundColor(range === chip.key ? colors.label : colors.secondaryLabel), 
                font({ size: 14, weight: range === chip.key ? "semibold" : "medium" }),
                padding({ vertical: 8, horizontal: 14 }),
                ...(range === chip.key
                  ? [glassEffect({ shape: "capsule", glass: { variant: "regular", interactive: true } })]
                  : []),
              ]}
            >
              {chip.label}
            </UiText>
          </Button>
        ))}
        <Spacer />
      </HStack>
    </Host>
  );
}

export function PassportTab() {
  const [range, setRange] = useState<"all" | "2026">("all");
  const stats = usePassportStats();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 14, paddingTop: 6 }}>
        {process.env.EXPO_OS === "ios" ? (
          <IosChips range={range} onChangeRange={setRange} />
        ) : (
          <Text style={{ fontSize: 17, fontWeight: "700", padding: 12 }}>All-Time</Text>
        )}
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, gap: 14, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {process.env.EXPO_OS === "ios" ? (
          <>
            <IosPassportCard />
            <IosDelayCard />
            <IosAircraftCard />
          </>
        ) : (
          <View
            style={{
              borderRadius: 22,
              padding: 20,
              backgroundColor: "#1A1145",
              gap: 8,
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "700" }}>
              ALL-TIME FLIGHTY PASSPORT
            </Text>
            <Text style={{ color: "#B9B3E4", fontSize: 15 }}>
              {stats.flights} flights • {stats.distanceKm.toLocaleString()} km •{" "}
              {stats.flightTime} • {stats.airports} airports • {stats.airlines} airlines
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
