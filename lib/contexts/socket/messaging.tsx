import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import axios from 'axios';
import notifee, { AndroidImportance, AndroidStyle, AndroidCategory, EventType } from '@notifee/react-native';

import { Conversation, Message, User } from '@/types';
import { createSocketIOSDK } from '@/lib/pusher/socket';
import { endpoint } from '@/lib/env';
import { useProfileStore } from '@/lib/zustand/store';

const NOTIFICATION_CHANNEL_ID = 'new-messages';

type MessagingContextValue = {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  sendMessage: (conversationId: string, message: string) => Promise<void>;
};

const MessagingContext = createContext<MessagingContextValue | null>(null);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { profile } = useProfileStore();
  const [socketSDK, setSocketSDK] = useState(createSocketIOSDK('YOUR_SOCKET_IO_SERVER_URL'));

  const subscribeToSocketChannels = async () => {
    console.log('Subscribing to Socket.IO channels for conversations');
    if (!socketSDK || !profile.id) {
      console.log('Socket.IO not initialized or user not logged in');
      return;
    }

    try {
      await socketSDK.connect();

      conversations.forEach(async conversation => {
        await socketSDK.subscribe(`private-conversation-${conversation.id}`);
        socketSDK.bind(`private-conversation-${conversation.id}`, 'new-message', (data: { conversationId: string; message: Message; senderName: string; senderImage: string }) => {
          console.log('New message received:', data);
          handleNewMessage(data);
        });
        console.log(`Subscribed to channel: private-conversation-${conversation.id}`);
      });
    } catch (error) {
      console.error('Error subscribing to Socket.IO channels:', error);
    }
  }

  const handleNewMessage = (data: { conversationId: string; message: Message; senderName: string; senderImage: string }) => {
    console.log('New message received:', data);
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === data.conversationId
          ? { ...conv, lastMessage: data.message, unreadCount: conv.unreadMessages + 1 }
          : conv
      )
    );

    if (AppState.currentState !== 'active') {
      showNotification(data.conversationId, data.senderName, data.message.text, data.senderImage);
    }
  }

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

  const sendMessage = async (conversationId: string, message: string): Promise<void> => {
    console.log(`Sending message to conversation ${conversationId}`);
    if (!profile.id) {
      console.log('User not logged in, cannot send message');
      return;
    }

    try {
      const response = await axios.post(`${endpoint}/conversations/${conversationId}/messages`, { content: message });
      console.log('Message sent successfully');
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
      console.log('User logged in, fetching conversations and setting up Socket.IO subscriptions');
      fetchConversations();

      const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'reply') {
          const { input, notification } = detail;
          if (input && notification?.data?.conversationId) {
            sendMessage(notification.data.conversationId as string, input);
          }
        }
      });

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
    if (socketSDK && profile.id) {
      subscribeToSocketChannels();
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
      if (socketSDK && profile.id) {
        conversations.forEach(conversation => {
          socketSDK.unsubscribe(`private-conversation-${conversation.id}`);
        });
        socketSDK.disconnect();
        console.log('Unsubscribed from all conversation channels and disconnected');
      }
    };
  }, [socketSDK, conversations, profile.id]);

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

export const useMessaging = (): MessagingContextValue => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};