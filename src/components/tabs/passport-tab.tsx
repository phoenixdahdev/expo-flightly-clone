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
  background,
  foregroundColor,
  cornerRadius,
  font,
  frame,
  kerning,
  padding,
  shadow,
} from "@expo/ui/swift-ui/modifiers";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

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
    return {
      flights: flights.length,
      longHaul,
      distanceKm,
      aroundWorld: (distanceKm / EARTH_CIRCUMFERENCE_KM).toFixed(1),
      flightTime: `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`,
      airports,
      airlines,
      delayedMin: 33,
    };
  }, [flights]);
}

function StatLabel({ children }: { children: string }) {
  return (
    <UiText
      modifiers={[foregroundColor("#B9B3E4"), font({ size: 14, weight: "semibold" }), kerning(0.6)]}
    >
      {children}
    </UiText>
  );
}

function StatValue({ children, size = 34 }: { children: string; size?: number }) {
  return (
    <UiText modifiers={[foregroundColor("#FFFFFF"), font({ size, weight: "bold" })]}>
      {children}
    </UiText>
  );
}

function StatCaption({ children }: { children: string }) {
  return (
    <UiText modifiers={[foregroundColor("#B9B3E4"), font({ size: 14, weight: "regular" })]}>
      {children}
    </UiText>
  );
}

function IosPassportCard() {
  const stats = usePassportStats();

  return (
    <View style={{ borderRadius: 22, borderCurve: "continuous", overflow: "hidden" }}>
      <LinearGradient
        colors={["#241A5E", "#1A1145", "#320D33"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Host matchContents style={{ width: "100%" }}>
          <VStack alignment="leading" spacing={16} modifiers={[padding({ all: 20 })]}>
            <HStack>
              <VStack alignment="leading" spacing={4}>
                <UiText
      modifiers={[foregroundColor("#FFFFFF"), font({ size: 19, weight: "semibold" }), kerning(0.8)]}
                >
                  ALL-TIME FLIGHTY PASSPORT
                </UiText>
                <HStack spacing={6}>
                  <Image systemName="person.text.rectangle" size={14} color="#B9B3E4" />
                  <StatCaption>PASSPORT • PASS • PASAPORTE</StatCaption>
                </HStack>
              </VStack>
              <Spacer />
              <Image systemName="square.and.arrow.up" size={19} color="#FFFFFF" />
            </HStack>

            <HStack alignment="top" spacing={0}>
              <VStack alignment="leading" spacing={2} modifiers={[frame({ minWidth: 130 })]}>
                <StatLabel>FLIGHTS</StatLabel>
                <StatValue size={40}>{`${stats.flights}`}</StatValue>
                <StatCaption>{`${stats.longHaul} Long Haul`}</StatCaption>
              </VStack>
              <VStack alignment="leading" spacing={2}>
                <StatLabel>DISTANCE</StatLabel>
                <StatValue size={40}>{`${stats.distanceKm.toLocaleString()} km`}</StatValue>
                <StatCaption>{`${stats.aroundWorld}x around the world`}</StatCaption>
              </VStack>
              <Spacer />
            </HStack>

            <HStack alignment="top" spacing={0}>
              <VStack alignment="leading" spacing={2} modifiers={[frame({ minWidth: 130 })]}>
                <StatLabel>FLIGHT TIME</StatLabel>
                <StatValue size={28}>{stats.flightTime}</StatValue>
              </VStack>
              <VStack alignment="leading" spacing={2} modifiers={[frame({ minWidth: 90 })]}>
                <StatLabel>AIRPORTS</StatLabel>
                <StatValue size={28}>{`${stats.airports}`}</StatValue>
              </VStack>
              <VStack alignment="leading" spacing={2}>
                <StatLabel>AIRLINES</StatLabel>
                <StatValue size={28}>{`${stats.airlines}`}</StatValue>
              </VStack>
              <Spacer />
            </HStack>

            <Button onPress={selectionHaptic}>
              <HStack
                modifiers={[
                  padding({ vertical: 13, horizontal: 16 }),
                  background("#FFFFFF22"),
                  cornerRadius(12),
                ]}
              >
                <UiText modifiers={[foregroundColor("#FFFFFF"), font({ size: 17, weight: "semibold" })]}>
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
        colors={["#7A1220", "#A61B2B", "#D64545"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Host matchContents style={{ width: "100%" }}>
          <VStack alignment="leading" spacing={2} modifiers={[padding({ all: 20 })]}>
            <HStack alignment="top" modifiers={[frame({ width: rowWidth })]}>
              <StatValue size={64}>{`${stats.delayedMin}`}</StatValue>
              <Spacer />
              <Image systemName="square.and.arrow.up" size={19} color="#FFFFFF" />
            </HStack>
            <UiText modifiers={[foregroundColor("#F6C9CD"), font({ size: 16, weight: "semibold" })]}>
              minutes lost from delays
            </UiText>
          </VStack>
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
    <Host matchContents style={{ width: "100%" }}>
      <HStack spacing={6}>
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
                font({ size: 17, weight: range === chip.key ? "semibold" : "medium" }),
                padding({ vertical: 11, horizontal: 20 }),
                ...(range === chip.key
                  ? [background("#FFFFFF", "capsule" as never), shadow({ radius: 8, y: 2, color: "#00000022" })]
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
      <View style={{ paddingHorizontal: 14, paddingTop: 2 }}>
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
