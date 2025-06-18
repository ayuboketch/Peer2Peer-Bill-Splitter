// src/navigation/MainAppNavigator.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginSignUpScreen from "../screens/auth/LoginScreen";
import LandingScreen from "../screens/home/LandingScreen";
import DashboardScreen from "../screens/home/DashboardScreen";
import { RootStackParamList } from "./types";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainAppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      {" "}
      {/* Or whatever your main starting screen is */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />{" "}
      {/* Landing could be the setup screen after signup */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* Add other authenticated screens here */}
    </Stack.Navigator>
  );
}
