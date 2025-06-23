// src/hooks/useLoginSignUp.ts
import { useState, useRef, useEffect } from 'react';
import { Animated, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/supabase/auth';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

type ViewType = 'initial' | 'login' | 'signup' | 'setupPin' | 'quickLogin';

interface FormData {
  name: string;
  email: string;
  mobileNumber: string;
  phoneNumber: string;
  pin: string;
  newPin: string;
  confirmNewPin: string;
}

export const useLoginSignUp = () => {
  const { setUser } = useAuth(); // Use the auth context
  const [currentView, setCurrentView] = useState<ViewType>('initial');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberedUser, setRememberedUser] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobileNumber: '',
    phoneNumber: '',
    pin: '',
    newPin: '',
    confirmNewPin: '',
  });

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;

  // Check for remembered user on component mount
  useEffect(() => {
    checkRememberedUser();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message) setMessage('');
  };

  const changeView = (newView: ViewType) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { duration: 150, toValue: 0, useNativeDriver: true }),
        Animated.timing(scaleAnim, { duration: 150, toValue: 0.95, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, { duration: 200, toValue: 1, useNativeDriver: true }),
        Animated.timing(scaleAnim, { duration: 200, toValue: 1, useNativeDriver: true }),
      ]),
    ]).start();

    setCurrentView(newView);
    setMessage('');
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      phoneNumber: '',
      pin: '',
      newPin: '',
      confirmNewPin: '',
    });
    setMessage('');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSignupNext = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      if (!formData.name.trim()) {
        setMessage('Please enter your full name');
        return;
      }

      if (!validateEmail(formData.email)) {
        setMessage('Please enter a valid email address');
        return;
      }

      if (!validatePhone(formData.mobileNumber)) {
        setMessage('Please enter a valid phone number (e.g., 0712345678)');
        return;
      }

      const phoneExists = await AuthService.checkPhoneExists(formData.mobileNumber);
      if (phoneExists) {
        setMessage('Phone number is already associated with another account');
        return;
      }

      changeView('setupPin');

    } catch (error: any) {
      console.error('Signup validation error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      if (!formData.newPin || formData.newPin.length !== 4) {
        setMessage('PIN must be exactly 4 digits');
        return;
      }

      if (!/^\d{4}$/.test(formData.newPin)) {
        setMessage('PIN must contain only numbers');
        return;
      }

      if (formData.newPin !== formData.confirmNewPin) {
        setMessage('PINs do not match');
        return;
      }

      const validation = AuthService.validateSignupData({
        email: formData.email,
        phone: formData.mobileNumber,
        fullName: formData.name,
        pin: formData.newPin,
      });

      if (!validation.isValid) {
        setMessage(validation.errors[0]);
        return;
      }

      const result = await AuthService.signUp({
        email: formData.email,
        phone: formData.mobileNumber,
        fullName: formData.name,
        pin: formData.newPin,
      });

      if (result.success) {
        setMessage('Account created successfully!');
        
        // Auto-redirect after 5 seconds
        const autoRedirectTimer = setTimeout(() => {
          clearForm();
          // Force update the auth context with the new user
          if (result.user) {
            setUser(result.user);
          }
        }, 5000);
        
        Alert.alert(
          'Welcome to MSplit!',
          'Your account has been created successfully. You can now start using the app! (Auto-redirecting in 5 seconds)',
          [
            {
              text: 'Get Started',
              onPress: () => {
                clearTimeout(autoRedirectTimer);
                clearForm();
                // Force update the auth context with the new user
                if (result.user) {
                  setUser(result.user);
                }
              }
            }
          ]
        );
      } else {
        setMessage(result.error || 'Failed to create account');
      }

    } catch (error: any) {
      console.error('Account creation error:', error);
      setMessage('An error occurred while creating your account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      if (!formData.phoneNumber) {
        setMessage('Please enter your phone number');
        return;
      }

      if (!formData.pin || formData.pin.length !== 4) {
        setMessage('Please enter your 4-digit PIN');
        return;
      }

      if (!/^\d{4}$/.test(formData.pin)) {
        setMessage('PIN must contain only numbers');
        return;
      }

      const result = await AuthService.loginWithPhoneAndPin(
        formData.phoneNumber,
        formData.pin
      );

      if (result.success) {
        setMessage('Login successful!');
        
        await AsyncStorage.setItem('rememberedUser', formData.phoneNumber);

        // Auto-redirect after 5 seconds
        const autoRedirectTimer = setTimeout(() => {
          clearForm();
          // Force update the auth context with the logged in user
          if (result.user) {
            setUser(result.user);
          }
        }, 5000);

        Alert.alert(
          'Welcome back!',
          `Hello ${result.profile?.full_name || 'User'}! You have been logged in successfully. (Auto-redirecting in 5 seconds)`,
          [
            {
              text: 'Continue',
              onPress: () => {
                clearTimeout(autoRedirectTimer);
                clearForm();
                // Force update the auth context with the logged in user
                if (result.user) {
                  setUser(result.user);
                }
              }
            }
          ]
        );
      } else {
        setMessage(result.error || 'Login failed');
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setMessage('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      if (!formData.pin || formData.pin.length !== 4) {
        setMessage('Please enter your 4-digit PIN');
        return;
      }

      if (!/^\d{4}$/.test(formData.pin)) {
        setMessage('PIN must contain only numbers');
        return;
      }

      const userPhone = await AsyncStorage.getItem('userPhone');
      if (!userPhone) {
        setMessage('Session expired. Please log in again.');
        handleSwitchAccount();
        return;
      }

      const result = await AuthService.loginWithPhoneAndPin(userPhone, formData.pin);

      if (result.success) {
        setMessage('Welcome back!');
        
        // Auto-redirect after 5 seconds
        const autoRedirectTimer = setTimeout(() => {
          clearForm();
          // Force update the auth context with the logged in user
          if (result.user) {
            setUser(result.user);
          }
        }, 5000);
        
        Alert.alert(
          'Welcome back!',
          `Hello ${result.profile?.full_name || 'User'}! You have been logged in successfully. (Auto-redirecting in 5 seconds)`,
          [
            {
              text: 'Continue',
              onPress: () => {
                clearTimeout(autoRedirectTimer);
                clearForm();
                // Force update the auth context with the logged in user
                if (result.user) {
                  setUser(result.user);
                }
              }
            }
          ]
        );
      } else {
        setMessage(result.error || 'Invalid PIN');
      }

    } catch (error: any) {
      console.error('Quick login error:', error);
      setMessage('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPin = async () => {
    try {
      const userPhone = await AsyncStorage.getItem('userPhone') || rememberedUser;
      if (!userPhone) {
        Alert.alert('Error', 'No account information found');
        return;
      }

      const result = await AuthService.resetPin(userPhone);
      if (result.success) {
        Alert.alert('Reset Instructions', result.message || 'Reset instructions sent');
      } else {
        Alert.alert('Error', result.error || 'Failed to process reset request');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing your request');
    }
  };

  const handleSwitchAccount = () => {
    clearForm();
    setRememberedUser('');
    AsyncStorage.multiRemove(['rememberedUser', 'userPhone', 'currentUserId', 'isLoggedIn']);
    changeView('initial');
  };

  const checkRememberedUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('rememberedUser');
      if (stored) {
        setRememberedUser(stored);
        changeView('quickLogin');
      }
    } catch (error) {
      console.error('Error checking remembered user:', error);
    }
  };

  return {
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
    checkRememberedUser,
  };
};