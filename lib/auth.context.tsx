import { createContext, useContext, useEffect, useState } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-native-sdk';
import { router } from 'expo-router';

import { useProfileStore } from '@/lib/zustand/store';
import { getCurrentUser } from '@/lib/api/users';

const AuthContext = createContext<any>({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<StreamVideoClient>();
  const { profile,setProfile } = useProfileStore();

  const fetchAndSetProfile = async () => {
    try {
      const currentAccount = await getCurrentUser();
      if (!currentAccount && !profile._id) {
        return router.push('/sign-in');
      }
      setProfile(currentAccount);
      return router.push('/');
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAndSetProfile();

    return () => {
      client?.disconnectUser();
      setClient(undefined);
    };
  }, []);

  const value = {
    checkAuthUser: () => {
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const checkAuthUser = () => useContext(AuthContext);

