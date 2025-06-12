export default {
  expo: {
    name: "MSplit",
    slug: "msplit-kenya",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1a365d"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.msplit.kenya"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1a365d"
      },
      package: "com.msplit.kenya",
      permissions: [
        "READ_CONTACTS",
        "SEND_SMS",
        "RECEIVE_SMS",
        "CAMERA",
        "READ_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-contacts",
      "expo-sms",
      "expo-camera",
      "expo-image-picker",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
};