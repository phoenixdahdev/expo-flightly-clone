import { Text, View } from "react-native";

import { SfSymbol } from "@/components/ui/symbol";
import { colors } from "@/constants/colors";

export function StatusBanner({
  headlinePrefix,
  headlineEmphasis,
  body,
}: {
  headlinePrefix: string;
  headlineEmphasis: string;
  body: string;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.greenBannerBg,
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 4,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.label }}>
        {headlinePrefix}
        <Text style={{ color: colors.green }}>{headlineEmphasis}</Text>
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={{ flex: 1, fontSize: 16, color: colors.label, lineHeight: 22 }}>
          {body}
        </Text>
        <SfSymbol name="chevron.right" size={14} tintColor={colors.secondaryLabel} weight="semibold" />
      </View>
    </View>
  );
}
