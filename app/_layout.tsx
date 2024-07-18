import { useEffect } from 'react';
import {SplashScreen, Stack, router} from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { Providers,pusherConnector, useThemeStore } from '@/lib';
import {  useColorScheme } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Linking from "expo-linking"

export { 
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};


function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
const [loaded, error] = useFonts({
  'roboto-regular': require('@/assets/fonts/Roboto-Regular.ttf'),
  'roboto-bold': require('@/assets/fonts/Roboto-Black.ttf'),
  'roboto-medium': require('@/assets/fonts/Roboto-Medium.ttf'),
  'roboto-thin': require('@/assets/fonts/Roboto-Thin.ttf'),
  "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
  "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
  "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
  "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
  "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
  "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
  "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
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
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const url = response.notification.request.content.data.url;
    Linking.openURL(url);
  });
    
    
  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    console.log('Received a notification in the background!  ',data);
    // Do something with the notification data
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

  return () => subscription.remove();
}, [error,loaded]); 


  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}

function RootLayoutNav() {
  
  const { mode } = useThemeStore();
  const defaultMode = useColorScheme()
  useNotificationObserver()
  const lightmode = () => {
    if (mode ==="default") return defaultMode;
     return mode; 
  }

  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    console.log('Received a notification in the background! ',data, error, executionInfo);
  });
  
  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  return (
    <ThemeProvider value={lightmode() === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
      <Stack.Screen name="(server)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ presentation: 'modal' , headerShown: false }} />
      <Stack.Screen name="conversation/[friendid]" options={{ presentation: 'containedModal', headerShown: false  }} />
      <Stack.Screen name="user/[email]" options={{ presentation: 'modal', headerShown: false  }} />
      <Stack.Screen name="post/[id]" options={{ presentation: 'modal', headerShown: false  }} />
      <Stack.Screen name="settings/[setting]" options={{ presentation: 'card', headerShown: false  }} />
      <Stack.Screen name="edit-post/[postid]" options={{ presentation: 'card', headerShown: false  }} />
      <Stack.Screen name="users" options={{ presentation: 'modal' , headerShown: false }} />
      <Stack.Screen name="room" options={{ presentation: 'modal' , headerShown: false }} />
      <Stack.Screen name="editprofile" options={{ presentation: 'modal' , headerShown: false }} />
    </Stack>
  </ThemeProvider>
  );
}


