import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import Svg, { Ellipse, Path, Rect } from "react-native-svg";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import type { Aircraft } from "@/data/types";

/** Simple original side-view widebody illustration. */
function PlaneSideView() {
  return (
    <Svg width="100%" height={110} viewBox="0 0 340 110">
      {/* fuselage */}
      <Path
        d="M18 62 C30 50 60 44 110 43 L282 44 C304 46 318 52 322 58 C318 66 300 70 278 71 L60 71 C40 70 24 68 18 62 Z"
        fill="#F4F6F9"
        stroke="#C9D2DD"
        strokeWidth={1.5}
      />
      {/* nose shading */}
      <Path d="M18 62 C24 54 38 48 56 46 L56 70 C40 69 24 68 18 62 Z" fill="#E4E9F0" />
      {/* tail fin */}
      <Path d="M282 44 C290 30 300 20 312 16 L318 18 C314 32 310 44 306 50 Z" fill="#DFE6EE" stroke="#C9D2DD" strokeWidth={1} />
      {/* wing */}
      <Path d="M150 58 L210 92 L228 92 L186 56 Z" fill="#DDE4EC" stroke="#C9D2DD" strokeWidth={1} />
      {/* engine */}
      <Ellipse cx={170} cy={78} rx={16} ry={9} fill="#EDF1F6" stroke="#C9D2DD" strokeWidth={1.5} />
      {/* windows */}
      {Array.from({ length: 22 }).map((_, i) => (
        <Rect key={i} x={78 + i * 9.6} y={52} width={4} height={4} rx={2} fill="#9FB1C4" />
      ))}
      {/* cockpit */}
      <Path d="M34 55 C40 52 48 50 56 50 L56 56 L36 58 Z" fill="#7E93A9" />
    </Svg>
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
