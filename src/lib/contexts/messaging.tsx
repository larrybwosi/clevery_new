import React, { createContext, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import notifee, { EventType } from '@notifee/react-native';
import { AppState, AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { useGetConversations, useSendMessage } from '@/lib/actions/hooks/conversation';
import { displayNotifications, showDirectMessageNotification } from '@/lib/notifications';
import { useProfileStore } from '@/lib/zustand/store';
import { parseIncomingMessage } from '@/lib/utils';
import { Conversation, Message } from '@/types';
import { pusher } from '@/lib/pusher/config';
import { endpoint } from '../env';

interface MessagingContextValue {
  conversations: Conversation[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (conversationId: string, message: string) => Promise<Message>;
}

const MessagingContext = createContext<MessagingContextValue | null>(null);

interface MessagingProviderProps {
  children: React.ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = React.memo(({ children }) => {
  const { profile } = useProfileStore();
  const { data: conversations = [], isLoading, error, refetch } = useGetConversations();
  const queryClient = useQueryClient();
  const { mutateAsync: sendMessageMutation } = useSendMessage();

  const conversationsRef = useRef(conversations);
  const profileIdRef = useRef(profile?.id);

  const notification =async() => {
    const notifications = await fetch(`${endpoint}/profile/notifications`).then( async res => await res.json());
    await displayNotifications(notifications)
  }

  useEffect(() => {
    notification();
    conversationsRef.current = conversations;
    profileIdRef.current = profile?.id;
  }, [conversations, profile?.id]);

  const handleNewMessage = useCallback(async(data: { conversationId: string; message: Message; senderName: string; senderImage: string }) => {
    console.log('New message received:', data);
    queryClient.setQueryData(['conversations', profileIdRef.current], (oldData: Conversation[] | undefined) => 
      oldData?.map(conv => 
        conv.id === data.conversationId
          ? { ...conv, lastMessage: data.message, unreadCount: conv.unreadMessages + 1 }
          : conv
      )
    );

    await showDirectMessageNotification(data.conversationId, data.senderName, data.message.text, data.senderImage)
      .catch(error => console.error('Failed to show notification:', error));
  }, [queryClient]);

  const subscribeToPusherChannels = useCallback(() => {
    if (!pusher || !profileIdRef.current) {
      console.warn('Pusher not initialized or user not logged in');
      return;
    }

    conversationsRef.current.forEach(conversation => {
      pusher.subscribe({
        channelName: `private-${conversation.id}`,
        onEvent: (event: PusherEvent) => {
          if (event.eventName === 'new-message') {
            try {
              const cleanedObject = parseIncomingMessage(event);
              handleNewMessage(cleanedObject as { conversationId: string; message: Message; senderName: string; senderImage: string });
            } catch (error) {
              console.error('Error parsing incoming message:', error);
            }
          }
        }
      }).catch(error => console.error(`Error subscribing to channel for conversation ${conversation.id}:`, error));
    });
  }, [handleNewMessage]);

  const unsubscribeFromPusherChannels = useCallback(() => {
    if (!pusher || !profileIdRef.current) return;
    conversationsRef.current.forEach(conversation => {
      pusher.unsubscribe({ channelName: `private-${conversation.id}` })
        .catch(error => console.error(`Error unsubscribing from channel for conversation ${conversation.id}:`, error));
    });
  }, []);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      subscribeToPusherChannels();
      refetch().catch(error => console.warn('Failed to refetch conversations:', error));
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      unsubscribeFromPusherChannels();
    }
  }, [subscribeToPusherChannels, unsubscribeFromPusherChannels, refetch]);

  useEffect(() => {
    if (profile.id) {
      const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
          const { input, notification } = detail;
          if (input && notification?.data?.conversationId) {
            sendMessageMutation({ conversationId: notification.data.conversationId as string, message: { text: input } })
              .catch(error => console.error('Failed to send message:', error));
          }
        }
      });

      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
          const { input, notification } = detail;
          if (input && notification?.data?.conversationId) {
            try {
              await sendMessageMutation({ conversationId: notification.data.conversationId as string, message: { text: input } });
            } catch (error) {
              console.error('Failed to send message in background:', error);
            }
          }
        }
      });

      return unsubscribeNotifee;
    }
  }, [profile?.id, sendMessageMutation]);

  useEffect(() => {
    if (pusher && profile?.id) {
      subscribeToPusherChannels();
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      unsubscribeFromPusherChannels();
    };
  }, [pusher, profile?.id, subscribeToPusherChannels, unsubscribeFromPusherChannels, handleAppStateChange]);

  const contextValue = useMemo<MessagingContextValue>(() => ({
    conversations,
    isLoading,
    error,
    sendMessage: async (conversationId: string, message: string) => {
      try {
        return await sendMessageMutation({ conversationId, message: { text: message } });
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },
  }), [conversations, isLoading, error, sendMessageMutation]);

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
});

export const useMessaging = (): MessagingContextValue => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};