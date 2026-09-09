import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * Authentication context type definition
 * Defines the shape of the authentication context provided by AuthProvider
 */
export interface AuthContextType {
  /** Current authenticated user or null if not authenticated */
  user: User | null;
  /** Boolean indicating if authentication state is still being determined */
  loading: boolean;
  /**
   * Sign in user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to success status and optional error message
   */
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  /**
   * Sign up new user with email, password, and full name
   * @param email - User's email address
   * @param password - User's password
   * @param fullName - User's full name for profile
   * @returns Promise resolving to success status and optional error message
   */
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  /**
   * Sign out the current user
   * @returns Promise resolving when sign out is complete
   */
  signOut: () => Promise<void>;
  /**
   * Send password reset email to user
   * @param email - User's email address
   * @returns Promise resolving to success status and optional error message
   */
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  /**
   * Update user profile data
   * @param data - Object containing profile fields to update (full_name, avatar_url)
   * @returns Promise resolving to success status and optional error message
   */
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);