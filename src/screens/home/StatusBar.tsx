// src/components/StatusHeader.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function StatusHeader() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Early bird! Let's go 💪";
    if (hour < 9) return "Good morning, ready to conquer? ☀️";
    if (hour < 12) return "Mid-morning hustle ☕";
    if (hour < 14) return "It’s lunchtime! 🍽️";
    if (hour < 18) return "Good afternoon, keep going! 🌤️";
    if (hour < 21) return "Good evening, unwind a little ✨";
    if (hour < 24) return "It’s time to rest 💤";
    return "Almost midnight, dream big 🌙";
  };
  const FeatureAlert = () => {
    alert("Feature coming soon!");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.leftSection}>
        <Ionicons
          name="person-circle-outline"
          source={require("../../../assets/man.png")}
          size={28}
          color="white"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.greeting}>{getGreeting()}</Text>
      </View>

      <View style={styles.rightIcons}>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="cash-fast"
            size={22}
            color="white"
            style={styles.icon}
            on={FeatureAlert}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather
            name="sun"
            size={22}
            color="white"
            style={styles.icon}
            on={FeatureAlert}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="qr-code-outline"
            size={22}
            color="white"
            style={styles.icon}
            on={FeatureAlert}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 100,
    backgroundColor: "rgba(61, 133, 46, 0.5)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        backdropFilter: "blur(20px)",
      },
    }),
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 16,
  },
});
