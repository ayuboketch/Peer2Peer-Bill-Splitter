// src/services/supabase/auth.ts
import { supabaseClient } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface SignUpData {
  email: string;
  phone: string;
  fullName: string;
  pin: string;
}

export interface LoginData {
  email?: string;
  phone?: string;
  pin: string;
}

export class AuthService {
  
  // Sign up with email/password and create profile
  static async signUp(data: SignUpData) {
    try {
      // Check if phone number already exists in profiles
      const { data: existingProfile } = await supabaseClient
        .from('profiles')
        .select('phone')
        .eq('phone', data.phone)
        .single();

      if (existingProfile) {
        throw new Error('Phone number is already associated with another account');
      }

      // Create auth user with email and a generated password
      const tempPassword = `TempPass${Date.now()}!${Math.random().toString(36).slice(2)}`;
      
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: data.email,
        password: tempPassword,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
          emailRedirectTo: undefined
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        
        const errorMessage = authError.message || authError.toString() || 'Unknown error occurred';
        
        if (errorMessage.includes('already registered') || 
            errorMessage.includes('already been registered') ||
            errorMessage.includes('User already registered')) {
          throw new Error('Email is already in use. Try logging in instead.');
        }
        
        if (errorMessage.includes('only request this after') || 
            errorMessage.includes('rate limit')) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        
        if (errorMessage.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        }
        
        throw new Error(errorMessage);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create profile record
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: authData.user.id,
          phone: data.phone,
          full_name: data.fullName,
          pin: data.pin, // In production, hash this with bcrypt!
          is_first_time: true,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        const errorMessage = profileError.message || profileError.toString() || 'Unknown profile error';
        
        if (errorMessage.includes('already exists') || 
            errorMessage.includes('duplicate key')) {
          throw new Error('An account with this information already exists');
        }
        
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Store auth info for session management
      await AsyncStorage.multiSet([
        ['rememberedUser', data.email],
        ['userPhone', data.phone],
        ['currentUserId', authData.user.id],
        ['isLoggedIn', 'true'],
        ['userEmail', data.email]
      ]);

      return {
        user: authData.user,
        session: authData.session,
        profile: {
          id: authData.user.id,
          phone: data.phone,
          full_name: data.fullName,
          is_first_time: true
        },
        success: true,
      };

    } catch (error: any) {
      console.error('Signup error:', error);
      
      const errorMessage = error?.message || error?.toString() || 'An unknown error occurred during signup';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Login with phone and PIN
  static async loginWithPhoneAndPin(phone: string, pin: string) {
    try {
      // Find user by phone
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id, pin, full_name, is_first_time')
        .eq('phone', phone)
        .single();

      if (!profile) {
        throw new Error('Phone number not found. Please sign up first.');
      }

      // Verify PIN
      if (profile.pin !== pin) {
        throw new Error('Invalid PIN');
      }

      // Store successful login
      await AsyncStorage.multiSet([
        ['userPhone', phone],
        ['currentUserId', profile.id],
        ['isLoggedIn', 'true']
      ]);

      return {
        success: true,
        user: { id: profile.id },
        profile: profile,
      };

    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error?.message || error?.toString() || 'Login failed';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Check if phone exists (safe method)
  static async checkPhoneExists(phone: string) {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking phone:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Phone check error:', error);
      return false;
    }
  }

  // Validate form data before attempting signup
  static validateSignupData(data: SignUpData) {
    const errors: string[] = [];

    if (!data.fullName.trim()) {
      errors.push('Full name is required');
    }

    if (!data.email.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
      }
    }

    if (!data.phone.trim()) {
      errors.push('Phone number is required');
    } else {
      const phoneRegex = /^(\+254|0)[17]\d{8}$/;
      if (!phoneRegex.test(data.phone)) {
        errors.push('Please enter a valid Kenyan phone number');
      }
    }

    if (!data.pin || data.pin.length !== 4) {
      errors.push('PIN must be exactly 4 digits');
    } else if (!/^\d{4}$/.test(data.pin)) {
      errors.push('PIN must contain only numbers');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get current user profile
  static async getCurrentUserProfile() {
    try {
      const userId = await AsyncStorage.getItem('currentUserId');
      if (!userId) return null;

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Check if user is logged in
  static async isLoggedIn() {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const userId = await AsyncStorage.getItem('currentUserId');
      return isLoggedIn === 'true' && !!userId;
    } catch (error) {
      return false;
    }
  }

  // Sign out
  static async signOut() {
    try {
      await supabaseClient.auth.signOut();
      await AsyncStorage.multiRemove([
        'rememberedUser',
        'userPhone',
        'currentUserId',
        'isLoggedIn',
        'userEmail'
      ]);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      const errorMessage = error?.message || error?.toString() || 'Sign out failed';
      return { success: false, error: errorMessage };
    }
  }

  // Reset PIN (simplified version)
  static async resetPin(phone: string) {
    try {
      return { 
        success: true, 
        message: 'PIN reset instructions would be sent to your registered email/phone' 
      };
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Reset failed';
      return { success: false, error: errorMessage };
    }
  }
}