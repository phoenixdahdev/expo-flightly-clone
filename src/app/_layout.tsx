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
        <Stack.Screen name="index" />
        <Stack.Screen
          name="(panel)"
          options={{
            // The Flighty home panel: a persistent, non-dismissible sheet over
            // the globe. gestureEnabled:false maps to isModalInPresentation so
            // it can be dragged between detents but never swiped away, and the
            // undimmed detents keep the map interactive behind it.
            presentation: "formSheet",
            sheetAllowedDetents: process.env.EXPO_OS === "ios" ? [0.57, 0.95] : [1.0],
            sheetInitialDetentIndex: 0,
            sheetGrabberVisible: false,
            sheetLargestUndimmedDetentIndex: "last",
            sheetCornerRadius: 40,
            gestureEnabled: false,
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        />
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
