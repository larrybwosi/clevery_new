import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/lib/contexts/auth';
const RedirectPage = () => {
  const { token, error } = useLocalSearchParams();
  const { signIn } = useAuth(); // Assume you have a signIn method in your AuthContext

  useEffect(() => {
    const handleRedirect = async () => {
      if (error) {
        console.error('Authentication error:', error);
        router.replace('/sign-up?error=Authentication failed');
        return;
      }

      if (token) {
        try {
          const decodedToken = AuthSession.TokenResponse.fromQueryParams({ access_token: token as string });
          
          // Validate the token and get user info
          const userInfo = await fetchUserInfo(decodedToken.accessToken);
          
          // Sign in the user
          await signIn(userInfo);
          
          // Redirect to the home page or dashboard
          router.replace('/home');
        } catch (err) {
          console.error('Error processing authentication:', err);
          router.replace('/login?error=Authentication processing failed');
        }
      } else {
        router.replace('/login?error=No token received');
      }
    };

    handleRedirect();
  }, [token, error, router, signIn]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Processing your login...</Text>
    </View>
  );
};

// Function to fetch user info using the access token
const fetchUserInfo = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  
  return response.json();
};

export default RedirectPage;