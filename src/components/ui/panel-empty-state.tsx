import type { ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { colors } from "@/constants/colors";
import { SfSymbol } from "@/components/ui/symbol";

// Inline circled-search glyph used mid-sentence in empty-state copy
// ("tap [icon] Search ..."). Nudged down so it sits on the text baseline.
export function InlineSearchGlyph() {
  return (
    <View style={{ transform: [{ translateY: 3 }] }}>
      <SfSymbol
        name="magnifyingglass.circle.fill"
        size={19}
        tintColor={colors.secondaryLabel}
      />
    </View>
  );
}

export function PanelEmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={{ alignItems: "center", gap: 6, paddingHorizontal: 24 }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: colors.secondaryLabel,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 17,
          color: colors.secondaryLabel,
          textAlign: "center",
          lineHeight: 25,
        }}
      >
        {children}
      </Text>
    </Animated.View>
  );
}
