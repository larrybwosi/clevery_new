import React, { createContext, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { z } from 'zod';
import axios from 'axios';
import {create} from 'zustand';
import { useProfileStore } from '../zustand/store';
import { userApi } from '../actions/users';

// Ensure WebBrowser is configured for AuthSession
WebBrowser.maybeCompleteAuthSession();

/**
 * Zod schema for user profile validation
 */
const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().url().optional(),
});

/**
 * Type definition for the user profile based on the Zod schema
 */
type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Interface for the authentication store
 */
interface AuthStore {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  setIsAuthenticated: (value: boolean) => void;
}

/**
 * Zustand store for authentication state
 */
const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  userProfile: null,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));

/**
 * Interface for the authentication context value
 */
interface AuthContextValue {
  login: (provider: 'google' | 'github' | 'email') => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Kinde Auth configuration
 */
const KINDE_DOMAIN = process.env.EXPO_PUBLIC_KINDE_ISSUER_URL;
const KINDE_CLIENT_ID = process.env.EXPO_PUBLIC_KINDE_CLIENT_ID!;
const KINDE_REDIRECT_URI = 'clevery://redirect';

/**
 * SecureStore keys for storing tokens
 */
const ACCESS_TOKEN_KEY = 'kinde_access_token';
const REFRESH_TOKEN_KEY = 'kinde_refresh_token';
const ID_TOKEN_KEY = 'kinde_id_token';

/**
 * AuthProvider component for managing authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setIsAuthenticated } = useAuthStore();
  const { profile, setProfile } = useProfileStore();

  const setUserProfile = async (profile: UserProfile | null) => {
    const user = await userApi.getCurrentUser();
    setProfile({
      id: profile?.id || '',
      email: profile?.email || '',
      name: profile?.given_name || '',
      username: `${profile?.given_name} ${profile?.family_name}` || '',
      image: profile?.picture || '',
      createdAt: user?.createdAt || '',
      updatedAt: user?.updatedAt || '',
      address:user?.address || '',
      bannerImage: user?.bannerImage || '',
      bio: user.bio|| '',
      phone: user.phone || '',
      emailVerified: user?.emailVerified || null,
      notificationToken: user?.notificationToken || '',
      connections:user?.connections,
      phoneNumber:user?.phoneNumber || '',

    });
  };


  /**
   * Retrieves stored tokens from SecureStore
   * @returns {Promise<{accessToken: string | null, refreshToken: string | null, idToken: string | null}>}
   */
  const getStoredTokens = async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const idToken = await SecureStore.getItemAsync(ID_TOKEN_KEY);
    return { accessToken, refreshToken, idToken };
  };

  /**
   * Stores tokens in SecureStore
   * @param {Object} tokens - Token object
   * @param {string} tokens.accessToken - Access token
   * @param {string} tokens.refreshToken - Refresh token
   * @param {string} tokens.idToken - ID token
   */
  const storeTokens = async (tokens: { accessToken: string; refreshToken: string; idToken: string }) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
    await SecureStore.setItemAsync(ID_TOKEN_KEY, tokens.idToken);
  };

  /**
   * Clears stored tokens from SecureStore
   */
  const clearTokens = async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
  };

  /**
   * Fetches user profile from Kinde API
   * @param {string} accessToken - Access token
   * @returns {Promise<UserProfile>}
   */
  const fetchUserProfile = async (accessToken: string): Promise<UserProfile> => {
    const response = await axios.get(`https://${KINDE_DOMAIN}/oauth2/user_profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return UserProfileSchema.parse(response.data);
  };

  /**
   * Refreshes access token using refresh token
   * @returns {Promise<void>}
   */
  const refreshTokens = async (): Promise<void> => {
    const { refreshToken } = await getStoredTokens();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenResponse = await axios.post(`https://${KINDE_DOMAIN}/oauth2/token`, {
      grant_type: 'refresh_token',
      client_id: KINDE_CLIENT_ID,
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token, id_token } = tokenResponse.data;
    await storeTokens({ accessToken: access_token, refreshToken: refresh_token, idToken: id_token });

    const profile = await fetchUserProfile(access_token);
    setUserProfile(profile);
    setIsAuthenticated(true);
  };

/**
 * Initiates the login process for the specified provider
 * @param {('google' | 'github' | 'email')} provider - Authentication provider
 */
const login = async (provider: 'google' | 'github' | 'email') => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'clevery' ,
    path:'/'
  });
  console.log(redirectUri)
const discoveryDocument = await AuthSession.fetchDiscoveryAsync(`https://${KINDE_DOMAIN}`);

const authRequest = new AuthSession.AuthRequest({
  clientId: KINDE_CLIENT_ID,
  scopes: ['openid', 'profile', 'email'],
  redirectUri,
  prompt: AuthSession.Prompt.Login,
  extraParams: {
    provider: provider === 'email' ? '' : provider,
    is_native: provider === 'email' ? 'true' : ''
  }
});

const result = await authRequest.promptAsync(discoveryDocument);

  if (result.type === 'success' && result.params.code) {
    const tokenResponse = await axios.post(`https://${KINDE_DOMAIN}/oauth2/token`, {
      grant_type: 'authorization_code',
      client_id: KINDE_CLIENT_ID,
      code: result.params.code,
      redirect_uri: redirectUri,
    });

    const { access_token, refresh_token, id_token } = tokenResponse.data;
    await storeTokens({ accessToken: access_token, refreshToken: refresh_token, idToken: id_token });

    const profile = await fetchUserProfile(access_token);
    setUserProfile(profile);
    setIsAuthenticated(true);
  }
};

  /**
   * Logs out the user
   */
  const logout = async () => {
    const { idToken } = await getStoredTokens();
    if (idToken) {
      await WebBrowser.openBrowserAsync(`https://${KINDE_DOMAIN}/logout?id_token_hint=${idToken}`);
    }
    await clearTokens();
    setUserProfile(null);
    setIsAuthenticated(false);
  };

  /**
   * Effect hook to check authentication status on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      const { accessToken } = await getStoredTokens();
      if (accessToken) {
        try {
          const profile = await fetchUserProfile(accessToken);
          setUserProfile(profile);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          await refreshTokens();
        }
      }
    };
    checkAuth();
  }, []);

  const contextValue: AuthContextValue = {
    login,
    logout,
    refreshTokens,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the authentication context
 * @returns {AuthContextValue & AuthStore} Authentication context value and store
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = (): AuthContextValue & AuthStore => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const store = useAuthStore();
  return { ...context, ...store };
};