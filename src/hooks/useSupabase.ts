// src/hooks/useSupabase.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';

interface UserData {
  id: string;
  full_name: string;
  phone: string;
  pin: string;
  avatar_url?: string;
  mpesa_number?: string;
  is_first_time: boolean;
  created_at: string;
  updated_at: string;
}

export const useSupabase = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rememberedUser, setRememberedUser] = useState<string | null>(null);

  // Initialize session and check for remembered user
  const initializeSession = useCallback(async () => {
    try {
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // Check for remembered user
      const savedPhone = await AsyncStorage.getItem('rememberedPhone');
      setRememberedUser(savedPhone);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Get user data from profiles table (not users)
        const { data: dbUser, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        
        if (!error && dbUser) {
          setUserData(dbUser);
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session) {
          setSession(session);
          setUser(session.user);
          
          // Get user data from profiles table (not users)
          const { data: dbUser, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!error && dbUser) {
            setUserData(dbUser);
          }
        } else {
          setSession(null);
          setUser(null);
          setUserData(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Remember user for quick login
  const rememberUser = async (phone: string) => {
    try {
      await AsyncStorage.setItem('rememberedPhone', phone);
      setRememberedUser(phone);
    } catch (error) {
      console.error('Error remembering user:', error);
    }
  };

  // Forget remembered user
  const forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('rememberedPhone');
      setRememberedUser(null);
    } catch (error) {
      console.error('Error forgetting user:', error);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      await forgetUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if user exists by phone
  const checkUserExists = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, phone')
        .eq('phone', phone);
      
      if (error) {
        console.error('Error checking user existence:', error);
        return { exists: false, error: error.message };
      }
      
      return { 
        exists: data && data.length > 0
      };
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { exists: false, error: 'Failed to check user existence' };
    }
  };

  // Get user by phone for login
  const getUserByPhone = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .single();
      
      if (error) {
        console.error('Error getting user by phone:', error);
        return { user: null, error: error.message };
      }
      
      return { user: data, error: null };
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return { user: null, error: 'Failed to get user' };
    }
  };

  return {
    session,
    user,
    userData,
    loading,
    rememberedUser,
    initializeSession,
    rememberUser,
    forgetUser,
    signOut,
    checkUserExists,
    getUserByPhone,
  };
};