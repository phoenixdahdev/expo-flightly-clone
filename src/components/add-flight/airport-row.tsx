import { Pressable, Text, View } from "react-native";

import { HighlightedText } from "@/components/add-flight/highlighted-text";
import { FlagCircle } from "@/components/ui/flag-circle";
import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import type { Airport } from "@/data/types";
import { tapHaptic } from "@/utils/haptics";

interface AirportRowProps {
  airport: Airport;
  /** Highlight ranges applied to the matched field. */
  ranges?: [number, number][];
  field?: "name" | "city" | "iata";
  showArrowButton?: boolean;
  onPress(): void;
}

export function AirportRow({
  airport,
  ranges = [],
  field = "name",
  showArrowButton,
  onPress,
}: AirportRowProps) {
  const subtitleParts = [airport.iata, airport.icao, airport.city].filter(Boolean);

  return (
    <Pressable
      onPress={() => {
        tapHaptic();
        onPress();
      }}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 13,
        gap: 14,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <FlagCircle countryCode={airport.countryCode} size={32} />
      <View style={{ flex: 1, gap: 2 }}>
        <HighlightedText
          text={airport.name}
          ranges={field === "name" ? ranges : []}
          style={{ fontSize: 19, fontWeight: "600", color: colors.label }}
        />
        <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
          {subtitleParts.map((part, i) => {
            const isIata = part === airport.iata && airport.iata !== "";
            const isCity = part === airport.city;
            const partRanges =
              (isIata && field === "iata") || (isCity && field === "city") ? ranges : [];
            return (
              <Text key={i}>
                {i > 0 ? " • " : ""}
                <HighlightedText
                  text={part}
                  ranges={partRanges}
                  style={{ fontSize: 15, color: colors.secondaryLabel }}
                />
              </Text>
            );
          })}
        </Text>
      </View>
      {showArrowButton && (
        <View
          style={{
            width: 52,
            height: 34,
            borderRadius: 17,
            borderWidth: 1.5,
            borderColor: colors.hairline,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SfSymbol name="arrow.right" size={15} tintColor={colors.blue} weight="semibold" />
        </View>
      )}
    </Pressable>
  );
}
