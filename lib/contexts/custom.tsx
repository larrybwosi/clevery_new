import React, { useCallback, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { endpoint } from '../env';
import { userApi } from '../actions/users';
import { router } from 'expo-router';
import ToastAlert from '@/components/toast-alert';
import { Toast } from 'native-base';
import { showToastMessage } from '../utils';
import { useAuthStore, useProfileStore } from '../zustand/store';

// Configuration variables
const API_BASE_URL = endpoint;
const GOOGLE_CLIENT_ID = '116758371280-goubu5e97m7lgm69qdeel37364f7k581.apps.googleusercontent.com';
const GITHUB_CLIENT_ID = "1f1b4b1ec4a3365080ba";

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
 * Configuration for authentication providers
 */
const providerConfig = {
  google: {
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({path:'/'}),
    scopes: ['profile', 'email'],
  },
  github: {
    clientId: GITHUB_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ path: '/' }),
    scopes: ['user'],
  },
};

// Function to authenticate with your backend
const authenticateWithBackend = async (provider: 'google' | 'github', token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, token }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    // Handle successful authentication (e.g., store the session, update UI)
    console.log('Authenticated user:', data.user);
    console.log('Session:', data.session);
  } catch (error) {
    console.error('Error authenticating with backend:', error);
  }
};




/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component that wraps the application and provides authentication context
 * @param props - The component props
 * @returns The AuthProvider component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, token, loading, setUser, setToken, setLoading } = useAuthStore();
  const { setProfile} = useProfileStore();
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentAccount = await userApi.getCurrentUser();
        if (!currentAccount) {
          router.navigate('sign-in');
        }
        setProfile(currentAccount)
      } catch (error) {
        console.error('Error checking current user:', error);
        router.navigate('sign-in');
      }
    };

    checkCurrentUser();
  }, [router]);

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
        await handleOAuthSignIn(provider);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  /**
   * Handles the OAuth sign-in process
   * @param provider - The OAuth provider
   * @throws Error if OAuth sign-in fails or is cancelled
   */
  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    const config = providerConfig[provider];
    
    const discovery = await AuthSession.fetchDiscoveryAsync(`https://${provider}.com`);
  
    const authRequest = new AuthSession.AuthRequest({
      clientId: config.clientId,
      scopes: config.scopes,
      redirectUri: config.redirectUri,
    });
  
    const result = await authRequest.promptAsync(discovery);
  
    if (result.type === 'success' && result.params.code) {
      const tokenResponse = await axios.post(`${API_BASE_URL}/auth/${provider}/callback`, { code: result.params.code });
      await handleAuthSuccess(tokenResponse.data);
    } else {
      throw new Error('OAuth sign-in was cancelled or failed');
    }
  };

  /**
   * Handles the credentials (email/password) sign-in process
   * @param credentials - The user's email and password
   */
  const handleCredentialsSignIn = async (credentials: { email: string; password: string }) => {
    console.log(credentials)
    const response = await axios.post(`${API_BASE_URL}sign-in`, credentials);
    const data = response.data
    await handleAuthSuccess(data);
    return data
  };

  /**
   * Handles successful authentication
   * @param data - The user data returned from the server
   */
  const handleAuthSuccess = async ({ user,token }: { user: User; token: string }) => {
    //@ts-ignore
    setUser(user);
    setProfile(user)
    setToken(token);
    return (
      Toast.show({
        render: () => (
          <ToastAlert
            id="sign-up"
            title="Success!"
            description={`Welcome ${user.name}!`}
            status="success"
          />
        ),
      })
    )
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
      Toast.show({
        render: () => (
          <ToastAlert
            id="sign-up"
            title="Something went wrong"
            description={errorMessage}
            status="error"
          />
        ),
      })
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

  /**
   * Updates the user's information
   * @param data - Partial user data to update
   */
  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      setLoading(true);
      const response = await userApi.updateCurrentUser(data);
      setUser(response);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [user, token, setLoading, setUser]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Authentication context
 */
const AuthContext = React.createContext<{
  user: User | null;
  loading: boolean;
  signIn: (provider: 'google' | 'github' | 'credentials', credentials?: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
});

/**
 * Custom hook to use the authentication context
 * @returns The authentication context data
 * @throws Error if used outside of an AuthProvider
 */
export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}