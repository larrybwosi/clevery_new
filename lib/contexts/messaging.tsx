import { createContext, useContext, useEffect, useState } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { AppState } from 'react-native';
import axios from 'axios';
import notifee, { AndroidImportance, AndroidStyle, AndroidCategory, EventType } from '@notifee/react-native';

import { Conversation, Message, User } from '@/types';
import { pusher } from '@/lib/pusher/config';
import { endpoint } from '@/lib/env';
import { useProfileStore } from '../zustand/store';

const NOTIFICATION_CHANNEL_ID = 'new-messages';

/**
 * @typedef {Object} MessagingContextValue
 * @property {Conversation[]} conversations - The list of user conversations
 * @property {() => Promise<void>} refreshConversations - Function to refresh conversations
 * @property {(conversationId: string, message: string) => Promise<void>} sendMessage - Function to send a message
 */
type MessagingContextValue = {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  sendMessage: (conversationId: string, message: string) => Promise<void>;
};

const MessagingContext = createContext<MessagingContextValue | null>(null);

/**
 * Provider component for messaging-related functionality
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components
 */
export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { profile } = useProfileStore();

  /**
   * Subscribes to Pusher channels for each conversation
   */
  const subscribeToPusherChannels = async () => {
    console.log('Subscribing to Pusher channels for conversations');
    if (!pusher || !profile.id) {
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
  }

  /**
   * Handles a new message event
   * @param {Object} data - The new message data
   */
  const handleNewMessage = (data: { conversationId: string; message: Message; senderName: string; senderImage: string }) => {
    console.log('New message received:', data);
    // Update the specific conversation with the new message
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === data.conversationId
          ? { ...conv, lastMessage: data.message, unreadCount: conv.unreadMessages + 1 }
          : conv
      )
    );

    // Show a notification if the app is in the background
    if (AppState.currentState !== 'active') {
      showNotification(data.conversationId, data.senderName, data.message.text, data.senderImage);
    }
  }

  /**
   * Shows a notification for a new message using @notifee
   * @param {string} conversationId - ID of the conversation
   * @param {string} senderName - Name of the message sender
   * @param {string} messageContent - Content of the message
   * @param {string} senderImage - URL of the sender's profile image
   */
  const showNotification = async (conversationId: string, senderName: string, messageContent: string, senderImage: string): Promise<void> => {
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
  };

  /**
   * Fetches conversations from the API
   * @returns {Promise<void>}
   */
  const fetchConversations = async (): Promise<void> => {
    console.log('Fetching conversations');
    if (!profile.id) {
      console.log('User not logged in, skipping conversation fetch');
      return;
    }

    try {
      const response = await axios.get<Conversation[]>(`${endpoint}/conversations`);
      setConversations(response.data);
      console.log('Conversations fetched successfully');
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  /**
   * Sends a message to a conversation
   * @param {string} conversationId - ID of the conversation
   * @param {string} message - Message content
   * @returns {Promise<void>}
   */
  const sendMessage = async (conversationId: string, message: string): Promise<void> => {
    console.log(`Sending message to conversation ${conversationId}`);
    if (!profile.id) {
      console.log('User not logged in, cannot send message');
      return;
    }

    try {
      const response = await axios.post(`${endpoint}/conversations/${conversationId}/messages`, { content: message });
      console.log('Message sent successfully');
      // Optionally update the local state with the new message
      const newMessage = response.data;
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId
            ? { ...conv, lastMessage: newMessage }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (profile.id) {
      console.log('User logged in, fetching conversations and setting up Pusher subscriptions');
      fetchConversations();

      // Set up notifee foreground event handler
      const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
          const { input, notification } = detail;
          if (input && notification?.data?.conversationId) {
            sendMessage(notification.data.conversationId as string, input);
          }
        }
      });

      // Set up notifee background event handler
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
          const { input, notification } = detail;
          if (input && notification?.data?.conversationId) {
            await sendMessage(notification.data.conversationId as string, input);
          }
        }
      });

      return () => {
        unsubscribe();
      };
    } else {
      console.log('User not logged in, skipping setup');
    }
  }, [profile.id]);

  useEffect(() => {
    if (pusher && profile.id) {
      subscribeToPusherChannels();
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App became active, refreshing conversations');
        fetchConversations();
      }
    });

    return () => {
      console.log('Cleaning up MessagingProvider');
      subscription.remove();
      if (pusher && profile.id) {
        conversations.forEach(conversation => {
          pusher.unsubscribe({channelName: `private-${conversation.id}`});
        });
        console.log('Unsubscribed from all conversation channels');
      }
    };
  }, [pusher, conversations, profile.id]);

  const contextValue: MessagingContextValue = {
    conversations,
    refreshConversations: fetchConversations,
    sendMessage,
  };

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
}

/**
 * Custom hook to use the messaging context
 * @returns {MessagingContextValue} The messaging context value
 * @throws {Error} If used outside of MessagingProvider
 */
export const useMessaging = (): MessagingContextValue => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};