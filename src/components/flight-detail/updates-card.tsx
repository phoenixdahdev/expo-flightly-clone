import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/constants/colors";

export interface FlightUpdate {
  title: string;
  timestamp: string;
}

export function UpdatesCard({ updates }: { updates: FlightUpdate[] }) {
  return (
    <SectionCard style={{ marginHorizontal: 16, gap: 12 }}>
      <View style={{ gap: 3 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: colors.label }}>Updates</Text>
        <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
          {updates.length} updates for this flight
        </Text>
      </View>
      <View>
        {updates.slice(0, 3).map((update, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: "#C7C7CC",
                  marginTop: 3,
                }}
              />
              {i < Math.min(updates.length, 3) - 1 && (
                <View style={{ flex: 1, width: 2, backgroundColor: "#E5E5EA" }} />
              )}
            </View>
            <View style={{ flex: 1, paddingBottom: i < 2 ? 16 : 0, gap: 2 }}>
              <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>
                {update.title}
              </Text>
              <Text style={{ fontSize: 14, color: colors.secondaryLabel }}>{update.timestamp}</Text>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}
