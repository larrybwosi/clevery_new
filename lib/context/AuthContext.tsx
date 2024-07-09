import { StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-native-sdk';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';

import { setProfile } from '@/lib/redux/features/profileSlice';
import { getCurrentUser } from '@/lib/api/users';
import { selector } from '@/lib/redux/store';

const AuthContext = createContext<any>({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<StreamVideoClient>();
  const profile = selector((state) => state.profile.profile);
  const dispatch = useDispatch();

  const user: User = { id: profile._id };
  const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!

  useEffect(() => {
    const fetchAndSetProfile = async () => {
      try {
        const currentAccount = await getCurrentUser();
        if (!currentAccount && !profile._id) {
          return router.push('/sign-in');
        }
        dispatch(setProfile({ ...currentAccount }));

        const myClient = new StreamVideoClient({ apiKey, user, tokenProvider: async () => currentAccount?.streamToken });
        setClient(myClient);

        return router.push('/');
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetProfile();

    return () => {
      client?.disconnectUser();
      setClient(undefined);
    };
  }, []);

  const value = {
    checkAuthUser: () => {
      // No need for this function since the logic is already handled in the useEffect
    },
  };

  return (
    <AuthContext.Provider value={value}>
      <StreamVideo client={client!}>{children}</StreamVideo>
    </AuthContext.Provider>
  );
}

export const checkAuthUser = () => useContext(AuthContext);