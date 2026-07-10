import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/constants/colors";

export function NotesCard({
  value,
  onChangeValue,
}: {
  value?: string;
  onChangeValue(value: string): void;
}) {
  const [draft, setDraft] = useState(value ?? "");

  return (
    <SectionCard style={{ marginHorizontal: 16, gap: 8, minHeight: 180 }}>
      <Text style={{ fontSize: 24, fontWeight: "800", color: colors.label }}>Notes</Text>
      <View style={{ height: 1, backgroundColor: colors.hairline }} />
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onBlur={() => onChangeValue(draft.trim())}
        placeholder="Tap to Edit"
        placeholderTextColor={colors.tertiaryLabel}
        multiline
        style={{ flex: 1, fontSize: 17, color: colors.label, textAlignVertical: "top" }}
      />
    </SectionCard>
  );
}
