import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 30,
    },
  },
});
import { 
  DarkTheme, 
  DefaultTheme, 
  ThemeProvider 
} from '@react-navigation/native';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { MessagingProvider } from './contexts/messaging';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { useThemeStore } from './zustand/store';
import { AuthProvider } from './contexts/auth';
import { useColorScheme } from 'react-native';

export const Providers = ({ children }:{children:React.ReactNode}) => {
  const defaultMode = useColorScheme()
  const { mode } = useThemeStore();

    const lightmode = (): 'light' | 'dark' => {
    if (mode === 'default') return defaultMode;
    return mode;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MessagingProvider>
          <ThemeProvider value={lightmode() === 'dark' ? DarkTheme : DefaultTheme}>
            <GestureHandlerRootView>
              <GluestackUIProvider mode={lightmode()} >
                <OverlayProvider>
                  {children}
                </OverlayProvider>
              </GluestackUIProvider>
            </GestureHandlerRootView>
          </ThemeProvider>
        </MessagingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Providers