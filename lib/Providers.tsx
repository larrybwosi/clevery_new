import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MessagingProvider } from './contexts/messaging';
import { AuthProvider } from './contexts/auth';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

export const Providers = ({ children }:{children:React.ReactNode}) => {

  const queryClient = new QueryClient();

  return(
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <MessagingProvider>
          <GluestackUIProvider>
            <OverlayProvider>
              {children}
            </OverlayProvider>
          </GluestackUIProvider>
        </MessagingProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default Providers