// src/components/StatusHeader.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function StatusHeader({ userName }: { userName: string }) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Early bird! Let's go 💪";
    if (hour < 9) return "Good morning, ready to conquer? ☀️";
    if (hour < 12) return "Mid-morning hustle ☕";
    if (hour < 14) return "It's lunchtime! 🍽️";
    if (hour < 18) return "Good afternoon, keep going! 🌤️";
    if (hour < 21) return "Good evening, unwind a little ✨";
    if (hour < 24) return "It's time to rest 💤";
    return "Almost midnight, dream big 🌙";
  };

  const FeatureAlert = () => {
    alert("Feature coming soon!");
  };

  return (
    <BlurView
      intensity={60}
      tint="dark"
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={32} color="#4ADE80" />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.greeting}>Hi, {userName || "..."}</Text>
          </View>
        </View>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={FeatureAlert}>
            <MaterialCommunityIcons name="cash-fast" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={FeatureAlert}>
            <Feather name="bell" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={FeatureAlert}>
            <Ionicons name="qr-code-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderTopWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.9,
  },
  userName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});
