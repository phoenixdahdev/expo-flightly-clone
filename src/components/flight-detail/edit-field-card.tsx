import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";
import { selectionHaptic } from "@/utils/haptics";

interface EditFieldCardProps {
  icon: Parameters<typeof SfSymbol>[0]["name"];
  title: string;
  value?: string;
  badge?: string;
  onChangeValue(value: string): void;
}

/** "Booking Code" / "Seat" card — tap to edit inline, persisted to the store. */
export function EditFieldCard({ icon, title, value, badge, onChangeValue }: EditFieldCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const commit = () => {
    setEditing(false);
    onChangeValue(draft.trim());
  };

  return (
    <Pressable
      onPress={() => {
        selectionHaptic();
        setEditing(true);
      }}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.hairline,
        padding: 16,
        gap: 10,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <SfSymbol name={icon} size={24} tintColor={colors.label} />
        {badge ? (
          <View
            style={{
              backgroundColor: "#E3EEFE",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: colors.blue }}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={{ gap: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.label }}>{title}</Text>
        {editing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onBlur={commit}
            onSubmitEditing={commit}
            autoFocus
            autoCapitalize="characters"
            style={{ fontSize: 15, color: colors.label, padding: 0 }}
          />
        ) : (
          <Text style={{ fontSize: 15, color: value ? colors.label : colors.secondaryLabel }}>
            {value || "Tap to Edit"}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
