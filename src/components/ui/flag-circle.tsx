import { Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { flagEmoji } from "@/data/airports";

export function FlagCircle({ countryCode, size = 30 }: { countryCode: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.fieldBackground,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Text style={{ fontSize: size * 0.72, lineHeight: size }}>
        {flagEmoji(countryCode)}
      </Text>
    </View>
  );
}
