import { Pressable, Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { selectionHaptic } from "@/utils/haptics";

interface ResultsFilterBarProps {
  showCodeshares: boolean;
  airlineFilterLabel: string;
  onToggleCodeshares(): void;
  onPressAirlines(): void;
}

export function ResultsFilterBar({
  showCodeshares,
  airlineFilterLabel,
  onToggleCodeshares,
  onPressAirlines,
}: ResultsFilterBarProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 6,
      }}
    >
      <Pressable
        onPress={() => {
          selectionHaptic();
          onToggleCodeshares();
        }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          borderWidth: 1.5,
          borderColor: showCodeshares ? colors.label : colors.hairline,
          borderRadius: 22,
          paddingHorizontal: 16,
          height: 44,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <SfSymbol name="eye" size={16} tintColor={colors.label} />
        <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>Codeshares</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          selectionHaptic();
          onPressAirlines();
        }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          borderWidth: 1.5,
          borderColor: colors.hairline,
          borderRadius: 22,
          paddingHorizontal: 16,
          height: 44,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>
          {airlineFilterLabel}
        </Text>
        <SfSymbol name="chevron.down" size={13} tintColor={colors.label} weight="semibold" />
      </Pressable>
    </View>
  );
}
