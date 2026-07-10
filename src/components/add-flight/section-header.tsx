import { Text } from "react-native";

import { colors } from "@/constants/colors";

export function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.8,
        color: colors.secondaryLabel,
        paddingHorizontal: 20,
        paddingTop: 26,
        paddingBottom: 4,
      }}
    >
      {title}
    </Text>
  );
}
