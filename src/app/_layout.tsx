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
            // 0.611 of the max detent height rests the sheet top at ~398pt on
            // a 874pt screen, matching the real Flighty panel measured on-device.
            sheetAllowedDetents: [0.611, 1.0],
            sheetInitialDetentIndex: 0,
            sheetGrabberVisible: false,
            sheetLargestUndimmedDetentIndex: "last",
            gestureEnabled: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="add-flight"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [1.0],
            sheetGrabberVisible: false,
            sheetLargestUndimmedDetentIndex: "none",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="flight/[id]"
          options={{
            presentation: "formSheet",
            // The screen's Stack.Toolbar (placement="right") re-enables the
            // native header for the close button; keep the bar itself invisible
            // so the in-content DetailHeader stays the visual header.
            headerTransparent: true,
            headerShadowVisible: false,
            title: "",
            // Same resting height as the (panel) sheet, matched to the real app.
            sheetAllowedDetents: [0.611, 1.0],
            sheetInitialDetentIndex: 0,
            sheetGrabberVisible: false,
            sheetLargestUndimmedDetentIndex: "last",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
