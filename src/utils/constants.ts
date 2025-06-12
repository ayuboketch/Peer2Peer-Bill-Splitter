// src/utils/constants.ts
export const CONFIG = {
  API_BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' 
    : 'https://api.msplit.co.ke',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  MPESA_CONSUMER_KEY: process.env.EXPO_PUBLIC_MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET: process.env.EXPO_PUBLIC_MPESA_CONSUMER_SECRET,
};