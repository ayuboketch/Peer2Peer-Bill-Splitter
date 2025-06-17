import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native'; // <-- NEW IMPORT

import AuthNavigator from './src/navigation/AuthNavigator'; // <-- NEW IMPORT, assuming path

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer> {/* <-- Wrap your navigator here */}
        <AuthNavigator />    {/* <-- Render your AuthNavigator */}
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
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