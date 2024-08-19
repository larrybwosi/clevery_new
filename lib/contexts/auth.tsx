import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import axios from 'axios';

import { useAuthStore, useProfileStore } from '@/lib/zustand/store';
import ToastAlert, { showToastAlert } from '@/components/toast-alert';
import { userApi } from '@/lib/actions/users';
import { endpoint } from '@/lib/env';
import { Toast } from '@/components/ui/toast';

// Configuration variables
const API_BASE_URL = endpoint;

WebBrowser.maybeCompleteAuthSession();

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
 * Custom hook for OAuth sign-in
 * @param provider - The OAuth provider ('google' or 'github')
 * @returns Object containing handleSignIn function and authResult
 */
const useOAuthSignIn = (provider: 'google' | 'github') => {
  const githubDiscovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_GITHUB_CLIENT_ID!}`,
  };

  const [request, response, promptAsync] = provider === 'github'
    ? AuthSession.useAuthRequest(
        {
          clientId: process.env.EXPO_GITHUB_CLIENT_ID!,
          scopes: ['identity'],
          redirectUri: AuthSession.makeRedirectUri({ scheme: 'com.clevery.app' }),
        },
        githubDiscovery
      )
    : Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        // scopes: ['email,profile'],
        redirectUri: AuthSession.makeRedirectUri({ scheme: 'com.clevery.app' }),
      });

  const [authResult, setAuthResult] = useState<AuthSession.AuthSessionResult | null>(null);

  useEffect(() => {
    if (response?.type === 'success') {
      console.log(response)
      setAuthResult(response);
    }
  }, [response]);

  const handleSignIn = useCallback(async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success' && result.params.code) {
        const tokenResponse = await axios.post(`${API_BASE_URL}/auth/${provider}/callback`, { code: result.params.code });
        return tokenResponse.data;
      } else {
        throw new Error('OAuth sign-in was cancelled or failed');
      }
    } catch (error) {
      console.error('OAuth sign-in error:', error);
      throw error;
    }
  }, [promptAsync, provider]);

  return { handleSignIn, authResult };
};

/**
 * AuthProvider component that wraps the application and provides authentication context
 * @param props - The component props
 * @returns The AuthProvider component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, token, loading, setUser, setToken, setLoading } = useAuthStore();
  const { profile, setProfile } = useProfileStore();

  const { handleSignIn: handleGoogleSignIn } = useOAuthSignIn('google');
  const { handleSignIn: handleGithubSignIn } = useOAuthSignIn('github');

  useEffect(() => {
    const checkCurrentUser = async () => {
      if (profile.id) return
      try {
        const currentAccount = await userApi.getCurrentUser();
        if (!currentAccount) {
          router.navigate('sign-in');
        }
        setProfile(currentAccount)
      } catch (error) {
        console.error('Error checking current user:', error);
        router.replace('sign-in');
      }
    };

    checkCurrentUser();
  }, []);

  /**
   * Handles the sign-in process for various providers
   * @param provider - The authentication provider
   * @param credentials - Optional credentials for email/password sign-in
   * @throws Error if credentials are not provided for 'credentials' provider
   */
  const signIn = useCallback(async (
    provider: 'google' | 'github' | 'credentials',
    credentials?: { email: string; password: string }
  ) => {
    try {
      setLoading(true);

      if (provider === 'credentials') {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Email and password are required for credentials sign-in');
        }
        await handleCredentialsSignIn(credentials);
      } else {
        const handleSignIn = provider === 'google' ? handleGoogleSignIn : handleGithubSignIn;
        const data = await handleSignIn();
        await handleAuthSuccess(data);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, handleGoogleSignIn, handleGithubSignIn]);

  /**
   * Handles the credentials (email/password) sign-in process
   * @param credentials - The user's email and password
   */
  const handleCredentialsSignIn = async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}sign-in`, credentials);
    const data = response.data
    await handleAuthSuccess(data);
    return data
  };

  /**
   * Handles the sign-up process
   * @param credentials - The user's username, email, and password
   */
  const signUp = async (credentials: {username: string, email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}sign-up`, credentials);
    const data = response.data
    await handleAuthSuccess(data);
    return data
  };

  /**
   * Handles successful authentication
   * @param data - The user data returned from the server
   */
  const handleAuthSuccess = async ({ user, token }: { user: User; token: string }) => {
    //@ts-ignore
    setUser(user);
    //@ts-ignore
    setProfile(user)
    setToken(token);
    showToastAlert({
      id: 'sign-up',
      title: 'Authentication successful',
      description: 'You are now logged in.',
    })
    router.navigate('/editprofile')
  };

  /**
   * Handles authentication errors
   * @param error - The error object
   */
  const handleAuthError = (error: unknown) => {
    let errorMessage = 'An unexpected error occurred during authentication';

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return (
      <Toast />
      // Toast.show({
      //   render: () => (
      //     <ToastAlert
      //       id="sign-up"
      //       title="Something went wrong"
      //       description={errorMessage}
      //       status="error"
      //     />
      //   ),
      // })
    )
  };

  /**
   * Signs out the current user
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setUser(null);
      setToken(null);
      router.navigate('sign-in');
    } catch (error) {
      console.error('Error during sign out:', error);
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser, setToken, router]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Authentication context
 */
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  signUp: (credentials: {username:string, email: string; password: string }) => Promise<void>;
  signIn: (provider: 'google' | 'github' | 'credentials', credentials?: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

/**
 * Custom hook to use the authentication context
 * @returns The authentication context data
 * @throws Error if used outside of an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}