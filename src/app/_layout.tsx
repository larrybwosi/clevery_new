import { useEffect, useRef } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Notifications from 'expo-notifications';
import { SplashScreen, Stack } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import { useFonts } from 'expo-font';
import "./global.css" 

import { Providers, pusherConnector } from '@/lib';
import { handleNotification } from '@/lib/notifications';
   
SplashScreen.preventAutoHideAsync();
 
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});
   
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};  
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'roboto-regular': "https://cdn.sanity.io/files/mqczcmfz/production/56c5c0d38bde4c1f1549dda43db37b09c608aad3.ttf",
    'roboto-bold': "https://cdn.sanity.io/files/mqczcmfz/production/3f8e401d808f6ce84b542266726514ac8be73171.ttf",
    'roboto-medium': "https://cdn.sanity.io/files/mqczcmfz/production/3c6a09fcc6a454924c81af7dff94fc6d399ed79b.ttf",
    'roboto-thin': "https://cdn.sanity.io/files/mqczcmfz/production/58c733e22bceeaf9609ce578eca92ac303c6d92f.ttf",
    "Poppins-Bold": "https://cdn.sanity.io/files/mqczcmfz/production/875cf0cecd647bcf22e79d633d868c1b1ec98dfa.ttf",
    "Poppins-Medium": "https://cdn.sanity.io/files/mqczcmfz/production/283f21b44efbdbf276ba802be2d949a36bbc4233.ttf",
    "Poppins-Regular": "https://cdn.sanity.io/files/mqczcmfz/production/fdd3002e7d814ee47c1c1b8487c72c6bbb3a2d00.ttf",
  });
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    pusherConnector()
    if (error) throw error;
    if (loaded) SplashScreen.hideAsync();
    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    // showNotification(notification.request.content);
    console.log('Notification received' ,notification.request.content.data)
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log( 'Response received' ,response.notification.request.content.data);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
  }, [error, loaded]);

  
  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}
 
function RootLayoutNav() {

  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async({ data, error, executionInfo }) => {
    await handleNotification(data);
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(server)" options={{ headerShown: false }} />
        <Stack.Screen name="conversation/[id]" options={{ presentation: 'containedModal', headerShown: false }} />
        <Stack.Screen name="user/[id]" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="settings/[setting]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="users" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="editprofile" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="welcome" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="invitation" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="channel" options={{ presentation: 'card', headerShown: false }} />
      </Stack>
  );
}


