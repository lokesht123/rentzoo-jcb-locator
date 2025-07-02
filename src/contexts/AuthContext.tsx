
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'operator' | 'client') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'operator' | 'client') => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      console.log('Sign up result:', data, error);
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Handle hardcoded admin credentials
      if (email === 'lokeshtanavarapu1@gmail.com' && password === 'RentZoo#12345$') {
        // First try to sign in normally
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        // If sign in succeeds, return success
        if (!signInError && signInData.user) {
          console.log('Admin sign in successful:', signInData);
          return { error: null };
        }
        
        // Handle email not confirmed error for admin
        if (signInError?.message?.includes('Email not confirmed')) {
          // Try to resend confirmation and then manually confirm
          try {
            await supabase.auth.resend({
              type: 'signup',
              email: email,
            });
            console.log('Admin email confirmation resent');
            
            // For admin, we'll return a custom message asking them to check email
            // But in a real scenario, you'd want to disable email confirmation in Supabase settings
            return { 
              error: { 
                message: 'Admin account created but needs email confirmation. Please check your email or disable email confirmation in Supabase Auth settings for testing.' 
              }
            };
          } catch (resendError) {
            console.error('Failed to resend confirmation:', resendError);
          }
        }
        
        // If user doesn't exist, create the admin account
        if (signInError?.message?.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/admin`,
              data: {
                full_name: 'Admin User',
                role: 'admin'
              }
            }
          });
          
          if (signUpError) {
            console.error('Admin signup error:', signUpError);
            return { error: signUpError };
          }
          
          console.log('Admin account created:', signUpData);
          
          // If the account was created but needs confirmation
          if (signUpData.user && !signUpData.session) {
            return { 
              error: { 
                message: 'Admin account created! Please check your email to confirm your account, or disable email confirmation in Supabase Auth settings for testing.' 
              }
            };
          }
          
          return { error: null };
        }
        
        // Return the original sign-in error
        return { error: signInError };
      }
      
      // Normal sign-in flow for other users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Sign in result:', data, error);
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
