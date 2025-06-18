import React from "react";
import { StyleSheet, View } from 'react-native';
// Use the import type with resolution-mode for the type import
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack" with { "resolution-mode": "import" };
// Use require for the actual module import to avoid ESM/CommonJS mismatch
const { createNativeStackNavigator } = require("@react-navigation/native-stack");
import LoginSignUpScreen from "../screens/auth/LoginScreen";
import LandingScreen from "../screens/home/LandingScreen";
import DashboardScreen from "../screens/home/DashboardScreen";
import { RootStackParamList } from "./types";
import ProfileScreen from "../screens/profile/ProfileScreen"; // Keeping this import even if commented out in usage

const Stack = createNativeStackNavigator<RootStackParamList>(); // Add RootStackParamList for type safety

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginSignUpScreen}
        options={{ headerShown: false }} // <-- Add this line to hide the header
      />
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        // options={{ headerShown: false }} // <-- Uncomment this line if you also want to hide the header for Landing
      />
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        // options={{ headerShown: false }} // <-- Uncomment this line if you also want to hide the header for Dashboard
      />
    </Stack.Navigator>
  );
}