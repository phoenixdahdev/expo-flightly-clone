import { View, ViewStyle } from "react-native";

import { colors } from "@/constants/colors";

export function SectionCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.hairline,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </View>
  );
}
