import { View } from "react-native";

import { FlightGlobe } from "@/components/globe/flight-globe";
import { HomePanel } from "@/components/home-panel";
import { SheetHeader } from "@/components/my-flights/sheet-header";
import { FriendsTab } from "@/components/tabs/friends-tab";

export default function FriendsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <FlightGlobe />
      </View>
      <HomePanel>
        <SheetHeader title="Friends" showMenuButton />
        <FriendsTab />
      </HomePanel>
    </View>
  );
}
