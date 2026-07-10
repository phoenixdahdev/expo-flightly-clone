import { RefObject } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

import { colors } from "@/constants/colors";
import { tapHaptic } from "@/utils/haptics";

export interface Chip {
  label: string;
  onPress?: () => void;
}

interface SearchFieldRowProps {
  chips: Chip[];
  query: string;
  placeholder: string;
  onChangeQuery(q: string): void;
  inputRef?: RefObject<TextInput | null>;
  editable?: boolean;
}

/** Gray rounded row holding selected-value chips + the live text input. */
export function SearchFieldRow({
  chips,
  query,
  placeholder,
  onChangeQuery,
  inputRef,
  editable = true,
}: SearchFieldRowProps) {
  return (
    <Animated.View
      layout={LinearTransition.duration(220)}
      style={{
        marginHorizontal: 20,
        marginTop: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      {chips.map((chip) => (
        <Animated.View
          key={chip.label}
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
        >
          <Pressable
            onPress={() => {
              tapHaptic();
              chip.onPress?.();
            }}
            style={({ pressed }) => ({
              backgroundColor: colors.fieldBackground,
              borderRadius: 14,
              borderCurve: "continuous",
              paddingHorizontal: 20,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: 20, fontWeight: "600", color: colors.label }}>
              {chip.label}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
      <Animated.View layout={LinearTransition.duration(220)} style={{ flex: 1 }}>
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={onChangeQuery}
          placeholder={placeholder}
          placeholderTextColor={colors.tertiaryLabel}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          editable={editable}
          style={{
            backgroundColor: colors.fieldBackground,
            borderRadius: 14,
            borderCurve: "continuous",
            paddingHorizontal: 16,
            height: 56,
            fontSize: 20,
            color: colors.label,
          }}
        />
      </Animated.View>
    </Animated.View>
  );
}
