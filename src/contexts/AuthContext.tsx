/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error signing out:', err);
      }
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  };

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    try {
      if (!user) throw new Error('No user logged in');
      const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
      if (error) throw error;
       // Update local user state
       setUser((prev: User | null) => (prev ? { ...prev, ...data } : null));
      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  };

  if (loading) {
    return null; // Return null until we know the auth state
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}