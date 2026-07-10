import { useWindowDimensions, View } from "react-native";

/**
 * The Flighty-style rounded panel anchored over the globe's lower portion.
 * The native tab bar floats over its bottom edge; content should pad for it.
 */
export function HomePanel({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions();

  return (
    <View
      pointerEvents="box-none"
      style={{ flex: 1, justifyContent: "flex-end" }}
    >
      <View
        style={{
          height: height * 0.57,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          borderCurve: "continuous",
          overflow: "hidden",
          boxShadow: "0 -6px 30px rgba(0,0,0,0.25)",
        }}
      >
        {children}
      </View>
    </View>
  );
}
