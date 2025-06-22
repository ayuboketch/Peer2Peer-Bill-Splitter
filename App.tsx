// App.tsx
import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AuthNavigator from "./src/navigation/AuthNavigator";
import MainAppNavigator from "./src/navigation/AppNavigator";
import { supabase } from "./src/services/supabase/supabase";
import LandingScreen from "./src/screens/home/LandingScreen";

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#10B981" />
    <Text style={{ marginTop: 10 }}>Loading...</Text>
  </View>
);

function AppContent() {
  const { loading, isAuthenticated, user } = useAuth();
  const [isFirstTimeUser, setIsFirstTimeUser] = React.useState(true);
  const [hasCompletedLanding, setHasCompletedLanding] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      supabase
        .from("users")
        .select("is_first_time")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.is_first_time !== undefined) {
            setIsFirstTimeUser(data.is_first_time);
          }
        });

      AsyncStorage.getItem("landingCompleted").then((landing) => {
        setHasCompletedLanding(landing === "true");
      });
    }
  }, [user]);

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) return <AuthNavigator />;

  if (isFirstTimeUser && !hasCompletedLanding) {
    return (
      <LandingScreen
        onComplete={async () => {
          await AsyncStorage.setItem("landingCompleted", "true");
          setHasCompletedLanding(true);
          await supabase
            .from("users")
            .update({ is_first_time: false })
            .eq("id", user.id);
        }}
      />
    );
  }

  return <MainAppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
