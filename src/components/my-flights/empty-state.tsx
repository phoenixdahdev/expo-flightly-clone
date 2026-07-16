import { View } from "react-native";

import { InlineSearchGlyph, PanelEmptyState } from "@/components/ui/panel-empty-state";

export function EmptyState() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <PanelEmptyState title="Let’s Fly Somewhere">
        Tap <InlineSearchGlyph /> Search to add your next flight
      </PanelEmptyState>
    </View>
  );
}
