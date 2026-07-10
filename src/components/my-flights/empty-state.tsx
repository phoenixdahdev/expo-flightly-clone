import { ContentUnavailableView, Host } from "@expo/ui/swift-ui";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { colors } from "@/constants/colors";

export function EmptyState() {
  if (process.env.EXPO_OS === "ios") {
    return (
      <View style={{ paddingTop: 60 }}>
        <Host matchContents style={{ width: "100%" }}>
          <ContentUnavailableView
            title="Let's Fly Somewhere"
            description="Tap Search to add your next flight"
          />
        </Host>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={{ alignItems: "center", paddingTop: 80, paddingBottom: 60, gap: 8 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700", color: colors.secondaryLabel }}>
        Let&apos;s Fly Somewhere
      </Text>
      <Text style={{ fontSize: 16, color: colors.secondaryLabel }}>
        Tap Search to add your next flight
      </Text>
    </Animated.View>
  );
}
