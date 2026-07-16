import { Text } from "react-native";

import { colors } from "@/constants/colors";

/**
 * Flighty-style rounded extra-bold title for the panel tabs. Rendered in
 * content because the native header is transparent (see PanelStack); the
 * paddingTop lines it up with the Stack.Toolbar buttons in the bar above.
 */
export function PanelTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: "ui-rounded",
        fontSize: 34,
        fontWeight: "800",
        color: colors.label,
        letterSpacing: -0.4,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 6,
      }}
    >
      {children}
    </Text>
  );
}
