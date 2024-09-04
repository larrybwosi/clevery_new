import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Linking, useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Providers, pusherConnector, useThemeStore } from '../lib';

import "../../global.css"
 
SplashScreen.preventAutoHideAsync();

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID
});

export { 
  ErrorBoundary,
} from 'expo-router'; 

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'roboto-regular': require('@/assets/fonts/Roboto-Regular.ttf'),
    'roboto-bold': require('@/assets/fonts/Roboto-Black.ttf'),
    'roboto-medium': require('@/assets/fonts/Roboto-Medium.ttf'),
    'roboto-thin': require('@/assets/fonts/Roboto-Thin.ttf'),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
    pusherConnector()
  }, [error, loaded]);


  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}

function RootLayoutNav() {

  const { mode } = useThemeStore();
  const defaultMode = useColorScheme()
  const lightmode = () => {
    if (mode === "default") return defaultMode;
    return mode;
  }

  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    console.log('Received a notification in the background! ', data, error, executionInfo);
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  return (
    <ThemeProvider value={lightmode() === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(server)" options={{ headerShown: false }} />
        <Stack.Screen name="conversation/[id]" options={{ presentation: 'containedModal', headerShown: false }} />
        <Stack.Screen name="user/[id]" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="post/[id]" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="settings/[setting]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="edit-post/[postid]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="users" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="editprofile" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}


