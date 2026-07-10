import { Pressable, Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { tapHaptic } from "@/utils/haptics";

interface DateOptionRowProps {
  icon: Parameters<typeof SfSymbol>[0]["name"];
  title: string;
  subtitle?: string;
  showArrowButton?: boolean;
  onPress(): void;
}

export function DateOptionRow({
  icon,
  title,
  subtitle,
  showArrowButton,
  onPress,
}: DateOptionRowProps) {
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
        paddingVertical: 15,
        gap: 16,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View style={{ width: 30, alignItems: "center" }}>
        <SfSymbol name={icon} size={24} tintColor={colors.label} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 19, fontWeight: "600", color: colors.label }}>{title}</Text>
        {subtitle ? (
          <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>{subtitle}</Text>
        ) : null}
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
