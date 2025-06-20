import React, { useState, useEffect, useRef, useCallback, JSX } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// Import your preferred icon library - using react-native-vector-icons
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { supabase } from "../../services/supabase/supabase";

// Peer2Peer-Bill-Splitter/src/services/supabase/supabase.ts
// Peer2Peer-Bill-Splitter/src/screens/auth/LoginScreen.tsx

// Types
type ViewType = "initial" | "login" | "signup" | "setupPin";

interface FormData {
  phoneNumber: string;
  pin: string;
  name: string;
  email: string;
  mobileNumber: string;
  newPin: string;
  confirmNewPin: string;
}

const { width, height } = Dimensions.get("window");
const customBackIcon = require("../../../assets/icons8-back-button-100.png");
const customNextIcon = require("../../../assets/icons8-next-button-96.png");

// Icon component using react-native-vector-icons with valid Feather icons
const IconComponent: React.FC<{ name: string; size?: number; color?: string }> =
  React.memo(({ name, size = 24, color = "#6B7280" }) => {
    return <Icon name={name} size={size} color={color} />;
  });

// Input field component - moved outside to prevent recreation
const InputField: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  iconName: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  maxLength?: number;
  focusColor?: string;
}> = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    iconName,
    secureTextEntry = false,
    keyboardType = "default",
    maxLength,
    focusColor = "#10B981",
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View
          style={[
            styles.inputWrapper,
            isFocused && { borderColor: focusColor, shadowColor: focusColor },
          ]}
        >
          <IconComponent
            name={iconName}
            size={20}
            color={isFocused ? focusColor : "#6B7280"}
          />
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </View>
    );
  }
);

// Button component with valid Feather icons - moved outside to prevent recreation
const CustomButton: React.FC<{
  title: string;
  onPress: () => void;
  backgroundColor: string;
  iconName?: string;
  iconPosition?: "left" | "right";
  style?: any;
}> = React.memo(
  ({
    title,
    onPress,
    backgroundColor,
    iconName,
    iconPosition = "left",
    style,
  }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {iconName && iconPosition === "left" && (
        <IconComponent name={iconName} size={20} color="white" />
      )}
      <Text style={styles.buttonText}>{title}</Text>
      {iconName && iconPosition === "right" && (
        <IconComponent name={iconName} size={20} color="white" />
      )}
    </TouchableOpacity>
  )
);

interface LoginSignUpScreenProps {
  navigation: any; // or properly type it
}

