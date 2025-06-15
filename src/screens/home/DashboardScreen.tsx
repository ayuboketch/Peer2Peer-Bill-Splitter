import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const Dashboard = () => {
  const greeting = getGreeting();
  const userName = 'Ayub';
  const balance = 'KES 2,530.75';

  const dashAlert = () => alert('Feature coming soon!');

  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={50} tint="dark" style={styles.dashboardGlass}>
        <View style={styles.profileContainer}>
          <Image
            source={require('/workspace/Peer2Peer-Bill-Splitter/assets/man.png')}
            style={styles.avatar}
          />
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.balance}>{balance}</Text>
        </View>

        <View style={styles.cardRow}>
          <GlassCard label="Split Bill" onPress={dashAlert}>
            <Feather name="users" size={28} color="white" />
          </GlassCard>
          <GlassCard label="Pay Bill" onPress={dashAlert}>
            <Feather name="send" size={28} color="white" />
          </GlassCard>
          <GlassCard label="Quick Tools" onPress={dashAlert}>
            <Feather name="grid" size={28} color="white" />
          </GlassCard>
        </View>

        <View style={styles.toolsRow}>
          <GlassCard label="Track" onPress={dashAlert}>
            <Ionicons name="cash-outline" size={24} color="white" />
          </GlassCard>
          <GlassCard label="Reports" onPress={dashAlert}>
            <Ionicons name="stats-chart" size={24} color="white" />
          </GlassCard>
          <GlassCard label="Scan QR" onPress={dashAlert}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
          </GlassCard>
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

// ✅ Glass Card Component
const GlassCard = ({
  children,
  label,
  onPress,
}: {
  children: React.ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.glassCard} onPress={onPress}>
    <View style={styles.cardBefore} />
    {children}
    <Text style={styles.cardText}>{label}</Text>
  </TouchableOpacity>
);

// ✅ Greeting Utility
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Early Bird Mode ☀️';
  if (hour < 9) return 'Good Morning 🌅';
  if (hour < 12) return "It's Mid-Morning ☕";
  if (hour < 14) return "It's Lunchtime 🍛";
  if (hour < 18) return 'Good Afternoon ☀️';
  if (hour < 22) return 'Good Evening 🌇';
  return 'Time to Sleep 😴';
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  dashboardGlass: {
    borderRadius: 20,
    padding: 16,
    marginTop: 50,
    backgroundColor: 'rgba(61, 133, 46, 0.5)',
    borderWidth: 1,
    //borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 32,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 32,
    marginBottom: 8,
  },
  greeting: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  name: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  balance: {
    color: 'white',
    fontSize: 18,
    marginTop: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  glassCard: {
    width: (width - 60) / 3,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  cardBefore: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cardText: {
    color: 'white',
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Dashboard;
