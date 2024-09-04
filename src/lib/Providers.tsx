import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MessagingProvider } from './contexts/messaging';
import { AuthProvider } from './contexts/auth';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useThemeStore } from './zustand/store';
import { useColorScheme } from 'nativewind';

export const Providers = ({ children }:{children:React.ReactNode}) => {

  const queryClient = new QueryClient();
  const { mode } = useThemeStore();
  const defaultMode = useColorScheme()
    const lightmode = (): 'light' | 'dark' => {
      //@ts-ignore
    if (mode === 'default') return defaultMode;
    return mode;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MessagingProvider>
          <GluestackUIProvider mode={lightmode()} >
            <OverlayProvider>
              {children}
            </OverlayProvider>
          </GluestackUIProvider>
        </MessagingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Providers