import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Pressable, Text, View } from "react-native";

import { IconCircle } from "@/components/ui/icon-circle";
import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { tapHaptic } from "@/utils/haptics";

interface SheetHeaderProps {
  title: string;
  showMenuButton?: boolean;
  onDevSeed?: () => void;
}

function GlassCircleButton({
  icon,
  onPress,
}: {
  icon: Parameters<typeof SfSymbol>[0]["name"];
  onPress?: () => void;
}) {
  return (
    <GlassView
      isInteractive
      style={{ width: 44, height: 44, borderRadius: 22, overflow: "hidden" }}
    >
      <Pressable
        onPress={() => {
          tapHaptic();
          onPress?.();
        }}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <SfSymbol name={icon} size={17} tintColor={colors.label} weight="semibold" />
      </Pressable>
    </GlassView>
  );
}

export function SheetHeader({ title, showMenuButton, onDevSeed }: SheetHeaderProps) {
  const glass = isLiquidGlassAvailable();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 6,
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 34,
          fontWeight: "800",
          color: colors.label,
          letterSpacing: -0.4,
        }}
      >
        {title}
      </Text>
      {showMenuButton ? (
        glass ? (
          <GlassCircleButton icon="ellipsis" />
        ) : (
          <IconCircle icon="ellipsis" size={44} iconSize={17} />
        )
      ) : null}
      {glass ? (
        <GlassCircleButton icon="square.and.arrow.up" />
      ) : (
        <IconCircle icon="square.and.arrow.up" size={44} iconSize={17} />
      )}
      <Pressable
        onPress={() => {
          tapHaptic();
          onDevSeed?.();
        }}
        hitSlop={6}
      >
        <SfSymbol name="person.crop.circle.fill" size={44} tintColor="#C7C7CC" />
      </Pressable>
    </View>
  );
}