const LoginSignUpScreen: React.FC<LoginSignUpScreenProps> = ({
  navigation,
}) => {
  // State variables for form inputs - using single state for each field
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [confirmNewPin, setConfirmNewPin] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // State to control which view is currently displayed
  const [currentView, setCurrentView] = useState<ViewType>("initial");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;

  // Function to clear all form fields and messages
  const clearForm = useCallback((): void => {
    setPhoneNumber("");
    setPin("");
    setName("");
    setEmail("");
    setMobileNumber("");
    setNewPin("");
    setConfirmNewPin("");
    setMessage("");
  }, []);

  // Reset animation when view changes
  const changeView = useCallback(
    (newView: ViewType): void => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentView(newView);
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.9);
      });
    },
    [fadeAnim, scaleAnim]
  );

  // Memoized state setters
  const handlePhoneNumberChange = useCallback(
    (text: string) => setPhoneNumber(text),
    []
  );
  const handlePinChange = useCallback((text: string) => setPin(text), []);
  const handleNameChange = useCallback((text: string) => setName(text), []);
  const handleEmailChange = useCallback((text: string) => setEmail(text), []);
  const handleMobileNumberChange = useCallback(
    (text: string) => setMobileNumber(text),
    []
  );
  const handleNewPinChange = useCallback((text: string) => setNewPin(text), []);
  const handleConfirmNewPinChange = useCallback(
    (text: string) => setConfirmNewPin(text),
    []
  );

  // Memoized handlers to prevent recreation on each render
  // ... (inside LoginSignUpScreen component)

  // Handle Login submission
  const handleLogin = async () => {
    setMessage("");

    if (!phoneNumber || !pin) {
      setMessage("Please enter both phone number and PIN.");
      return;
    }

    try {
      // Check if user exists in Supabase
      const { data: user, error } = await supabase
        .from("users") // Adjust table name
        .select("*")
        .eq("phone", phoneNumber)
        .eq("pin", pin)
        .single();

      if (error || !user) {
        setMessage("Invalid phone number or PIN.");
        return;
      }

      setMessage("Login successful! Welcome!");

      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          })
        );
      }, 1500);
    } catch (error) {
      setMessage("Login failed. Please try again.");
    }
  };

  // Handle Signup (User Details) Next button
  const handleSignupNext = useCallback((): void => {
    setMessage("");

    const dummyName = "Ayub";
    const dummyEmail = "ayuboketch84@gmail.com";
    const dummyMobileNumber = "0712345678";

    if (!name || !email || !mobileNumber) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Basic format validation
    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (mobileNumber.length < 9 || !/^\d+$/.test(mobileNumber)) {
      setMessage("Please enter a valid mobile number.");
      return;
    }

    if (
      name === dummyName &&
      email === dummyEmail &&
      mobileNumber === dummyMobileNumber
    ) {
      changeView("setupPin");
      setMessage("");
    } else {
      setMessage(
        "Please use the dummy credentials provided to proceed for signup: Name: Ayub, Email: ayuboketch84@gmail.com, Mobile: 0712345678"
      );
    }
  }, [name, email, mobileNumber, changeView]);

  // Handle Setup PIN Create Account button
  const handleCreateAccount = async () => {
    setMessage("");

    if (!newPin || !confirmNewPin) {
      setMessage("Please enter your new PIN and confirm it.");
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setMessage("PIN must be exactly 4 digits.");
      return;
    }

    if (newPin !== confirmNewPin) {
      setMessage("PINs do not match.");
      return;
    }

    try {
      // Create user in Supabase
      const { data, error } = await supabase
        .from("users") // Adjust table name
        .insert([
          {
            name: name,
            email: email,
            phone: mobileNumber,
            pin: newPin,
            is_first_time: true,
          },
        ])
        .select()
        .single();

      if (error) {
        setMessage("Account creation failed. Please try again.");
        return;
      }

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Landing" }], // First-time users go to Landing
          })
        );
      }, 1500);
    } catch (error) {
      setMessage("Account creation failed. Please try again.");
    }
  };

  // Forgot PIN handler
  const handleForgotPin = useCallback((): void => {
    Alert.alert("Forgot PIN", "Forgot PIN functionality (simulated)");
  }, []);

  // Animate view transitions
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentView, fadeAnim, scaleAnim]);

  // Gradient animation
  useEffect(() => {
    const animateGradient = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
          }),
          Animated.timing(gradientAnim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateGradient();
  }, [gradientAnim]);

  // Render content based on current view
  const renderContent = (): JSX.Element => {
    switch (currentView) {
      case "initial":
        return (
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.initialButtonContainer}>
              <CustomButton
                title="Login"
                onPress={() => {
                  clearForm();
                  changeView("login");
                }}
                backgroundColor="#10B981"
                iconName="log-in"
                style={styles.initialButton}
              />
              <CustomButton
                title="Sign Up"
                onPress={() => {
                  clearForm();
                  changeView("signup");
                }}
                backgroundColor="#2563EB"
                iconName="user-plus"
                style={styles.initialButton}
              />
            </View>
          </Animated.View>
        );

      case "login":
        return (
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Login</Text>

              <InputField
                label="Phone Number"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                placeholder="e.g., 0712345678"
                iconName="phone"
                keyboardType="phone-pad"
                focusColor="#10B981"
              />

              <InputField
                label="PIN"
                value={pin}
                onChangeText={handlePinChange}
                placeholder="••••"
                iconName="lock"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                focusColor="#10B981"
              />

              {message ? (
                <Text
                  style={[
                    styles.message,
                    {
                      color:
                        message.includes("successful") ||
                        message.includes("Welcome")
                          ? "#10B981"
                          : "#DC2626",
                    },
                  ]}
                >
                  {message}
                </Text>
              ) : null}

              <CustomButton
                title="Login"
                onPress={handleLogin}
                backgroundColor="#10B981"
                iconName="log-in"
                style={styles.submitButton}
              />

              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={handleForgotPin}>
                  <Text style={styles.linkText}>I forgot my PIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    clearForm();
                    changeView("signup");
                  }}
                >
                  <Text style={styles.linkText}>I don't have an account</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  clearForm();
                  changeView("initial");
                }}
              >
                <Image
                  source={customBackIcon}
                  style={{
                    width: 54, // Adjust width to your icon's desired size
                    height: 54, // Adjust height to your icon's desired size
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    alignSelf: "center",
                    // tintColor: "#FFFFFF", // Optional: to color a monochrome image white
                    resizeMode: "contain", // Ensures the image fits within the bounds
                  }}
                />
                <Text
                  style={{
                    color: "green",
                    fontSize: 13,
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        );

      case "signup":
        return (
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Sign Up</Text>

              <InputField
                label="Full Name"
                value={name}
                onChangeText={handleNameChange}
                placeholder="Ayub"
                iconName="user"
                focusColor="#2563EB"
              />

              <InputField
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="ayuboketch84@gmail.com"
                iconName="mail"
                keyboardType="email-address"
                focusColor="#2563EB"
              />

              <InputField
                label="Mobile Number"
                value={mobileNumber}
                onChangeText={handleMobileNumberChange}
                placeholder="e.g., 0712345678"
                iconName="phone"
                keyboardType="phone-pad"
                focusColor="#2563EB"
              />

              {message ? (
                <Text
                  style={[
                    styles.message,
                    {
                      color:
                        message.includes("success") ||
                        message.includes("proceed")
                          ? "#10B981"
                          : "#DC2626",
                    },
                  ]}
                >
                  {message}
                </Text>
              ) : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
                    clearForm();
                    setCurrentView("initial"); // Ensures you go back to the initial screen
                  }}
                  style={styles.imageTextButton} // Applies centering and padding to the button container
                >
                  <Image
                    source={customBackIcon}
                    style={styles.imageButtonIcon}
                  />
                  <Text style={styles.imageButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSignupNext}
                  style={styles.imageTextButton} // Applies centering and padding to the button container
                >
                  <Image
                    source={customNextIcon}
                    style={styles.imageButtonIcon}
                  />
                  <Text style={styles.imageButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        );

      case "setupPin":
        return (
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Set Up Your PIN</Text>

              <InputField
                label="New PIN (4 digits)"
                value={newPin}
                onChangeText={handleNewPinChange}
                placeholder="••••"
                iconName="key"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                focusColor="#2563EB"
              />

              <InputField
                label="Confirm PIN"
                value={confirmNewPin}
                onChangeText={handleConfirmNewPinChange}
                placeholder="••••"
                iconName="lock"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                focusColor="#2563EB"
              />

              {message ? (
                <Text
                  style={[
                    styles.message,
                    {
                      color:
                        message.includes("successful") ||
                        message.includes("created")
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
                  onPress={() => {
                    clearForm();
                    changeView("signup");
                  }}
                  backgroundColor="#6B7280"
                  iconName="arrow-left"
                  style={styles.halfButton}
                />
                <CustomButton
                  title="Create Account"
                  onPress={handleCreateAccount}
                  backgroundColor="#2563EB"
                  iconName="user-plus"
                  iconPosition="right"
                  style={styles.halfButton}
                />
              </View>
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
      {/* Animated Gradient Background */}
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

      {/* Content */}
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
    shadowOffset: {
      width: 0,
      height: 10,
    },
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
  initialButtonContainer: {
    width: "100%",
    gap: 24,
  },
  initialButton: {
    paddingVertical: 16,
    marginBottom: 0,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  iconPlaceholder: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 8,
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backButtonText: {
    color: "#6B7280",
    fontSize: 14,
  },
  // buttonRow: {
  //   flexDirection: "row",
  //   gap: 12,
  //   marginTop: 8,
  // },
  halfButton: {
    flex: 1,
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center", // Center the row of buttons
    width: "100%", // Take full width of parent
    marginTop: 20,
    gap: 30, // Space between the buttons (RN 0.71+). Adjust this value!
    // For older RN versions, use marginHorizontal on imageTextButton:
    // marginHorizontal: 15, // or similar
  },
  imageTextButton: {
    alignItems: "center", // Center content (image and text) vertically
    justifyContent: "center", // Center content (image and text) horizontally
    padding: 10, // Padding around the icon and text
    // If using older RN version instead of 'gap', use margin here:
    // marginHorizontal: 15, // Example
  },
  imageButtonIcon: {
    width: 54, // As per your snippet
    height: 54, // As per your snippet
    resizeMode: "contain",
    // tintColor: '#FFFFFF', // Uncomment if your icon is monochrome and needs coloring
  },
  imageButtonText: {
    color: "green", // As per your snippet
    fontSize: 13, // As per your snippet
    textAlign: "center",
    marginTop: 10, // Space between image and text
  },
});

export default LoginSignUpScreen;
