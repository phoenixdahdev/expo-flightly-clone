import * as Haptics from "expo-haptics";

export function tapHaptic() {
  if (process.env.EXPO_OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export function selectionHaptic() {
  if (process.env.EXPO_OS === "ios") {
    Haptics.selectionAsync();
  }
}

export function successHaptic() {
  if (process.env.EXPO_OS === "ios") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}
