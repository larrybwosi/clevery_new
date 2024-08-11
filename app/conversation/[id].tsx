import { memo, useEffect, useState, useCallback } from 'react';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

import {
  selectImage,
  sortMessages,
  pusher,
  parseIncomingMessage,
  showToastMessage,
  useGetConversation,
  useSendMessage
} from '@/lib';
import { Loader, MessageInput, Text, View, ErrorMessage, Messages } from '@/components';
import { Message } from '@/types';

interface NewMessage {
  caption: string;
  file: any[];
}

const UserMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<NewMessage>({
    caption: '',
    file: []
  });
  const [isTyping, setIsTyping] = useState(false);

  const { id } = useLocalSearchParams();

  const {
    data: conversation,
    isPending: loadingConversation,
    error: conversationError
  } = useGetConversation(id as string);

  const {
    mutateAsync: sendMessage,
    isPending: sendingMessage,
  } = useSendMessage();

  useEffect(() => {
    const messageHandler = (message: Message) => {
      setMessages((prev) => {
        if (prev.find((msg) => msg.id === message.id)) {
          return prev;
        } else {
          return [message, ...prev];
        }
      });
    };

    if (conversation?.id) {
      pusher.subscribe({
        channelName: conversation.id,
        onEvent: (event: PusherEvent) => {
          if (event.eventName === 'new-message') {
            const cleanedObject = parseIncomingMessage(event);
            messageHandler(cleanedObject?.data);
          } else if (event.eventName === 'typing') {
            setIsTyping(true);
            // Reset typing indicator after 3 seconds
            setTimeout(() => setIsTyping(false), 3000);
          }
        }
      });

      return () => {
        pusher.unsubscribe({ channelName: conversation.id });
      };
    }
  }, [conversation?.id]);

  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages);
    }
  }, [conversation?.messages]);

  const chooseFile = useCallback(async () => {
    const file = await selectImage();
    if (file) {
      setNewMessage((prev) => ({ ...prev, file }));
    }
  }, []);

  const handleSend = useCallback(async () => {
    const { caption, file } = newMessage;
    if (!conversation || !id) return;
    if (!caption && !file.length) return showToastMessage("Please input a message");

    await sendMessage({
      conversationId: conversation.id,
      message: {
        text: caption
      }
    });

    setNewMessage({ caption: '', file: [] });
  }, [newMessage, conversation, id, sendMessage]);

  const closeFile = useCallback(() => {
    setNewMessage((prev) => ({ ...prev, file: [] }));
  }, []);

  const handleMessageChange = useCallback((text: string) => {
    setNewMessage((prev) => ({ ...prev, caption: text }));
    // Emit typing event
    if (conversation?.id) {
      pusher.trigger({
        channelName: conversation.id,
        eventName: 'typing',
        data: {}
      });
    }
  }, [conversation?.id]);

  if (loadingConversation) return <Loader loadingText='Loading your conversation' />;
  if (conversationError) return <ErrorMessage message='Network error' onRetry={() => {}} />;

  const sortedMessages = sortMessages({ messages });

  return (
    <View className='flex-1 p-1 pt-7'>
      <Ionicons
        name="arrow-back"
        size={24}
        color="#007aff"
        onPress={() => router.back()}
        className='absolute top-[30px] left-[15px] mr-2.5 z-30 mb-2.5 br-[5px] mx-1'
      />
      <View className='flex-row justify-between pb-2 border-b-[.5px] border-gray-500'>
        <Text className='text-sm font-pbold ml-[20%] mt-1.5'>
          @{conversation?.user?.username}
        </Text>
        <View className='flex-row items-center gap-5'>
          <Feather name="phone-call" size={18} color={'#007aff'} onPress={() => router.navigate("/call")} />
          <Feather name="video" size={18} color={'#007aff'} onPress={() => router.navigate("/room")} />
        </View>
      </View>

      <Messages
        conversation={conversation!}
        messages={sortedMessages}
        setNewMessage={(text) => setNewMessage((prev) => ({ ...prev, caption: text }))}
        newMessage={newMessage}
        closeFile={closeFile}
        createdAt={conversation?.createdAt!}
      />
      {isTyping && <Text className="text-gray-500 italic ml-2">User is typing...</Text>}
      <MessageInput
        caption={newMessage.caption}
        onMessageChange={handleMessageChange}
        onSend={handleSend}
        sending={sendingMessage}
        onChooseFile={chooseFile}
      />
    </View>
  );
};

export default memo(UserMessages);