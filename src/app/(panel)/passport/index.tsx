import { Stack } from "expo-router";
import { View } from "react-native";

import { PassportTab } from "@/components/tabs/passport-tab";
import { PanelTitle } from "@/components/ui/panel-title";
import { renderProfileToolbarMenu } from "@/components/ui/profile-toolbar-item";
import { colors } from "@/constants/colors";
import { tapHaptic } from "@/utils/haptics";

export default function PassportScreen() {
  return (
    // collapsable={false}: see my-flights/index.tsx — blocks the formSheet
    // scroll-view frame coercion in react-native-screens.
    <View collapsable={false} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          tintColor={colors.label}
          accessibilityLabel="Share"
          separateBackground
          onPress={tapHaptic}
        />
        {renderProfileToolbarMenu()}
      </Stack.Toolbar>
      <PanelTitle>Passport</PanelTitle>
      <PassportTab />
    </View>
  );
}
