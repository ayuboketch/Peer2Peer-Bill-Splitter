import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Displays the user's balance with toggle to show/hide,
 * a Fuliza amount, and quick-action icons.
 */
export const BalanceSection = ({
  balance = 0.0,
  fuliza = 0.0,
}) => {
  const [hidden, setHidden] = useState(false);

  const handleAction = (label) => () => {
    Alert.alert(label, 'This feature is empty for now.');
  };

  const appData = [
    { label: 'Ziidi', icon: require('../assets/ziidi.png') },
    { label: 'Mali', icon: require('../assets/Mali.png') },
    { label: 'M-Shwari', icon: require('../assets/mshwari.png') },
    { label: 'KCB M-PESA', icon: require('../assets/kcb.png') },
    { label: 'Business', icon: require('../assets/business.jpg') },
    { label: 'Insurance', icon: require('../assets/insurance.jpg') },
    { label: 'Loans', icon: require('../assets/loan.png') },
    { label: 'Savings', icon: require('../assets/savings.jpg') },
  ];

  const AppGridSection = ({ title, apps }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => Alert.alert('View all', 'This feature is empty for now.')}>
          <Text style={styles.seeAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.appsRow}>
        {apps.map((app) => (
          <View style={styles.appIconContainer} key={app.label}>
            <Image source={app.icon} style={styles.appIcon} />
            <Text style={styles.appLabel}>{app.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const groupedApps = [];
  for (let i = 0; i < appData.length; i += 4) {
    groupedApps.push(appData.slice(i, i + 4));
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.label}>Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.currency}>Ksh. </Text>
          <Text style={styles.amount}>
            {hidden ? '•••••' : balance.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            style={styles.eyeButton}
          >
            <MaterialIcons
              name={hidden ? 'visibility-off' : 'visibility'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.fuliza}>
          Available FULIZA: Ksh {fuliza.toFixed(2)}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        {[
          { icon: 'sync-alt', label: 'Send and Request' },
          { icon: 'payment', label: 'Pay' },
          { icon: 'arrow-downward', label: 'Withdraw' },
          { icon: 'smartphone', label: 'Airtime' },
        ].map(({ icon, label }) => (
          <TouchableOpacity
            key={label}
            style={styles.action}
            onPress={handleAction(label)}
          >
            <MaterialIcons name={icon} size={28} color="#00acee" />
            <Text style={styles.actionLabel}>{label.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions and Ads */}
      <View style={styles.sectionContainer}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>M-PESA STATEMENTS</Text>
          <TouchableOpacity onPress={() => Alert.alert('See All', 'This feature is empty for now.')}>
            <Text style={styles.seeAll}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.transactionRow}
          onPress={() => Alert.alert('CHICKEN STORE', 'Transaction details coming soon.')}
        >
          <View style={styles.transactionLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>CS</Text>
            </View>
            <View>
              <Text style={styles.storeName}>CHICKEN STORE</Text>
              <Text style={styles.transactionDate}>24 May, 07:44 PM</Text>
            </View>
          </View>
          <Text style={styles.transactionAmount}>- KSH. 170.00</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4]}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.adCard}>
            <Text style={styles.adText}>Swipe Ad {item}</Text>
          </View>
        )}
        contentContainerStyle={styles.adSlider}
      />

      {groupedApps.map((apps, index) => (
        <AppGridSection key={index} title={index === 0 ? 'Financial Services' : 'More Services'} apps={apps} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#121212',
    padding: 16,
    flex: 1,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currency: {
    color: '#fff',
    fontSize: 24,
  },
  amount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  eyeButton: {
    marginLeft: 8,
  },
  fuliza: {
    color: '#4da6ff',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  action: {
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transactionTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  seeAll: {
    color: '#00cc66',
    fontWeight: '500',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#000',
    fontWeight: 'bold',
  },
  storeName: {
    color: '#fff',
    fontWeight: '500',
  },
  transactionDate: {
    color: '#aaa',
    fontSize: 12,
  },
  transactionAmount: {
    color: '#fff',
    fontWeight: '600',
  },
  adSlider: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  adCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    width: 280,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adText: {
    color: '#fff',
    fontWeight: '600',
  },
  appsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  appIconContainer: {
    alignItems: 'center',
    width: 64,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  appLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
