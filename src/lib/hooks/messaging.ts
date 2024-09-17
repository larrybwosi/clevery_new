import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { Alert } from 'react-native';
import { openSettings } from 'expo-linking';

import {
  parseIncomingMessage,
  pusher,
  sortMessages,
  useChannelData,
  useGetConversation,
  useSendMessage,
  useProfileStore,
  useMarkMessagesAsSeen,
  showToastMessage
} from '@/lib';
import { useImageUploader } from '@/lib/uploadthing';
import { Channel, Conversation, Message } from '@/types';

interface NewMessage {
  caption: string;
  file: string | undefined;
}

const useUnifiedMessaging = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<NewMessage>({ caption: '', file: undefined });
  const [isTyping, setIsTyping] = useState(false);
  const { profile } = useProfileStore();
  
  const { id, serverId } = useLocalSearchParams();
  const isChannel = Boolean(serverId);

  const channelData = useChannelData(id as string);
  const {
    data: conversation,
    isPending: loadingConversation,
    error: conversationError
  } = useGetConversation(id as string);

  const { mutateAsync: sendDMMessage, isPending: sendingDMMessage } = useSendMessage();
  const { mutateAsync: markAsSeen } = useMarkMessagesAsSeen();

  const {
    channel,
    sendChannelMessage,
    isLoading: loadingChannel,
    sendMessageLoading: sendingChannelMessage,
    error: channelError
  } = channelData;

  const isLoading = isChannel ? loadingChannel : loadingConversation;
  const error = isChannel ? channelError : conversationError;
  const isSending = isChannel ? sendingChannelMessage : sendingDMMessage;

  const currentChat:any= isChannel ? channel : conversation;

  const messageHandler = useCallback((message: Message) => {
    setMessages((prev) => {
      if (prev.find((msg) => msg.id === message.id)) {
        return prev;
      } else {
        return [message, ...prev];
      }
    });
  }, []);

  useEffect(() => {
    if (!currentChat?.id) return;

    const channelName = isChannel ? currentChat.id : `private-${currentChat.id}`;
    
    pusher.subscribe({
      channelName,
      onEvent: (event: PusherEvent) => {
        if (event.eventName === (isChannel ? 'new-channel-message' : 'new-message')) {
          const cleanedObject = parseIncomingMessage(event);
          messageHandler(cleanedObject?.data);
        } else if (event.eventName === 'typing' && !isChannel) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      }
    });

    return () => {
      pusher.unsubscribe({ channelName });
    };
  }, [currentChat?.id, isChannel, messageHandler]);

  useEffect(() => {
    if (!currentChat) return;
    if (currentChat.messages) {
      setMessages(currentChat.messages);
    }
    if (!isChannel) {
      const unreadIds = currentChat.messages
        .filter(msg => !msg.seen && msg.senderId !== profile?.id)
        .map(msg => msg.id);
      if (unreadIds.length > 0) {
        markAsSeen({ conversationId: currentChat.id, messageIds: unreadIds });
      }
    }
  }, [currentChat?.messages, isChannel, profile?.id, markAsSeen]);

  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onClientUploadComplete: () => Alert.alert("Upload Completed"),
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });

  const chooseFile = useCallback(async () => {
    const file = await openImagePicker({
      source: "library",
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
    if (file) {
      setNewMessage((prev) => ({ ...prev, file: file[0].serverData.url }));
    }
  }, [openImagePicker]);

  const handleSend = useCallback(async () => {
    const { caption, file } = newMessage;
    if (!currentChat || !id) return;
    if (!caption && !file) return showToastMessage("Please input a message");

    let fileUrl;
    if (file) {
      // Implement file upload logic here
      // fileUrl = await uploadFile(file);
    }

    if (isChannel) {
      await sendChannelMessage(caption);
    } else {
      await sendDMMessage({
        conversationId: currentChat.id,
        message: {
          text: caption,
          file: fileUrl
        }
      });
    }
    
    setNewMessage({ caption: '', file: undefined });
  }, [newMessage, currentChat, id, isChannel, sendChannelMessage, sendDMMessage]);

  const closeFile = useCallback(() => {
    setNewMessage((prev) => ({ ...prev, file: undefined }));
  }, []);

  const handleMessageChange = useCallback((text: string) => {
    setNewMessage((prev) => ({ ...prev, caption: text }));
  }, []);

  const sortedMessages = useMemo(() => sortMessages({ messages }), [messages]);

  return {
    messages: sortedMessages,
    newMessage,
    isTyping,
    isLoading,
    isSending,
    error,
    currentChat,
    isChannel,
    handleMessageChange,
    handleSend,
    chooseFile,
    closeFile,
    setNewMessage,
    isUploading
  };
};

export default useUnifiedMessaging;