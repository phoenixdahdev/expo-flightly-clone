import { View } from "react-native";

import { FlightGlobe } from "@/components/globe/flight-globe";
import { HomePanel } from "@/components/home-panel";
import { SheetHeader } from "@/components/my-flights/sheet-header";
import { PassportTab } from "@/components/tabs/passport-tab";

export default function PassportScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <FlightGlobe />
      </View>
      <HomePanel>
        <SheetHeader title="Passport" />
        <PassportTab />
      </HomePanel>
    </View>
  );
}
