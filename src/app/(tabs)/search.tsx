import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

/**
 * The native search tab item opens the Add Flight formSheet. Focus is handed
 * straight back to the My Flights tab so dismissing the sheet lands there
 * (deliberately not cleaned up on blur — the sheet presentation blurs this
 * screen before the timeout fires).
 */
export default function SearchTabScreen() {
  useFocusEffect(
    useCallback(() => {
      router.push("/add-flight");
      setTimeout(() => router.navigate("/(tabs)"), 50);
    }, [])
  );

  return <View style={{ flex: 1, backgroundColor: "#000" }} />;
}
