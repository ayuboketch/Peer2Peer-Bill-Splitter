import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // <-- Correct import
import Dashboard from './src/screens/home/DashboardScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import StatusHeader from './src/screens/home/StatusBar';


export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
      <StatusHeader />
      <Dashboard />
      <HomeScreen />
      <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10, 6, 6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});