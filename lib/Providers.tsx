import { ReactNode } from 'react'
import { StreamVideoRN } from '@stream-io/video-react-native-sdk';
import { AndroidImportance } from '@notifee/react-native';
import { NativeBaseProvider } from 'native-base'

import { QueryProvider } from './react-query/QueryProvider' 
import { AuthProvider } from '@/lib/auth.context'

StreamVideoRN.updateConfig({
  foregroundService: {
    android: {
      channel: {
        id: 'stream_call_foreground_service',
        name: 'Service to keep call alive',
        lights: false,
        vibration: false,
        importance: AndroidImportance.DEFAULT,
      }, 
      notificationTexts: {
        title: 'Call is in progress',
        body: 'Tap to return to the call',
      },
    },
  },
});
export const Providers = ({ children }:{children:ReactNode}) => {


  const config = {
    dependencies: {
      "linear-gradient": require("expo-linear-gradient").LinearGradient,
    },
  };
  return(
    <QueryProvider>
      <NativeBaseProvider config={config} >
        <AuthProvider>
          {children}
        </AuthProvider>
      </NativeBaseProvider>
    </QueryProvider>
  )
}

export default Providers