import React, { useEffect } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from './components/Navbar';
import { MainScreen } from './components/MainScreen';

export default function App() {
  useEffect(() => {
    // Configure status bar globally for dark theme
    StatusBar.setBarStyle('light-content', true);
    
    // Android-specific status bar configuration
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#000000', true);
      // Optional: Hide the status bar background for immersive experience
      // StatusBar.setTranslucent(true);
    }
  }, []);

  return (
    <SafeAreaProvider>
      {/* Global StatusBar component for consistent behavior */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000000" 
        translucent={false}
      />
      
      <SafeAreaView style={styles.container}>
        <HeaderBar
          userName="John Doe"
          profileImage={require('./assets/avatar.png')}
          notificationCount={3}
          onBellClick={() => alert('Notifications')}
          onHistoryClick={() => alert('History')}
          onQrClick={() => alert('Scan QR')}
          forceDarkTheme={true} // Force dark theme
        />
        
        <MainScreen 
          balance={12500.50}
          fuliza={500.00}
          activeTab="HOME"
          onNavigate={(tab) => {
            console.log('Navigate to:', tab);
            // Add your navigation logic here
            // Example: navigation.navigate(tab);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Consistent dark background
  },
});