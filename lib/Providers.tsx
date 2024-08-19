import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MessagingProvider } from './contexts/messaging';
import { AuthProvider } from './contexts/auth';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
// import { OnlineFriendsProvider } from './contexts/online_friends';
// import { MessagingProvider } from './contexts/socket/messaging';

export const Providers = ({ children }:{children:React.ReactNode}) => {

  const queryClient = new QueryClient();

  return(
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider config={config} >
          <MessagingProvider>
            {/* <OnlineFriendsProvider> */}
              {children}
            {/* </OnlineFriendsProvider> */}
          </MessagingProvider>
        </GluestackUIProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default Providers