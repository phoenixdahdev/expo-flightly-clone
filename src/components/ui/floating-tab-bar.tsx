import type { BottomTabBarProps } from "expo-router/js-tabs";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { selectionHaptic, tapHaptic } from "@/utils/haptics";

const BAR_HEIGHT = 64;

const TAB_ICONS: Record<string, { default: string; selected: string }> = {
  "my-flights": { default: "airplane", selected: "airplane" },
  friends: { default: "person.2", selected: "person.2.fill" },
  passport: { default: "wallet.pass", selected: "wallet.pass.fill" },
};

function GlassSurface({
  style,
  children,
}: {
  style: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView isInteractive style={style}>
        {children}
      </GlassView>
    );
  }
  return (
    <View
      style={[
        style,
        {
          backgroundColor: "rgba(255,255,255,0.97)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
        },
      ]}
    >
      {children}
    </View>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 18,
        paddingBottom: Math.max(insets.bottom, 14),
      }}
    >
      <GlassSurface
        style={{
          flex: 1,
          height: BAR_HEIGHT,
          borderRadius: BAR_HEIGHT / 2,
          flexDirection: "row",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const focused = state.index === index;
          const icon = TAB_ICONS[route.name] ?? { default: "circle", selected: "circle.fill" };
          const tint = focused ? colors.blue : colors.label;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  selectionHaptic();
                  navigation.navigate(route.name);
                }
              }}
              style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 3 }}
            >
              <SfSymbol
                name={(focused ? icon.selected : icon.default) as never}
                size={22}
                tintColor={tint}
                weight={focused ? "semibold" : "medium"}
              />
              <Text style={{ fontSize: 12, fontWeight: focused ? "600" : "500", color: tint }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </GlassSurface>

      <GlassSurface
        style={{
          width: BAR_HEIGHT,
          height: BAR_HEIGHT,
          borderRadius: BAR_HEIGHT / 2,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          onPress={() => {
            tapHaptic();
            router.push("/add-flight");
          }}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <SfSymbol name="magnifyingglass" size={22} tintColor={colors.label} weight="semibold" />
        </Pressable>
      </GlassSurface>
    </View>
  );
}
