import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";

export function Hairline({ inset = 0 }: { inset?: number }) {
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.hairline,
        marginLeft: inset,
      }}
    />
  );
}
