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
  useSendMessage,
  useProfileStore,
  useMarkMessagesAsSeen
} from '@/lib';
import { Loader, MessageInput, Text, View, ErrorMessage, MessagesContainer } from '@/components';
import { Message } from '@/types';
import { useImageUploader } from '@/lib/uploadthing';
import { Alert } from 'react-native';
import { openSettings } from 'expo-linking';

interface NewMessage {
  caption: string;
  file: string | undefined;
}

const UserMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<NewMessage>({
    caption: '',
    file: undefined
  });
  const [isTyping, setIsTyping] = useState(false);
  const {profile} = useProfileStore();
  
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

  const {
    mutateAsync: markAsSeen,
  } = useMarkMessagesAsSeen();

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
        channelName: `private-${conversation.id}`,
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
        pusher.unsubscribe({ channelName: `private-${conversation.id}` });
      };
    }
  }, [conversation?.id]);

  useEffect(() => {
    if (!conversation) return;
    if (conversation?.messages) {
      setMessages(conversation.messages);
    }
    const unreadIds = conversation.messages
        .filter(msg => !msg.seen && msg.senderId !== profile?.id)
        .map(msg => msg.id);
        console.log('unreadIds', unreadIds)
    if (unreadIds.length > 0) {
      markAsSeen({ conversationId: conversation.id, messageIds: unreadIds });
    }
  }, [conversation?.messages]);

  const chooseFile = useCallback(async () => {
    const file = await openImagePicker({
      // input: , // Matches the input schema from the FileRouter endpoint
      source: "library", // or "camera"
      onInsufficientPermissions: () => {
        Alert.alert(
          "No Permissions",
          "You need to grant permission to your Photos to use this",
          [
            { text: "Dismiss" },
            { text: "Open Settings", onPress: openSettings },
          ],
        );
      },
    });
    console.log(file);
    // if (file) {
    //   setNewMessage((prev) => ({ ...prev, file:file[0] }));
    // }
  }, []);

  const handleSend = useCallback(async () => {
    const { caption, file } = newMessage;
    if (!conversation || !id) return;
    if (!caption && !file?.trim()) return showToastMessage("Please input a message");

    let fileUrl = undefined
    if (file) { 
      // fileUrl = await uploadFile(file)
    }
    await sendMessage({
      conversationId: conversation.id,
      message: {
        text: caption,
        file:fileUrl
      }
    });
    
    setNewMessage({ caption: '', file: undefined});
  }, [newMessage, conversation, id, sendMessage]);

  const closeFile = useCallback(() => {
    setNewMessage((prev) => ({ ...prev, file: undefined }));
  }, []);

  
  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    /**
     * Any props here are forwarded to the underlying `useUploadThing` hook.
     * Refer to the React API reference for more info.
     */
    onClientUploadComplete: () => Alert.alert("Upload Completed"),
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });
  

  const handleMessageChange = useCallback((text: string) => {
    setNewMessage((prev) => ({ ...prev, caption: text }));
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
          <Feather name="phone-call" size={18} color={'#007aff'} onPress={() => router.push(`/call/${conversation?.id}?video=false`)} />
          <Feather name="video" size={18} color={'#007aff'} onPress={() => router.push(`/call/${conversation?.id}?video=true`)} />
        </View>
      </View>

      <MessagesContainer
        messages={sortedMessages}
        setNewMessage={(text) => setNewMessage((prev) => ({ ...prev, caption: text }))}
      />
      {isTyping && <Text className="text-gray-500 italic ml-2">{conversation?.user?.name} is typing...</Text>}
      <MessageInput
        caption={newMessage.caption}
        onMessageChange={handleMessageChange}
        onSend={handleSend}
        sending={sendingMessage}
      />
    </View>
  );
};

export default memo(UserMessages);