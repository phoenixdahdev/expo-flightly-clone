import { router } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function PanelTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="my-flights">
        <NativeTabs.Trigger.Icon sf={{ default: "airplane", selected: "airplane" }} md="flight" />
        <NativeTabs.Trigger.Label>My Flights</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="friends">
        <NativeTabs.Trigger.Icon sf={{ default: "person.2", selected: "person.2.fill" }} md="group" />
        <NativeTabs.Trigger.Label>Friends</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="passport">
        <NativeTabs.Trigger.Icon
          sf={{ default: "wallet.pass", selected: "wallet.pass.fill" }}
          md="badge"
        />
        <NativeTabs.Trigger.Label>Passport</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      {/* Acts as a plain button: `disabled` makes the native side skip tab
          selection while still emitting tabPress, which opens the sheet. */}
      <NativeTabs.Trigger
        name="search"
        role="search"
        disabled
        listeners={{ tabPress: () => router.push("/add-flight") }}
      >
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
