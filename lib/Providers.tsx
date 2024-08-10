import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StreamVideoRN } from '@stream-io/video-react-native-sdk';
import { NativeBaseProvider } from 'native-base'

import { MessagingProvider } from './contexts/messaging';
import { AuthProvider } from './contexts/auth';
import { OnlineFriendsProvider } from './contexts/online_friends';


StreamVideoRN.updateConfig({
  foregroundService: {
    android: {
      notificationTexts: {
        title: 'Call is in progress',
        body: 'Tap to return to the call',
      },
    },
  },
});
export const Providers = ({ children }:{children:React.ReactNode}) => {

  const queryClient = new QueryClient();

  const config = {
    dependencies: {
      "linear-gradient": require("expo-linear-gradient").LinearGradient,
    },
  };
  return(
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider config={config} >
          <MessagingProvider>
            <OnlineFriendsProvider>
              {children}
            </OnlineFriendsProvider>
          </MessagingProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default Providers