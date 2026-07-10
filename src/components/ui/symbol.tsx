import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { Text } from "react-native";

// Minimal Android/text fallbacks for the SF Symbols we use.
const FALLBACK_GLYPHS: Record<string, string> = {
  magnifyingglass: "⌕",
  "square.and.arrow.up": "⮭",
  xmark: "✕",
  map: "▦",
  cloud: "☁",
  "cloud.fill": "☁",
  airplane: "✈",
  "arrow.up.right": "↗",
  "arrow.down.right": "↘",
  "chevron.down": "⌄",
  "chevron.right": "›",
  "person.crop.circle.fill": "●",
  bell: "🔔",
  "bell.slash": "🔕",
  ellipsis: "…",
  eye: "👁",
  "arrow.right": "→",
  "arrow.uturn.right": "↪",
  calendar: "▣",
  "point.topleft.down.curvedto.point.bottomright.up": "∿",
  ticket: "▭",
  clock: "◷",
  "moon.fill": "☾",
  checkmark: "✓",
  "checkmark.circle": "✓",
  location: "➤",
  "arrow.down.right.and.arrow.up.left": "⤡",
  plus: "+",
};

interface SfSymbolProps {
  name: SymbolViewProps["name"];
  size?: number;
  tintColor?: string;
  weight?: SymbolWeight;
}

// NOTE: deliberately NOT named `Symbol` — that would shadow the global Symbol,
// which React Compiler output relies on (Symbol.for("react.memo_cache_sentinel")).
export function SfSymbol({ name, size = 17, tintColor = "#111", weight = "regular" }: SfSymbolProps) {
  if (process.env.EXPO_OS === "ios") {
    return (
      <SymbolView
        name={name}
        size={size}
        tintColor={tintColor}
        weight={weight}
        resizeMode="scaleAspectFit"
      />
    );
  }
  return (
    <Text style={{ fontSize: size * 0.9, color: tintColor, textAlign: "center" }}>
      {FALLBACK_GLYPHS[name as string] ?? "●"}
    </Text>
  );
}
