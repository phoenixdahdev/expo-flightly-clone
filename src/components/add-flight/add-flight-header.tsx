import { router } from "expo-router";
import { Text, View } from "react-native";

import { IconCircle } from "@/components/ui/icon-circle";
import { colors } from "@/constants/colors";

export function AddFlightHeader({ subtitle }: { subtitle: string }) {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 22, gap: 6 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 34, fontWeight: "800", color: colors.label, letterSpacing: -0.5 }}>
          Add Flight
        </Text>
        <IconCircle icon="xmark" size={40} iconSize={16} onPress={() => router.back()} />
      </View>
      <Text style={{ fontSize: 20, color: colors.secondaryLabel, marginTop: -6 }}>{subtitle}</Text>
    </View>
  );
}
