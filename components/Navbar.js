import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme, StatusBar, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const HeaderBar = ({
  userName = 'User',
  profileImage,
  notificationCount = 0,
  onBellClick = () => {},
  onHistoryClick = () => {},
  onQrClick = () => {},
  forceDarkTheme = true, // Add this prop to force dark theme regardless of system setting
}) => {
  const [greeting, setGreeting] = useState('');
  const systemScheme = useColorScheme();
  const isDark = forceDarkTheme || systemScheme === 'dark';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Configure status bar for your app theme
  useEffect(() => {
    // Set status bar to light content (white icons) for dark backgrounds
    StatusBar.setBarStyle('light-content', true);
    // Set background color (works on Android)
    StatusBar.setBackgroundColor && StatusBar.setBackgroundColor('#000000', true);
  }, []);

  return (
    <>
      {/* Explicitly set StatusBar component for consistent behavior */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000000" 
        translucent={false}
      />
      
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>      
        <View style={styles.left}>
          <Image
            source={profileImage || { uri: 'https://via.placeholder.com/40' }}
            style={[styles.avatar, { borderColor: isDark ? '#fff' : '#000' }]}
          />
          <View>
            <Text style={[styles.greeting, { color: isDark ? '#ccc' : '#666' }]}>            
              {greeting},
            </Text>
            <Text style={[styles.name, { color: isDark ? '#fff' : '#111' }]}>          
              {userName.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.icons}>
          <TouchableOpacity onPress={onBellClick} style={styles.iconWrapper}>
            <MaterialIcons name="notifications" size={24} color={isDark ? '#fff' : '#000'} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onHistoryClick} style={styles.iconWrapper}>
            <MaterialIcons name="history" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onQrClick} style={styles.iconWrapper}>
            <MaterialIcons name="qr-code-scanner" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#000', // Default to black since you want dark theme
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10, // Simplified without platform check
  },
  left: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    margin: 12, 
    borderWidth: 1 
  },
  greeting: { 
    fontSize: 14 
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  icons: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconWrapper: { 
    marginHorizontal: 6 
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});