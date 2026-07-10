import { Button, Host, HStack, Image, Spacer, Text as UiText } from "@expo/ui/swift-ui";
import { background, clipShape, font, foregroundColor, padding } from "@expo/ui/swift-ui/modifiers";
import { Text, View } from "react-native";

import { IconCircle } from "@/components/ui/icon-circle";
import { colors } from "@/constants/colors";
import { tapHaptic } from "@/utils/haptics";

interface SheetHeaderProps {
  title: string;
  showMenuButton?: boolean;
  onDevSeed?: () => void;
}

function IosHeader({ title, showMenuButton, onDevSeed }: SheetHeaderProps) {
  return (
    <Host matchContents style={{ width: "100%" }}>
      <HStack spacing={10} modifiers={[padding({ horizontal: 20, top: 18, bottom: 6 })]}>
        <UiText modifiers={[foregroundColor(colors.label), font({ size: 34, weight: "bold" })]}>
          {title}
        </UiText>
        <Spacer />
        {showMenuButton ? (
          <Button onPress={tapHaptic}>
            <Image
              systemName="ellipsis"
              size={17}
              color={colors.label}
              modifiers={[
                padding({ all: 13 }),
                background(colors.fieldBackground),
                clipShape("circle"),
              ]}
            />
          </Button>
        ) : null}
        <Button onPress={tapHaptic}>
          <Image
            systemName="square.and.arrow.up"
            size={17}
            color={colors.label}
            modifiers={[
              padding({ all: 13 }),
              background(colors.fieldBackground),
              clipShape("circle"),
            ]}
          />
        </Button>
        <Button onPress={() => onDevSeed?.()}>
          <Image
            systemName="person.crop.circle.fill"
            size={42}
            color="#C7C7CC"
          />
        </Button>
      </HStack>
    </Host>
  );
}

function FallbackHeader({ title, showMenuButton, onDevSeed }: SheetHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 6,
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "800", color: colors.label, letterSpacing: -0.5 }}>
        {title}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {showMenuButton ? <IconCircle icon="ellipsis" size={42} iconSize={17} /> : null}
        <IconCircle icon="square.and.arrow.up" size={42} iconSize={17} />
        <IconCircle
          icon="person.crop.circle.fill"
          size={42}
          iconSize={40}
          backgroundColor="transparent"
          tintColor="#C7C7CC"
          onPress={onDevSeed}
        />
      </View>
    </View>
  );
}

export function SheetHeader(props: SheetHeaderProps) {
  return process.env.EXPO_OS === "ios" ? <IosHeader {...props} /> : <FallbackHeader {...props} />;
}
