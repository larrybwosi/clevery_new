// MessagingProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import axios from 'axios';
import notifee, { AndroidImportance, AndroidStyle, AndroidCategory } from '@notifee/react-native';

import { Conversation, Message } from '@/types';
import { endpoint } from '@/lib/env';
import { useProfileStore } from '../zustand/store';
import { createSocketIOSDK } from './socket';

const NOTIFICATION_CHANNEL_ID = 'new-messages';

// Create the Socket.IO SDK instance
const socketio = createSocketIOSDK(endpoint);

// ... (keep the rest of the types and context definition as before)

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { profile } = useProfileStore();

  const subscribeToPusherChannels = async () => {
    console.log('Subscribing to Socket.IO channels for conversations');
    if (!profile.id) {
      console.log('User not logged in');
      return;
    }

    conversations.forEach(async conversation => {
      try {
        await socketio.subscribe({
          channelName: `private-conversation-${conversation.id}`,
          onEvent: (event: any) => {
            console.log('Socket.IO event received:', event.eventName);
            if (event.eventName === 'new-message') {
              const data = event.data as { conversationId: string; message: Message; senderName: string; senderImage: string };
              handleNewMessage(data);
            }
          }
        });
        console.log(`Subscribed to channel: private-conversation-${conversation.id}`);
      } catch (error) {
        console.error(`Error subscribing to channel for conversation ${conversation.id}:`, error);
      }
    });
  }

  // ... (keep the rest of the functions like handleNewMessage, showNotification, etc. as before)

  useEffect(() => {
    if (profile.id) {
      console.log('User logged in, connecting to Socket.IO and fetching conversations');
      socketio.connect();
      fetchConversations();

      // ... (keep the notifee setup as before)

      return () => {
        socketio.disconnect();
      };
    } else {
      console.log('User not logged in, skipping setup');
    }
  }, [profile.id]);

  useEffect(() => {
    if (profile.id) {
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
      if (profile.id) {
        conversations.forEach(conversation => {
          socketio.unsubscribe({channelName: `private-conversation-${conversation.id}`});
        });
        console.log('Unsubscribed from all conversation channels');
      }
    };
  }, [conversations, profile.id]);

  // ... (keep the rest of the component as before)
}

// ... (keep the useMessaging hook as before)