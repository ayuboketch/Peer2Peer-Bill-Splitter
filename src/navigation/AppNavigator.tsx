// src/navigation/AppNavigator.tsx

import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "../services/supabase/auth";

// Import your screens
import LoginSignUpScreen from "../screens/auth/LoginScreen";
import MainTabNavigator from "./MainNavigator"; // Your main app navigator
import LoadingScreen from "../screens/home/LoadingScreen"; // Create this screen

export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
  Loading: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const isLoggedIn = await AuthService.isLoggedIn();
      setIsAuthenticated(isLoggedIn);
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen
          name="MainApp"
          component={MainTabNavigator}
          options={{ gestureEnabled: false }}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={LoginSignUpScreen}
          options={{ gestureEnabled: false }}
        />
      )}
    </Stack.Navigator>
  );
}
