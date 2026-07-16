import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Pressable, View, type ViewStyle } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { useUiStore } from "@/stores/ui-store";
import { selectionHaptic } from "@/utils/haptics";

const glassAvailable = isLiquidGlassAvailable();

function ControlButton({
  icon,
  onPress,
}: {
  icon: Parameters<typeof SfSymbol>[0]["name"];
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        selectionHaptic();
        onPress?.();
      }}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 48,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <SfSymbol name={icon} size={21} tintColor="#FFFFFF" weight="medium" />
    </Pressable>
  );
}

function ControlGroup({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const shape: ViewStyle = {
    borderRadius: 24,
    borderCurve: "continuous",
    ...style,
  };

  if (glassAvailable) {
    return (
      <GlassView isInteractive colorScheme="dark" style={shape}>
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        shape,
        { backgroundColor: colors.controlDark, boxShadow: "0 4px 16px rgba(0,0,0,0.35)" },
      ]}
    >
      {children}
    </View>
  );
}

export function MapControls({ extraControls = false }: { extraControls?: boolean }) {
  const toggleMapStyle = useUiStore((s) => s.toggleMapStyle);

  return (
    <View style={{ position: "absolute", top: 60, right: 12, alignItems: "center", gap: 12 }}>
      <ControlGroup style={{ paddingVertical: 4 }}>
        <ControlButton icon="map" onPress={toggleMapStyle} />
        {extraControls && <ControlButton icon="arrow.down.right.and.arrow.up.left" />}
        <ControlButton icon="cloud" />
        {extraControls && <ControlButton icon="location" />}
      </ControlGroup>
      <ControlGroup>
        <ControlButton icon="antenna.radiowaves.left.and.right" />
      </ControlGroup>
    </View>
  );
}
