// src/screens/auth/LoginSignUpScreen.tsx
import React, { useEffect } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSupabase } from "../../hooks/useSupabase";
import { LinearGradient } from "expo-linear-gradient";
import { useLoginSignUp } from "../../hooks/useLoginSignUp";
import InputField from "../../components/common/Input";
import CustomButton from "../../components/common/Button";
import customBackIcon from "../../../assets/icons8-back-button-100.png";
import customNextIcon from "../../../assets/icons8-next-button-96.png";

const { width, height } = Dimensions.get("window");

const LoginSignUpScreen = () => {
  const { initializeSession } = useSupabase();
  const {
    currentView,
    message,
    formData,
    isLoading,
    rememberedUser,
    fadeAnim,
    scaleAnim,
    gradientAnim,
    handleInputChange,
    handleLogin,
    handleQuickLogin,
    handleSignupNext,
    handleCreateAccount,
    handleForgotPin,
    handleSwitchAccount,
    changeView,
    clearForm,
  } = useLoginSignUp();

  useEffect(() => {
    initializeSession();
  }, []);

  const renderContent = (): JSX.Element => {
    switch (currentView) {
      case "initial":
        return (
          <Animated.View
            style={[
              styles.contentContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.title}>Welcome to MSplit</Text>
            <View style={styles.initialButtonContainer}>
              <CustomButton
                title="Log In"
                onPress={() => changeView("login")}
                backgroundColor="#10B981"
              />
              <CustomButton
                title="Create Account"
                onPress={() => changeView("signup")}
                backgroundColor="#2563EB"
              />
            </View>
          </Animated.View>
        );

      case "quickLogin":
        return (
          <Animated.View
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                Logged in as: {rememberedUser}
              </Text>
              <InputField
                label="Enter PIN"
                value={formData.pin}
                onChangeText={(text) => handleInputChange("pin", text)}
                placeholder="••••"
                iconName="lock"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
              />
              {message ? (
                <Text
                  style={[
                    styles.message,
                    {
                      color: message.includes("success")
                        ? "#10B981"
                        : "#DC2626",
                    },
                  ]}
                >
                  {message}
                </Text>
              ) : null}
              <CustomButton
                title={isLoading ? "Logging in..." : "Login"}
                onPress={handleQuickLogin}
                backgroundColor="#10B981"
                disabled={isLoading}
              />
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={handleForgotPin}>
                  <Text style={styles.linkText}>I forgot my PIN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSwitchAccount}>
                  <Text style={styles.linkText}>Switch Account</Text>
                </TouchableOpacity>
              </View>
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#10B981"
                  style={styles.loader}
                />
              )}
            </ScrollView>
          </Animated.View>
        );

      case "login":
        return (
          <Animated.View
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Login</Text>
              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                placeholder="e.g., 0712345678"
                iconName="phone"
                keyboardType="phone-pad"
              />
              <InputField
                label="PIN"
                value={formData.pin}
                onChangeText={(text) => handleInputChange("pin", text)}
                placeholder="••••"
                iconName="lock"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
              />
              {message ? (
                <Text
                  style={[
                    styles.message,
                    {
                      color: message.includes("success")
                        ? "#10B981"
                        : "#DC2626",
                    },
                  ]}
                >
                  {message}
                </Text>
              ) : null}
              <CustomButton
                title={isLoading ? "Logging in..." : "Login"}
                onPress={handleLogin}
                backgroundColor="#10B981"
                disabled={isLoading}
              />
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={handleForgotPin}>
                  <Text style={styles.linkText}>I forgot my PIN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeView("signup")}>
                  <Text style={styles.linkText}>I don't have an account</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => changeView("initial")}>
                <Image source={customBackIcon} style={styles.backIcon} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#10B981"
                  style={styles.loader}
                />
              )}
            </ScrollView>
          </Animated.View>
        );

      case "signup":
        return (
          <Animated.View
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Sign Up</Text>
              <InputField
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="John Doe"
                iconName="user"
              />
              <InputField
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                placeholder="you@example.com"
                iconName="mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                label="Mobile Number"
                value={formData.mobileNumber}
                onChangeText={(text) => handleInputChange("mobileNumber", text)}
                placeholder="e.g., 0712345678"
                iconName="phone"
                keyboardType="phone-pad"
              />
              {message ? (
                <Text
                  style={[
                    styles.message,
                    {
                      color: message.includes("success")
                        ? "#10B981"
                        : message.includes("already in use") ||
                          message.includes("Try logging in")
                        ? "#F59E0B"
                        : "#DC2626",
                    },
                  ]}
                >
                  {message}
                </Text>
              ) : null}
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => changeView("initial")}>
                  <Image source={customBackIcon} style={styles.backIcon} />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSignupNext}
                  disabled={isLoading}
                >
                  <Image source={customNextIcon} style={styles.backIcon} />
                  <Text style={styles.backText}>
                    {isLoading ? "Checking..." : "Next"}
                  </Text>
                </TouchableOpacity>
              </View>
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  style={styles.loader}
                />
              )}
            </ScrollView>
          </Animated.View>
        );

      case "setupPin":
        return (
          <Animated.View
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Set Up Your PIN</Text>
              <Text style={styles.subtitle}>
                Create a 4-digit PIN to secure your account
              </Text>
              <InputField
                label="New PIN"
                value={formData.newPin}
                onChangeText={(text) => handleInputChange("newPin", text)}
                placeholder="••••"
                iconName="key"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
              />
              <InputField
                label="Confirm PIN"
                value={formData.confirmNewPin}
                onChangeText={(text) =>
                  handleInputChange("confirmNewPin", text)
                }
                placeholder="••••"
                iconName="lock"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
              />
              {message ? (
                <Text
                  style={[
                    styles.message,
                    {
                      color: message.includes("success")
                        ? "#10B981"
                        : "#DC2626",
                    },
                  ]}
                >
                  {message}
                </Text>
              ) : null}
              <View style={styles.buttonRow}>
                <CustomButton
                  title="Back"
                  onPress={() => changeView("signup")}
                  backgroundColor="#6B7280"
                  disabled={isLoading}
                />
                <CustomButton
                  title={isLoading ? "Creating..." : "Create Account"}
                  onPress={handleCreateAccount}
                  backgroundColor="#2563EB"
                  disabled={isLoading}
                />
              </View>
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  style={styles.loader}
                />
              )}
            </ScrollView>
          </Animated.View>
        );

      default:
        return <View />;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View style={styles.gradientContainer}>
        <Animated.View
          style={[
            styles.gradientWrapper,
            {
              transform: [
                {
                  translateX: gradientAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width * 0.5, width * 0.5],
                  }),
                },
                {
                  translateY: gradientAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-height * 0.2, height * 0.2],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#000000", "#1F2937", "#10B981", "#059669", "#000000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>
      </Animated.View>
      <View style={styles.content}>{renderContent()}</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
  },
  gradientWrapper: {
    width: width * 2,
    height: height * 1.5,
    position: "absolute",
    top: -height * 0.25,
    left: -width * 0.5,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 24,
  },
  initialButtonContainer: {
    width: "100%",
    gap: 24,
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  linkText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },
  backText: {
    color: "green",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },
  backIcon: {
    width: 54,
    height: 54,
    resizeMode: "contain",
    alignSelf: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    gap: 30,
  },
  loader: {
    marginTop: 10,
  },
});

// Add the default export
export default LoginSignUpScreen;
