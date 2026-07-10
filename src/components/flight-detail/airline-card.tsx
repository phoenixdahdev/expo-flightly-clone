import { Text, View } from "react-native";

import { AirlineLogo } from "@/components/ui/airline-logo";
import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/constants/colors";
import type { Airline } from "@/data/types";
import { selectionHaptic } from "@/utils/haptics";
import { Pressable } from "react-native";

function ContactButton({ label }: { label: string }) {
  return (
    <Pressable
      onPress={selectionHaptic}
      style={({ pressed }) => ({
        flex: 1,
        height: 46,
        borderRadius: 12,
        borderCurve: "continuous",
        backgroundColor: colors.fieldBackground,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={{ fontSize: 14, fontWeight: "700", letterSpacing: 0.6, color: colors.label }}>
        {label}
      </Text>
    </Pressable>
  );
}

function CodeColumn({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.secondaryLabel }}>{label}</Text>
      <Text style={{ fontSize: 17, fontWeight: "700", color: colors.label }} selectable>
        {value}
      </Text>
    </View>
  );
}

export function AirlineCard({ airline }: { airline: Airline }) {
  return (
    <SectionCard style={{ marginHorizontal: 16, gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <AirlineLogo iata={airline.iata} size={44} />
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.label }}>
            {airline.name}
          </Text>
          {airline.alliance ? (
            <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>{airline.alliance}</Text>
          ) : null}
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ContactButton label="PHONE" />
          <ContactButton label="WEBSITE" />
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ContactButton label="X / TWITTER" />
          <ContactButton label="FACEBOOK" />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <CodeColumn label="ATC Callsign" value={airline.callsign} />
        <CodeColumn label="ICAO" value={airline.icao} />
        <CodeColumn label="IATA" value={airline.iata} />
      </View>
    </SectionCard>
  );
}
