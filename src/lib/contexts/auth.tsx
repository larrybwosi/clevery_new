import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import axios, { AxiosError } from 'axios';

import { useAuthStore, useProfileStore } from '@/lib/zustand/store';
import { userApi } from '@/lib/actions/users';
import { endpoint } from '@/lib/env';
import { Loader } from '@/components';

const API_BASE_URL = endpoint;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (credentials: { username: string; email: string; password: string }) => Promise<void>;
  signIn: (provider: 'google' | 'credentials', credentials?: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, setLoading } = useAuthStore();
  const { profile, setProfile } = useProfileStore();

  const checkCurrentUser = useCallback(async () => {
    if (profile?.id) return;
    try {
      setLoading(true);
      const currentAccount = await userApi.getCurrentUser();
      if (!currentAccount) {
        router.push('sign-up');
      } else {
        setProfile(currentAccount);
      }
    } catch (error) {
      console.error('Error checking current user:', error);
      router.replace('sign-in');
    } finally {
      setLoading(false);
    }
  }, [profile?.id, setLoading, setProfile]);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const res = await GoogleSignin.signIn();
      if (!res) throw new Error('Google Sign-In failed');
      
      setLoading(true);
      const { serverAuthCode } = res.data;
      const tokenResponse = await axios.post(`${API_BASE_URL}/auth/callback/google?code=${serverAuthCode}`);
      console.log(await tokenResponse.data);
      const user = await userApi.getCurrentUser();
      console.log('Google auth res user: ', user);
      return { success: true, serverAuthCode };
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const handleAuthSuccess = useCallback((userData: User) => {
    //@ts-ignore
    setProfile(userData);
  }, [setProfile]);

  const handleAuthError = useCallback((error: unknown): string => {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error
        ? error.message
        : 'An unexpected error occurred during authentication';
    console.error(errorMessage);
    return errorMessage;
  }, []);

  const signInWithCredentials = useCallback(async (credentials: { email: string; password: string }, retryCount = 0) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sign-in`, credentials);
      handleAuthSuccess(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 429 || 500 && retryCount < MAX_RETRY_ATTEMPTS) {
        console.log(`Retrying sign-in attempt ${retryCount + 1} of ${MAX_RETRY_ATTEMPTS}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        await signInWithCredentials(credentials, retryCount + 1);
      } else {
        throw error;
      }
    }
  }, [handleAuthSuccess]);

  const signIn: AuthContextType['signIn'] = useCallback(async (provider, credentials) => {
    try {
      setLoading(true);
      if (provider === 'credentials') {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required for credentials sign-in');
        }
        await signInWithCredentials(credentials);
      } else if (provider === 'google') {
        const { success, error } = await handleGoogleSignIn();
        if (!success) {
          throw new Error(error);
        }
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, handleGoogleSignIn, signInWithCredentials, handleAuthError]);

  const signUp: AuthContextType['signUp'] = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/sign-up`, credentials);
      handleAuthSuccess(response.data);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, handleAuthSuccess, handleAuthError]);

  const signOut: AuthContextType['signOut'] = useCallback(async () => {
    try {
      setLoading(true);
      setProfile(null);
      router.navigate('sign-in');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setProfile, handleAuthError]);

  const contextValue = React.useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }), [user, loading, signIn, signUp, signOut]);

  return (
    <React.Suspense fallback={<Loader loadingText="We're creating your space" />}>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </React.Suspense>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}