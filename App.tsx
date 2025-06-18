import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native"; // <-- NEW IMPORT

import AuthNavigator from "./src/navigation/AuthNavigator"; // <-- NEW IMPORT, assuming path
import MainAppNavigator from "./src/navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true); // Default to true

  // This useEffect will check the user's status on app start
  useEffect(() => {
    async function checkUserStatus() {
      try {
        const userToken = await AsyncStorage.getItem("userToken"); // Check if a token exists
        const setupCompleted = await AsyncStorage.getItem("setupCompleted"); // Check for a setup flag

        if (userToken) {
          setIsAuthenticated(true);
          if (setupCompleted === "true") {
            setIsFirstTimeUser(false); // User logged in and completed setup
          } else {
            setIsFirstTimeUser(true); // User logged in, but might need to complete setup (go to Landing)
          }
        } else {
          setIsAuthenticated(false);
          setIsFirstTimeUser(true); // Not logged in, go to Login
        }
      } catch (error) {
        console.error("Failed to check user status:", error);
        setIsAuthenticated(false);
        setIsFirstTimeUser(true); // Fallback to login if error
      } finally {
        setIsLoading(false);
      }
    }

    checkUserStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated && !isFirstTimeUser ? (
          <MainAppNavigator /> // User is logged in and not first time, go to Dashboard
        ) : (
          <AuthNavigator /> // User is new or not logged in, go to Login
        )}
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
