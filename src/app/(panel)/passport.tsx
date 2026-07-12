import { View } from "react-native";

import { SheetHeader } from "@/components/my-flights/sheet-header";
import { PassportTab } from "@/components/tabs/passport-tab";

export default function PassportScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SheetHeader title="Passport" />
      <PassportTab />
    </View>
  );
}
