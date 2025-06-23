// Updated Dashboard component based on your instructions
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import StatusHeader from "./StatusBar";
import LineChart from "../../components/LineChart";
import { supabase } from "../../services/supabase/supabase";

const { width } = Dimensions.get("window");

const chartData = [
  { x: 0, y: 0 },
  { x: 40, y: 50 },
  { x: 80, y: 35 },
  { x: 120, y: 80 },
  { x: 160, y: 55 },
  { x: 200, y: 90 },
  { x: 240, y: 65 },
  { x: 280, y: 100 },
  { x: 60, y: 55 },
  { x: 20, y: 70 },
  { x: 40, y: 6 },
  { x: 80, y: 100 },
];

const fakeTransactions = [
  { id: 1, label: "Paid to John", amount: "-KES 500" },
  { id: 2, label: "Received from Alice", amount: "+KES 1,000" },
  { id: 3, label: "Buy Goods - Supermarket", amount: "-KES 2,300" },
  { id: 4, label: "Paid to Frida", amount: "-KES 500" },
  { id: 5, label: "Received from Mike", amount: "+KES 1,000" },
  { id: 6, label: "Buy Goods - Supermarket", amount: "-KES 2,300" },
  { id: 7, label: "Paid to Karine", amount: "-KES 500" },
  { id: 8, label: "Received from Neuton", amount: "+KES 1,000" },
  { id: 9, label: "Buy Goods - Supermarket", amount: "-KES 2,300" },
  { id: 10, label: "Paid to Alex", amount: "-KES 500" },
  { id: 11, label: "Received from Brian", amount: "+KES 1,000" },
  { id: 12, label: "Buy Goods - Supermarket", amount: "-KES 2,300" },
];

const [userName, setUserName] = useState<string>("");

useEffect(() => {
  const fetchUserProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("users") // your table name
        .select("name") // or whatever column holds the name
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setUserName(data.name);
      } else {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  fetchUserProfile();
}, []);

const Dashboard = () => {
  const [hideBalance, setHideBalance] = useState(false);
  const mpesaBalance = "29,890.50";
  const fulizaLimit = "15,000.00";
  const fulizaUsed = "2,450.00";
  const fulizaRemaining = (
    parseFloat(fulizaLimit.replace(/,/g, "")) -
    parseFloat(fulizaUsed.replace(/,/g, ""))
  ).toLocaleString();

  const dashAlert = () => alert("Feature coming soon!");

  return (
    <SafeAreaView style={styles.container}>
      <StatusHeader userName={userName} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCardContainer}>
          <View style={styles.backgroundCard}>
            <LineChart width={width - 40} height={120} data={chartData} />
          </View>
          <BlurView intensity={100} tint="dark" style={styles.balanceCard}>
            <View style={styles.balanceOverlay}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Your Balance</Text>
                <TouchableOpacity
                  onPress={() => setHideBalance(!hideBalance)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={hideBalance ? "eye-off" : "eye"}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount}>
                {hideBalance ? "••••••" : `KES ${mpesaBalance}`}
              </Text>
              <View style={styles.fulizaContainer}>
                <Text style={styles.fulizaLabel}>Fuliza Available</Text>
                <Text style={styles.fulizaAmount}>
                  {hideBalance ? "••••••" : `KES ${fulizaRemaining}`}
                </Text>
              </View>
            </View>
          </BlurView>
        </View>

        <View style={styles.mainActions}>
          <TouchableOpacity style={styles.primaryAction} onPress={dashAlert}>
            <View style={styles.primaryActionIcon}>
              <MaterialCommunityIcons
                name="account-group"
                size={28}
                color="#1F2937"
              />
            </View>
            <Text style={styles.primaryActionText}>Split Bills</Text>
            <Text style={styles.primaryActionSubtext}>
              Share expenses easily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryAction} onPress={dashAlert}>
            <View style={styles.primaryActionIcon}>
              <MaterialCommunityIcons name="store" size={28} color="#1F2937" />
            </View>
            <Text style={styles.primaryActionText}>Pay Bills</Text>
            <Text style={styles.primaryActionSubtext}>Paybill & Buy Goods</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secondaryGrid}>
          <TouchableOpacity style={styles.secondaryAction} onPress={dashAlert}>
            <View style={styles.secondaryActionIcon}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="white"
              />
            </View>
            <Text style={styles.secondaryActionText}>Track Expenses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={dashAlert}>
            <View style={styles.secondaryActionIcon}>
              <Ionicons name="stats-chart" size={24} color="white" />
            </View>
            <Text style={styles.secondaryActionText}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={dashAlert}>
            <View style={styles.secondaryActionIcon}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color="white"
              />
            </View>
            <Text style={styles.secondaryActionText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={dashAlert}>
            <View style={styles.secondaryActionIcon}>
              <Feather name="grid" size={24} color="white" />
            </View>
            <Text style={styles.secondaryActionText}>Quick Tools</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.secondaryGrid, { marginTop: 12 }]}>
          <TouchableOpacity style={styles.smallRoundBtn} onPress={dashAlert}>
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.smallBtnText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallRoundBtn} onPress={dashAlert}>
            <MaterialCommunityIcons name="hand-coin" size={20} color="white" />
            <Text style={styles.smallBtnText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallRoundBtn} onPress={dashAlert}>
            <Ionicons name="notifications" size={20} color="white" />
            <Text style={styles.smallBtnText}>Remind</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallRoundBtn} onPress={dashAlert}>
            <MaterialIcons name="more-horiz" size={20} color="white" />
            <Text style={styles.smallBtnText}>More</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Recent Transactions
          </Text>
          {fakeTransactions.map((tx) => (
            <View
              key={tx.id}
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "white", fontSize: 14 }}>{tx.label}</Text>
              <Text style={{ color: "#4ADE80", fontSize: 16 }}>
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 1)",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  balanceCardContainer: {
    position: "relative",
    marginBottom: 24,
    height: 220,
  },
  backgroundCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  balanceCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  balanceOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    fontWeight: "500",
  },
  eyeButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  balanceAmount: {
    color: "white",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 8,
  },
  fulizaContainer: {
    marginTop: 16,
  },
  fulizaLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "400",
  },
  fulizaAmount: {
    color: "#4ADE80",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  mainActions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: "#4ADE80",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#4ADE80",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  primaryActionIcon: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryActionText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  primaryActionSubtext: {
    color: "rgba(31, 41, 55, 0.7)",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
  secondaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  secondaryAction: {
    width: (width - 60) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  secondaryActionIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  secondaryActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  smallRoundBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    minWidth: 72,
  },
  smallBtnText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});

export default Dashboard;
