import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Flighty Clone",
  slug: "flighty-clone",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "flightyclone",
  userInterfaceStyle: "light",
  ios: {
    icon: "./assets/expo.icon",
    bundleIdentifier: "dev.expo.flightyclone",
    supportsTablet: false,
  },
  android: {
    package: "dev.expo.flightyclone",
    softwareKeyboardLayoutMode: "resize",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#000000",
        image: "./assets/images/splash-icon.png",
        imageWidth: 76,
      },
    ],
    [
      "@rnmapbox/maps",
      {
        // Native SDK downloads no longer require auth (Maps SDK >= 11.4).
        // Wire the token through only if one is provided for pinned older versions.
        ...(process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN
          ? { RNMapboxMapsDownloadToken: process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN }
          : {}),
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
