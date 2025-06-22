// src/types/auth.ts
export interface UserData {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    pin: string;
    auth_user_id: string;
    is_first_time: boolean;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface AuthState {
    user: any | null;
    session: any | null;
    userData: UserData | null;
    loading: boolean;
    rememberedUser: string | null;
  }
  
  export interface LoginData {
    phone: string;
    pin: string;
  }
  
  export interface SignUpData {
    name: string;
    email: string;
    phone: string;
    pin: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  }