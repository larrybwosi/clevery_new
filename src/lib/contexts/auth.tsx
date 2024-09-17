import { createContext, Suspense, useCallback, useContext, useEffect } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import axios from 'axios';

import { useAuthStore, useProfileStore } from '@/lib/zustand/store';
import { showToastAlert } from '@/components/alert';
import { userApi } from '@/lib/actions/users';
import { endpoint } from '@/lib/env';
import { Loader } from '@/components';

// Configuration variables
const API_BASE_URL = endpoint;

/**
 * Represents the structure of a user object.
 */
interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication context
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (credentials: { username: string; email: string; password: string }) => Promise<void>;
  signIn: (provider: 'google' | 'credentials', credentials?: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider component that wraps the application and provides authentication context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loading, setLoading } = useAuthStore();
  const { profile, setProfile } = useProfileStore();

  useEffect(() => {
    const checkCurrentUser = async () => {
      if (profile?.id) return;
      try {
        setLoading(true);
        const currentAccount = await userApi.getCurrentUser();
        if (!currentAccount) {
          router.navigate('sign-up');
        } else {
          setProfile(currentAccount);
        }
      } catch (error) {
        console.error('Error checking current user:', error);
        router.replace('sign-in');
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

/**
 * Handles Google Sign-In process
 * @returns Object indicating success or failure of the sign-in process
 */
const handleGoogleSignIn = async (): Promise<{ success: boolean; serverAuthCode?: string; error?: string }> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const res = await GoogleSignin.signIn();
    if (!res) {
      throw new Error('Google Sign-In failed');
    }
    setLoading(true);
    const { data:{serverAuthCode} } = res;
    const tokenResponse = await axios.get(`${API_BASE_URL}/auth/callback/google?code=${serverAuthCode}&grant_type=code_verifier`);
    console.log(await tokenResponse.data);
    const user = await userApi.getCurrentUser();
    console.log('Google auth res user: ', user);
    setLoading(false);
    // setProfile(user);
    return { success: true, serverAuthCode };
  } catch (error) {
    setLoading(false);
    console.error('Google Sign-In Error:', error.message);
    return { success: false, error: error.message };
  }
};

  const handleAuthSuccess = useCallback((userData: User) => {
    showToastAlert({
      id: 'auth-success',
      title: 'Authentication successful',
      description: 'You are now logged in.',
    });

    // @ts-ignore
    setProfile(userData);
    router.replace('/');
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

  const signIn: AuthContextType['signIn'] = useCallback(async (provider, credentials) => {
    try {
      setLoading(true);
      if (provider === 'credentials') {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required for credentials sign-in');
        }
        const response = await axios.post(`${API_BASE_URL}/sign-in`, credentials);
        handleAuthSuccess(response.data);
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
  }, [setLoading, handleAuthSuccess, handleAuthError]);

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
      // Add any necessary sign-out logic here (e.g., clearing tokens)
      setProfile(null);
      router.navigate('sign-in');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, handleAuthError]);

  const contextValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <Suspense fallback={<Loader loadingText="We're creating your space" />}>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </Suspense>
  );
};

/**
 * Custom hook to use the authentication context
 * @returns The authentication context data
 * @throws Error if used outside of an AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}