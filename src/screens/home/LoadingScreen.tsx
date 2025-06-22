import React, { useEffect, useRef } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Easing,
  ActivityIndicator,
} from "react-native";

const { width } = Dimensions.get("window");

const LoadingScreen = () => {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [slideAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MSplit</Text>
      <ActivityIndicator
        size="large"
        color="#25A973"
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.text}>Loading, please wait...</Text>
      <Animated.View
        style={[styles.bar, { transform: [{ translateX: slideAnim }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FFF9",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#25A973", // M-Pesa green
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 10,
  },
  bar: {
    width: 100,
    height: 4,
    backgroundColor: "#25A973",
    borderRadius: 2,
    marginTop: 20,
  },
});

export default LoadingScreen;
