import { Text, TextStyle } from "react-native";

import { colors } from "@/constants/colors";

/** Renders `text` with the given [start,end) ranges painted blue. */
export function HighlightedText({
  text,
  ranges,
  style,
}: {
  text: string;
  ranges: [number, number][];
  style?: TextStyle;
}) {
  if (!ranges.length) return <Text style={style}>{text}</Text>;

  const parts: { str: string; hit: boolean }[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start > cursor) parts.push({ str: text.slice(cursor, start), hit: false });
    parts.push({ str: text.slice(start, end), hit: true });
    cursor = end;
  }
  if (cursor < text.length) parts.push({ str: text.slice(cursor), hit: false });

  return (
    <Text style={style}>
      {parts.map((p, i) => (
        <Text key={i} style={p.hit ? { color: colors.blue } : undefined}>
          {p.str}
        </Text>
      ))}
    </Text>
  );
}
