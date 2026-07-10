import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { tapHaptic } from "@/utils/haptics";

function ToolbarIcon({ icon }: { icon: Parameters<typeof SfSymbol>[0]["name"] }) {
  return (
    <Pressable
      onPress={tapHaptic}
      hitSlop={6}
      style={({ pressed }) => ({
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <SfSymbol name={icon} size={19} tintColor={colors.label} weight="medium" />
    </Pressable>
  );
}

/** Floating pill bar: share / mute / more + "Add Return" (replaces Get Pro). */
export function DetailToolbar({ fromIata, toIata }: { fromIata: string; toIata: string }) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 26,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.98)",
          borderRadius: 28,
          borderCurve: "continuous",
          paddingHorizontal: 6,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        <ToolbarIcon icon="square.and.arrow.up" />
        <ToolbarIcon icon="bell.slash" />
        <ToolbarIcon icon="ellipsis" />
      </View>
      <Pressable
        onPress={() => {
          tapHaptic();
          router.push({
            pathname: "/add-flight",
            params: { from: toIata, to: fromIata },
          });
        }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: colors.blue,
          borderRadius: 28,
          borderCurve: "continuous",
          paddingHorizontal: 22,
          height: 52,
          boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <SfSymbol name="arrow.uturn.right" size={16} tintColor="#FFFFFF" weight="semibold" />
        <Text style={{ fontSize: 17, fontWeight: "700", color: "#FFFFFF" }}>Add Return</Text>
      </Pressable>
    </View>
  );
}
