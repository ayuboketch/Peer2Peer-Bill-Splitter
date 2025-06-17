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
import ProfileScreen from "../screens/profile/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginSignUpScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10, 6, 6)', // This background will be behind the navigator
    // You might remove alignItems and justifyContent if your navigator handles full screen content
    alignItems: 'center',
    justifyContent: 'center',
  },
});