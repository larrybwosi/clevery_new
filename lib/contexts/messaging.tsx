import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { AppState } from 'react-native';
import notifee, { AndroidImportance, AndroidStyle, AndroidCategory, EventType } from '@notifee/react-native';
import { useQueryClient } from '@tanstack/react-query';

import { Conversation, Message } from '@/types';
import { pusher } from '@/lib/pusher/config';
import { useProfileStore } from '../zustand/store';
import { useGetConversations, useSendMessage } from '@/lib/actions/hooks/conversation';

const NOTIFICATION_CHANNEL_ID = 'new-messages';

/**
 * Represents the value provided by the MessagingContext
 */
interface MessagingContextValue {
  /** List of user conversations */
  conversations: Conversation[];
  /** Boolean indicating if conversations are loading */
  isLoading: boolean;
  /** Any error that occurred while fetching conversations */
  error: Error | null;
  /** Function to send a message */
  sendMessage: (conversationId: string, message: string) => Promise<Message>;
}

const MessagingContext = createContext<MessagingContextValue | null>(null);

// const queryClient = new QueryClient();

/**
 * Props for the MessagingProvider component
 */
interface MessagingProviderProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Provider component for messaging-related functionality
 */
export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { profile } = useProfileStore();

  const { data: conversations = [], isLoading, error, refetch } = useGetConversations()

  const queryClient = useQueryClient();

  const {
    mutateAsync: sendMessageMutation,
    isPending: sendingMessage,
  } = useSendMessage();

  /**
   * Subscribes to Pusher channels for each conversation
   */
  const subscribeToPusherChannels = useCallback(async () => {
    console.log('Subscribing to Pusher channels for conversations');
    if (!pusher || !profile?.id) {
      console.log('Pusher not initialized or user not logged in');
      return;
    }

    conversations.forEach(async conversation => {
      try {
        await pusher.subscribe({
          channelName: `private-${conversation.id}`,
          onEvent: (event: PusherEvent) => {
            console.log('Pusher event received:', event.eventName);
            if (event.eventName === 'new-message') {
              const data = event.data as { conversationId: string; message: Message; senderName: string; senderImage: string };
              handleNewMessage(data);
            }
          }
        });
        console.log(`Subscribed to channel: private-${conversation.id}`);
      } catch (error) {
        console.error(`Error subscribing to channel for conversation ${conversation.id}:`, error);
      }
    });
  }, [conversations, profile?.id]);

  /**
   * Handles a new message event
   * @param data - The new message data
   */
  const handleNewMessage = useCallback((data: { conversationId: string; message: Message; senderName: string; senderImage: string }) => {
    console.log('New message received:', data);
    queryClient.setQueryData(['conversations', profile?.id], (oldData: Conversation[] | undefined) => 
      oldData?.map(conv => 
        conv.id === data.conversationId
          ? { ...conv, lastMessage: data.message, unreadCount: conv.unreadMessages + 1 }
          : conv
      )
    );

    if (AppState.currentState !== 'active') {
      showNotification(data.conversationId, data.senderName, data.message.text, data.senderImage);
    }
  }, [profile?.id]);

  /**
   * Shows a notification for a new message using @notifee
   * @param conversationId - ID of the conversation
   * @param senderName - Name of the message sender
   * @param messageContent - Content of the message
   * @param senderImage - URL of the sender's profile image
   */
  const showNotification = useCallback(async (conversationId: string, senderName: string, messageContent: string, senderImage: string): Promise<void> => {
    try {
      const channelId = await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: 'New Messages',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.displayNotification({
        title: `New message from ${senderName}`,
        body: messageContent,
        android: {
          channelId,
          largeIcon: senderImage,
          importance: AndroidImportance.HIGH,
          style: {
            type: AndroidStyle.MESSAGING,
            person: {
              name: senderName,
              icon: senderImage,
            },
            messages: [
              {
                text: messageContent,
                timestamp: Date.now(),
              },
            ],
          },
          category: AndroidCategory.MESSAGE,
          actions: [
            {
              title: 'Reply',
              input: {
                placeholder: 'Type your reply...',
                allowFreeFormInput: true,
              },
              pressAction: {
                id: 'reply',
              },
            },
          ],
        },
        data: { conversationId },
      });
      console.log('Notification displayed for new message');
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, []);

  useEffect(() => {
    if (profile.id) {
      console.log('User logged in, setting up Pusher subscriptions');

      const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
          const { input, notification } = detail;
          if (input && notification?.data?.conversationId) {
            sendMessageMutation({ conversationId: notification.data.conversationId as string, message:{text: input }});
          }
        }
      });

      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
          const { input, notification } = detail;
          if (input && notification?.data?.conversationId) {
            sendMessageMutation({ conversationId: notification.data.conversationId as string, message:{text: input }});
          }
        }
      });

      return () => {
        unsubscribe();
      };
    } else {
      console.log('User not logged in, skipping setup');
    }
  }, [profile?.id, sendMessageMutation]);

  useEffect(() => {
    if (pusher && profile?.id) {
      subscribeToPusherChannels();
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App became active, refreshing conversations');
        refetch();
      }
    });

    return () => {
      console.log('Cleaning up MessagingProvider');
      subscription.remove();
      if (pusher && profile?.id) {
        conversations.forEach(conversation => {
          pusher.unsubscribe({channelName: `private-${conversation.id}`});
        });
        console.log('Unsubscribed from all conversation channels');
      }
    };
  }, [pusher, conversations, profile?.id, subscribeToPusherChannels, refetch]);

  const contextValue = useMemo<MessagingContextValue>(() => ({
    conversations,
    isLoading,
    error,
    sendMessage: (conversationId: string, message: string) => 
      sendMessageMutation({ conversationId, message:{text: message } }),
  }), [conversations, isLoading, error, refetch, sendMessageMutation]);

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
}

/**
 * Wrapper component to provide React Query context
 */
export const MessagingProviderWithReactQuery: React.FC<MessagingProviderProps> = ({ children }) => (
    <MessagingProvider>{children}</MessagingProvider>
);

/**
 * Custom hook to use the messaging context
 * @returns The messaging context value
 * @throws Error if used outside of MessagingProvider
 */
export const useMessaging = (): MessagingContextValue => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};