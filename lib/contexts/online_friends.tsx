import { createContext, useContext, useEffect, useState } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { AppState } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { useOnlineFriendsStore, useProfileStore } from '@/lib/zustand/store';
import { pusher } from '@/lib/pusher/config';
import { User } from '@/types';

const NOTIFICATION_CHANNEL_ID = 'friend-online';

/**
 * @typedef {Object} OnlineFriendsContextValue
 * @property {User[]} onlineFriends - The list of online friends
 * @property {() => void} refreshOnlineFriends - Function to refresh online friends
 */
type OnlineFriendsContextValue = {
  onlineFriends: User[];
  refreshOnlineFriends: () => void;
};

const OnlineFriendsContext = createContext<OnlineFriendsContextValue | null>(null);

/**
 * Provider component for online friends functionality
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components
 */
export const OnlineFriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setOnlineFriends, addOnlineFriend, removeOnlineFriend, onlineFriends } = useOnlineFriendsStore();
  const { profile } = useProfileStore();

  /**
   * Subscribes to Pusher channel for friend status
   */
  const subscribeToPusherChannel = async () => {
    console.log('Subscribing to Pusher channel');
    if (!pusher || !profile?.id.trim()) {
      console.log('Pusher not initialized or user not logged in');
      return;
    }
    
    try {
      await pusher.subscribe({
        channelName: 'presence-friends',
        onEvent: (event: PusherEvent) => {
          console.log('Pusher event received:', event.eventName);
          if (event.eventName === 'pusher:member_added') {
            const member = event.data as { id: string; info: User };
            console.log('Friend came online:', member.info.name);
            addOnlineFriend(member.info);
            showOnlineNotification(member.info);
          }
          if (event.eventName === 'pusher:member_removed') {
            const member = event.data as { id: string };
            console.log('Friend went offline:', member.id);
            removeOnlineFriend(member.id);
          }
        }
      });
      console.log('Successfully subscribed to Pusher channel');
    } catch (error) {
      console.error('Error subscribing to Pusher channel:', error);
    }
  }

  /**
   * Shows a notification when a friend comes online using @notifee
   * @param {User} friend - The friend who came online
   */
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

  /**
   * Refreshes the list of online friends
   */
  const refreshOnlineFriends = () => {
    console.log('Refreshing online friends');
    // Implement logic to refresh online friends if needed
    // For now, we'll just log the current online friends
    console.log('Current online friends:', onlineFriends);
  };

  useEffect(() => {
    if (profile?.id) {
      console.log('User logged in, setting up Pusher subscription');
      subscribeToPusherChannel();
    } else {
      console.log('User not logged in, skipping Pusher subscription');
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
      if (pusher && profile?.id) {
        pusher.unsubscribe({channelName: 'presence-friends'});
        console.log('Unsubscribed from Pusher channel');
      }
    };
  }, [profile?.id]);

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

/**
 * Custom hook to use the online friends context
 * @returns {OnlineFriendsContextValue} The online friends context value
 * @throws {Error} If used outside of OnlineFriendsProvider
 */
export const useOnlineFriends = (): OnlineFriendsContextValue => {
  const context = useContext(OnlineFriendsContext);
  if (!context) {
    throw new Error('useOnlineFriends must be used within an OnlineFriendsProvider');
  }
  return context;
};