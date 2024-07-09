import { ReactNode } from 'react'
import { StreamVideoRN } from '@stream-io/video-react-native-sdk';
import { AndroidImportance } from '@notifee/react-native';
import { NativeBaseProvider } from 'native-base'

import { QueryProvider } from './react-query/QueryProvider' 
import { AuthProvider } from './context/AuthContext'
import { ReduxProvider } from './redux/Provider'

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

  return(
    <ReduxProvider>
      <QueryProvider>
        <AuthProvider>
          <NativeBaseProvider>
            {children}
          </NativeBaseProvider>
        </AuthProvider>
      </QueryProvider>
    </ReduxProvider>
   )
}

export default Providers