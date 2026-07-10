import { Pressable } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { tapHaptic } from "@/utils/haptics";

interface IconCircleProps {
  icon: Parameters<typeof SfSymbol>[0]["name"];
  size?: number;
  iconSize?: number;
  backgroundColor?: string;
  tintColor?: string;
  onPress?: () => void;
}

export function IconCircle({
  icon,
  size = 44,
  iconSize = 18,
  backgroundColor = colors.fieldBackground,
  tintColor = colors.label,
  onPress,
}: IconCircleProps) {
  return (
    <Pressable
      onPress={() => {
        tapHaptic();
        onPress?.();
      }}
      hitSlop={6}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <SfSymbol name={icon} size={iconSize} tintColor={tintColor} weight="semibold" />
    </Pressable>
  );
}
