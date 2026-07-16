import { Stack } from "expo-router";

/**
 * Per-tab stack for the panel sheet. Each NativeTabs tab wraps its screen in
 * one of these so the tab gets a native header — required for Stack.Toolbar
 * items (glass bar buttons + native menus) to render.
 *
 * The header is transparent with no native title: headerLargeTitle inside
 * formSheet → NativeTabs → Stack mispositions any scroll view under it
 * (UIKit's content-scroll-view linking), so pages render their own Flighty
 * title via PanelTitle and the native bar only hosts the toolbar items.
 */
export function PanelStack({ title }: { title: string }) {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title,
          headerTitle: "",
          headerTransparent: true,
          headerShadowVisible: false,
          // Stop UIKit (iOS 26) from adopting the tab's scroll view as the
          // header's content scroll view — inside this formSheet the linkage
          // stretches the scroll view full-screen, over the in-content title.
          scrollEdgeEffects: {
            top: "hidden",
            bottom: "hidden",
            left: "hidden",
            right: "hidden",
          },
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
    </Stack>
  );
}
