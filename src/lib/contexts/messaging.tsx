import { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { AppState, AppStateStatus } from 'react-native';
import notifee, { 
  EventType 
} from '@notifee/react-native';

import { useGetConversations, useSendMessage } from '@/lib/actions/hooks/conversation';
import { showDirectMessageNotification } from '../notifications';
import { useProfileStore } from '@/lib/zustand/store';
import { Conversation, Message } from '@/types';
import { pusher } from '@/lib/pusher/config';
import { parseIncomingMessage } from '../utils';

/**
 * Represents the value provided by the MessagingContext
 */
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

/**
 * Provider component for messaging-related functionality
 */
export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { profile } = useProfileStore();
  const { data: conversations = [], isLoading, error, refetch } = useGetConversations();
  const queryClient = useQueryClient();
  const { mutateAsync: sendMessageMutation } = useSendMessage();

  /**
   * Handles a new message event
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

      showDirectMessageNotification(data.conversationId, data.senderName, data.message.text, data.senderImage);
      
  }, [profile?.id, queryClient]);

  /**
   * Subscribes to Pusher channels for each conversation
   */
  const subscribeToPusherChannels = useCallback(() => {
    if (!pusher || !profile?.id) {
      console.log('Pusher not initialized or user not logged in');
      return;
    }

    conversations.forEach(conversation => {
      pusher.subscribe({
        channelName: `private-${conversation.id}`,
        onEvent: (event: PusherEvent) => {
          if (event.eventName === 'new-message') {
            const cleanedObject = parseIncomingMessage(event);
            console.log(cleanedObject)
            handleNewMessage(cleanedObject as { conversationId: string; message: Message; senderName: string; senderImage: string });
          }
        }
      }).catch(error => console.error(`Error subscribing to channel for conversation ${conversation.id}:`, error));
    });
  }, [conversations, profile?.id, handleNewMessage]);

  /**
   * Unsubscribes from all Pusher channels
   */
  const unsubscribeFromPusherChannels = useCallback(() => {
    if (!pusher || !profile?.id) return;
    conversations.forEach(conversation => {
      pusher.unsubscribe({ channelName: `private-${conversation.id}` })
        .catch(error => console.error(`Error unsubscribing from channel for conversation ${conversation.id}:`, error));
    });
  }, [conversations, profile?.id]);

  /**
   * Handles app state changes
   */
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      subscribeToPusherChannels();
      refetch();
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
            sendMessageMutation({ conversationId: notification.data.conversationId as string, message: { text: input } });
          }
        }
      });

      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
          const { input, notification } = detail;
          if (input && notification?.data?.conversationId) {
            sendMessageMutation({ conversationId: notification.data.conversationId as string, message: { text: input } });
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
    sendMessage: (conversationId: string, message: string) => 
      sendMessageMutation({ conversationId, message: { text: message } }),
  }), [conversations, isLoading, error, sendMessageMutation]);

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
};

/**
 * Custom hook to use the messaging context
 */
export const useMessaging = (): MessagingContextValue => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};