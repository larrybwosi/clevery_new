import { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { AppState, AppStateStatus } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { useOnlineFriendsStore, useProfileStore } from '@/lib/zustand/store';
import { pusher } from '@/lib/pusher/config';
import { User } from '@/types';

const NOTIFICATION_CHANNEL_ID = 'friend-online';

type OnlineFriendsContextValue = {
  onlineFriends: User[];
  refreshOnlineFriends: () => void;
};

const OnlineFriendsContext = createContext<OnlineFriendsContextValue | null>(null);

export const OnlineFriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setOnlineFriends, addOnlineFriend, removeOnlineFriend, onlineFriends } = useOnlineFriendsStore();
  const { profile } = useProfileStore();

  const showOnlineNotification = useCallback(async (friend: User): Promise<void> => {
    try {
      const channelId = await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: 'Friend Online',
        importance: AndroidImportance.DEFAULT,
      });

      await notifee.displayNotification({
        title: 'Friend Online',
        body: `${friend.name} is now online`,
        android: {
          channelId,
          largeIcon: friend.image,
          importance: AndroidImportance.DEFAULT,
        },
      });
    } catch (error) {
      console.error('Error showing online notification:', error);
    }
  }, []);

  const handlePusherEvent = useCallback((event: PusherEvent) => {
    switch (event.eventName) {
      case 'pusher:member_added':
        const newMember = event.data as { id: string; info: User };
        console.log('Friend came online:', newMember.info.name);
        addOnlineFriend(newMember.info);
        showOnlineNotification(newMember.info);
        break;
      case 'pusher:member_removed':
        const removedMember = event.data as { id: string };
        console.log('Friend went offline:', removedMember.id);
        removeOnlineFriend(removedMember.id);
        break;
      case 'pusher:subscription_succeeded':
        const members = event.data as { [key: string]: User };
        const onlineUsers = Object.values(members);
        console.log('Initial online friends:', onlineUsers.length);
        setOnlineFriends(onlineUsers);
        break;
    }
  }, [addOnlineFriend, removeOnlineFriend, setOnlineFriends, showOnlineNotification]);

  const subscribeToPusherChannel = useCallback(async () => {
    if (!pusher || !profile?.id) {
      console.log('Pusher not initialized or user not logged in');
      return;
    }
    
    try {
      await pusher.subscribe({
        channelName: `presence-friends-${profile.id}`,
        onEvent: handlePusherEvent
      });
      console.log('Successfully subscribed to Pusher channel');
    } catch (error) {
      console.error('Error subscribing to Pusher channel:', error);
    }
  }, [profile?.id, handlePusherEvent]);

  const unsubscribeFromPusherChannel = useCallback(async () => {
    if (!pusher || !profile?.id) return;
    try {
      await pusher.unsubscribe({ channelName: `presence-friends-${profile.id}` });
      console.log('Unsubscribed from Pusher channel');
    } catch (error) {
      console.error('Error unsubscribing from Pusher channel:', error);
    }
  }, [profile?.id]);

  const refreshOnlineFriends = useCallback(() => {
    console.log('Refreshing online friends');
    unsubscribeFromPusherChannel().then(subscribeToPusherChannel);
  }, [unsubscribeFromPusherChannel, subscribeToPusherChannel]);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      console.log('App became active, refreshing online friends');
      refreshOnlineFriends();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      unsubscribeFromPusherChannel();
    }
  }, [refreshOnlineFriends, unsubscribeFromPusherChannel]);

  useEffect(() => {
    if (profile?.id) {
      subscribeToPusherChannel();
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      unsubscribeFromPusherChannel();
    };
  }, [profile?.id, subscribeToPusherChannel, unsubscribeFromPusherChannel, handleAppStateChange]);

  const contextValue = useMemo<OnlineFriendsContextValue>(() => ({
    onlineFriends,
    refreshOnlineFriends
  }), [onlineFriends, refreshOnlineFriends]);

  return (
    <OnlineFriendsContext.Provider value={contextValue}>
      {children}
    </OnlineFriendsContext.Provider>
  );
};

export const useOnlineFriends = (): OnlineFriendsContextValue => {
  const context = useContext(OnlineFriendsContext);
  if (!context) {
    throw new Error('useOnlineFriends must be used within an OnlineFriendsProvider');
  }
  return context;
};