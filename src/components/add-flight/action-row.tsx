import { Pressable, Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { selectionHaptic } from "@/utils/haptics";

interface ActionRowProps {
  icon: Parameters<typeof SfSymbol>[0]["name"];
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export function ActionRow({ icon, title, subtitle, onPress }: ActionRowProps) {
  return (
    <Pressable
      onPress={() => {
        selectionHaptic();
        onPress?.();
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
      <View style={{ width: 34, alignItems: "center" }}>
        <SfSymbol name={icon} size={24} tintColor={colors.label} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 19, fontWeight: "600", color: colors.label }}>{title}</Text>
        {subtitle ? (
          <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>{subtitle}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
