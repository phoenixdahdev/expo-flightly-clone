import { View } from "react-native";

import { SheetHeader } from "@/components/my-flights/sheet-header";
import { FriendsTab } from "@/components/tabs/friends-tab";

export default function FriendsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SheetHeader title="Friends" showMenuButton />
      <FriendsTab />
    </View>
  );
}
