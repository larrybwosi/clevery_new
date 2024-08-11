import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { useOnlineFriendsStore, useProfileStore } from '@/lib/zustand/store';
import { User } from '@/types';
import { createSocketIOSDK } from '@/lib/pusher/socket';

const NOTIFICATION_CHANNEL_ID = 'friend-online';

type OnlineFriendsContextValue = {
  onlineFriends: User[];
  refreshOnlineFriends: () => void;
};

const OnlineFriendsContext = createContext<OnlineFriendsContextValue | null>(null);

export const OnlineFriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setOnlineFriends, addOnlineFriend, removeOnlineFriend, onlineFriends } = useOnlineFriendsStore();
  const { profile } = useProfileStore();
  const [socketSDK, setSocketSDK] = useState(createSocketIOSDK('YOUR_SOCKET_IO_SERVER_URL'));

  const subscribeToSocketChannel = async () => {
    console.log('Subscribing to Socket.IO channel');
    if (!socketSDK || !profile.id.trim()) {
      console.log('Socket.IO not initialized or user not logged in');
      return;
    }
    
    try {
      await socketSDK.connect();
      await socketSDK.subscribe('presence-friends');
      
      socketSDK.bind('presence-friends', 'member_added', (data: { id: string; info: User }) => {
        console.log('Friend came online:', data.info.name);
        addOnlineFriend(data.info);
        showOnlineNotification(data.info);
      });

      socketSDK.bind('presence-friends', 'member_removed', (data: { id: string }) => {
        console.log('Friend went offline:', data.id);
        removeOnlineFriend(data.id);
      });

      console.log('Successfully subscribed to Socket.IO channel');
    } catch (error) {
      console.error('Error subscribing to Socket.IO channel:', error);
    }
  }

  const showOnlineNotification = async (friend: User): Promise<void> => {
    try {
      const channel = await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: 'Friend Online',
        importance: AndroidImportance.DEFAULT,
      });

      await notifee.displayNotification({
        title: 'Friend Online',
        body: `Your friend, ${friend.name} is now online`,
        android: {
          channelId: channel,
          largeIcon: friend.image,
          importance: AndroidImportance.DEFAULT,
        },
      });
      console.log('Online notification displayed for:', friend.name);
    } catch (error) {
      console.error('Error showing online notification:', error);
    }
  };

  const refreshOnlineFriends = () => {
    console.log('Refreshing online friends');
    console.log('Current online friends:', onlineFriends);
  };

  useEffect(() => {
    if (profile.id) {
      console.log('User logged in, setting up Socket.IO subscription');
      subscribeToSocketChannel();
    } else {
      console.log('User not logged in, skipping Socket.IO subscription');
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App became active, refreshing online friends');
        refreshOnlineFriends();
      }
    });

    return () => {
      console.log('Cleaning up OnlineFriendsProvider');
      subscription.remove();
      if (socketSDK && profile.id) {
        socketSDK.unsubscribe('presence-friends');
        socketSDK.disconnect();
        console.log('Unsubscribed from Socket.IO channel and disconnected');
      }
    };
  }, [profile.id]);

  const contextValue: OnlineFriendsContextValue = {
    onlineFriends,
    refreshOnlineFriends
  };

  return (
    <OnlineFriendsContext.Provider value={contextValue}>
      {children}
    </OnlineFriendsContext.Provider>
  );
}

export const useOnlineFriends = (): OnlineFriendsContextValue => {
  const context = useContext(OnlineFriendsContext);
  if (!context) {
    throw new Error('useOnlineFriends must be used within an OnlineFriendsProvider');
  }
  return context;
};