import "@/utils/mapbox";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useNowTicker } from "@/hooks/use-now";

export default function RootLayout() {
  useNowTicker();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-flight"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: process.env.EXPO_OS === "ios" ? [0.96] : [1.0],
            sheetGrabberVisible: false,
            sheetLargestUndimmedDetentIndex: "none",
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        />
        <Stack.Screen
          name="flight/[id]"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [0.58, 0.96],
            sheetInitialDetentIndex: 0,
            sheetGrabberVisible: false,
            sheetLargestUndimmedDetentIndex: "last",
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
