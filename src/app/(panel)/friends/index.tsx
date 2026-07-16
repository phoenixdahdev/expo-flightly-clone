import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { FriendsTab } from "@/components/tabs/friends-tab";
import { PanelTitle } from "@/components/ui/panel-title";
import { renderProfileToolbarMenu } from "@/components/ui/profile-toolbar-item";
import { colors } from "@/constants/colors";
import { selectionHaptic, tapHaptic } from "@/utils/haptics";

export default function FriendsScreen() {
  const [tabFilter, setTabFilter] = useState<"friends" | "all">("friends");
  const [showEverywhere, setShowEverywhere] = useState(false);

  return (
    // collapsable={false}: see my-flights/index.tsx — blocks the formSheet
    // scroll-view frame coercion in react-native-screens.
    <View collapsable={false} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu
          icon="ellipsis"
          tintColor={colors.label}
          title="Customize Tab"
          accessibilityLabel="Customize Tab"
          separateBackground
        >
          <Stack.Toolbar.MenuAction
            isOn={tabFilter === "friends"}
            subtitle="Default"
            onPress={() => {
              selectionHaptic();
              setTabFilter("friends");
            }}
          >
            Friends
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction
            isOn={tabFilter === "all"}
            subtitle="Include your flights"
            onPress={() => {
              selectionHaptic();
              setTabFilter("all");
            }}
          >
            All Flights
          </Stack.Toolbar.MenuAction>
          {/* Inline submenu renders as a separated section, like Flighty's
              divider before Show Me Everywhere. */}
          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction
              isOn={showEverywhere}
              subtitle="Include your flights in every friend's filter"
              onPress={() => {
                selectionHaptic();
                setShowEverywhere((v) => !v);
              }}
            >
              Show Me Everywhere
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          tintColor={colors.label}
          accessibilityLabel="Share"
          separateBackground
          onPress={tapHaptic}
        />
        {renderProfileToolbarMenu()}
      </Stack.Toolbar>
      <PanelTitle>Friends</PanelTitle>
      <FriendsTab />
    </View>
  );
}
