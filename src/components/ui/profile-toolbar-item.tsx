import { Stack } from "expo-router";

import { selectionHaptic } from "@/utils/haptics";

/**
 * Avatar menu for the panel headers — mirrors Flighty's profile menu
 * (name/Edit Profile, Manage Friends, Settings). A native menu bar item
 * shares the toolbar's liquid-glass background like the other buttons.
 * Stack.Toolbar only accepts direct Toolbar.* elements as children, so this
 * is a render helper that pages call inline rather than a wrapping component.
 */
export function renderProfileToolbarMenu(onEditProfile?: () => void) {
  return (
    <Stack.Toolbar.Menu
      // Circular-cropped profile photo at 36pt: an image icon keeps the
      // avatar full-size in the bar (SF Symbol icons are locked to the
      // standard bar glyph size).
      icon={require("../../assets/profile-avatar.png")}
      iconRenderingMode="original"
      accessibilityLabel="Profile"
      separateBackground
    >
      <Stack.Toolbar.MenuAction
        icon={require("../../assets/profile-avatar.png")}
        iconRenderingMode="original"
        subtitle="Edit Profile"
        onPress={() => {
          selectionHaptic();
          onEditProfile?.();
        }}
      >
        Nathan Schroeder
      </Stack.Toolbar.MenuAction>
      <Stack.Toolbar.MenuAction icon="person.2.circle.fill" onPress={selectionHaptic}>
        Manage Friends
      </Stack.Toolbar.MenuAction>
      <Stack.Toolbar.MenuAction icon="gearshape" onPress={selectionHaptic}>
        Settings
      </Stack.Toolbar.MenuAction>
    </Stack.Toolbar.Menu>
  );
}
