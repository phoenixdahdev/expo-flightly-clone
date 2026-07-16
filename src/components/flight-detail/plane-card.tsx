import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, useWindowDimensions, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import type { Aircraft } from "@/data/types";

function PlaneSideView() {
  const { width } = useWindowDimensions();
  // Card inner width: 16pt screen margin ×2 + 18pt card padding ×2.
  const planeWidth = width - 68;
  return (
    <Image
      source={require("../../../assets/images/plane-side/AC-plane-side.png")}
      style={{
        alignSelf: "center",
        width: planeWidth,
        // Explicit height, not aspectRatio: see image-aspectratio-ignored-fabric.
        height: Math.round((planeWidth * 259) / 789),
        marginTop: 10,
      }}
      resizeMode="contain"
    />
  );
}

export function PlaneCard({ aircraft }: { aircraft: Aircraft }) {
  const firstFlightYear = Number(aircraft.firstFlightISO.slice(0, 4));
  const firstFlightDate = new Date(aircraft.firstFlightISO);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const age = new Date().getFullYear() - firstFlightYear;

  return (
    <View
      style={{
        marginHorizontal: 16,
        borderRadius: 16,
        borderCurve: "continuous",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.hairline,
      }}
    >
      <LinearGradient colors={["#3D6FD9", "#8FB4EC", "#E8F1FB"]} style={{ padding: 18, gap: 3 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#FFFFFF" }}>
            Where&apos;s My Plane?
          </Text>
        </View>
        <Text style={{ fontSize: 17, fontWeight: "700", color: "#DCEBFF" }}>
          {aircraft.type} • {aircraft.registration}
        </Text>
        <Text style={{ fontSize: 14, color: "#EAF3FF" }}>
          First Flight:{" "}
          {`${months[firstFlightDate.getUTCMonth()]} ${firstFlightDate.getUTCDate()}, ${firstFlightYear}`}{" "}
          • {age} years old
        </Text>
        <PlaneSideView />
      </LinearGradient>
      <View style={{ backgroundColor: "#FFFFFF", padding: 16, gap: 10 }}>
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: colors.green,
            borderRadius: 8,
            borderCurve: "continuous",
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <SfSymbol name="checkmark.circle" size={14} tintColor="#FFFFFF" weight="bold" />
          <Text style={{ fontSize: 13, fontWeight: "800", letterSpacing: 0.5, color: "#FFFFFF" }}>
            NO ISSUE
          </Text>
        </View>
        <Text style={{ fontSize: 16, color: colors.label, lineHeight: 22 }}>
          Looking good! The aircraft is en route with only very minor delays.
        </Text>
      </View>
    </View>
  );
}
