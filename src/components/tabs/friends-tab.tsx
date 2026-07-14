import {
  Button,
  ContentUnavailableView,
  Host,
  HStack,
  Image,
  Spacer,
  Text as UiText,
} from "@expo/ui/swift-ui";
import {
  foregroundColor,
  font,
  glassEffect,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { selectionHaptic } from "@/utils/haptics";

type FriendsFilter = "everyone" | "today";

function IosChips({
  filter,
  onChangeFilter,
}: {
  filter: FriendsFilter;
  onChangeFilter(f: FriendsFilter): void;
}) {
  return (
    <Host matchContents style={{ width: "100%" }}>
      <HStack spacing={6}>
        <Button
          onPress={() => {
            selectionHaptic();
            onChangeFilter("everyone");
          }}
        >
          <UiText modifiers={[foregroundColor(colors.label), 
              font({ size: 17, weight: "semibold" }),
              padding({ vertical: 11, horizontal: 20 }),
              ...(filter === "everyone"
                ? [glassEffect({ shape: "capsule", glass: { variant: "regular", interactive: true } })]
                : []),
            ]}
          >
            Everyone
          </UiText>
        </Button>
        <Button
          onPress={() => {
            selectionHaptic();
            onChangeFilter("today");
          }}
        >
          <UiText modifiers={[foregroundColor(filter === "today" ? colors.label : colors.secondaryLabel), 
              font({ size: 17, weight: "medium" }),
              padding({ vertical: 11, horizontal: 14 }),
              ...(filter === "today"
                ? [glassEffect({ shape: "capsule", glass: { variant: "regular", interactive: true } })]
                : []),
            ]}
          >
            Today
          </UiText>
        </Button>
        <Button onPress={selectionHaptic}>
          <HStack spacing={7} modifiers={[padding({ vertical: 11, horizontal: 8 })]}>
            <Image systemName="plus.circle.fill" size={26} color={colors.blue} />
            <UiText modifiers={[foregroundColor(colors.blue), font({ size: 17, weight: "semibold" })]}>
              Add Friend
            </UiText>
          </HStack>
        </Button>
        <Spacer />
      </HStack>
    </Host>
  );
}

function FallbackChips({
  filter,
  onChangeFilter,
}: {
  filter: FriendsFilter;
  onChangeFilter(f: FriendsFilter): void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      {(["everyone", "today"] as const).map((key) => (
        <Pressable
          key={key}
          onPress={() => onChangeFilter(key)}
          style={{
            paddingVertical: 11,
            paddingHorizontal: key === "everyone" ? 20 : 14,
            borderRadius: 999,
            backgroundColor: filter === key ? "#FFFFFF" : "transparent",
            boxShadow: filter === key ? "0 2px 8px rgba(0,0,0,0.13)" : undefined,
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>
            {key === "everyone" ? "Everyone" : "Today"}
          </Text>
        </Pressable>
      ))}
      <Text style={{ fontSize: 17, fontWeight: "600", color: colors.blue, paddingLeft: 8 }}>
        + Add Friend
      </Text>
    </View>
  );
}

export function FriendsTab() {
  const [filter, setFilter] = useState<FriendsFilter>("everyone");

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 14, paddingTop: 2 }}>
        {process.env.EXPO_OS === "ios" ? (
          <IosChips filter={filter} onChangeFilter={setFilter} />
        ) : (
          <FallbackChips filter={filter} onChangeFilter={setFilter} />
        )}
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 60,
          paddingHorizontal: 24,
        }}
      >
        {process.env.EXPO_OS === "ios" ? (
          <Host style={{ width: "100%", height: 180 }}>
            <ContentUnavailableView
              title="Add Friends' Flights"
              description="Add a Flighty friend to see their flights automatically, or tap Search to add a flight"
            />
          </Host>
        ) : (
          <View style={{ alignItems: "center", gap: 8, paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 21, fontWeight: "700", color: colors.secondaryLabel }}>
              Add Friends&apos; Flights
            </Text>
            <Text
              style={{ fontSize: 16, color: colors.secondaryLabel, textAlign: "center" }}
            >
              Add a Flighty friend to see their flights automatically, or tap Search to add
              a flight
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
