import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { Alert } from 'react-native';
import { openSettings } from 'expo-linking';

import {
  parseIncomingMessage,
  pusher,
  sortMessages,
  useGetConversation,
  useSendMessage,
  useProfileStore,
  useMarkMessagesAsSeen,
  showToastMessage,
  useChannel,
  useChannelMessages,
  useSendChannelMessage,
  useEditChannelMessage,
  useDeleteChannelMessage,
  useUpdateChannel,
  useDeleteChannel
} from '@/lib';
import { useImageUploader } from '@/lib/uploadthing';
import { Message } from '@/types';

interface NewMessage {
  caption: string;
  file: string | undefined;
}

const useUnifiedMessaging = () => {
  const { id, serverId } = useLocalSearchParams();
  const isChannel = !!serverId;
  const { profile } = useProfileStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<NewMessage>({ caption: '', file: undefined });
  const [isTyping, setIsTyping] = useState(false);

  const channelData = useChannelData(id as string, isChannel);
  const conversationData = useConversationData(id as string, isChannel);

  const currentChat = isChannel ? channelData.channel : conversationData.conversation;
  const isLoading = isChannel ? channelData.isLoading : conversationData.isLoading;
  const error = isChannel ? channelData.error : conversationData.error;
  const isSending = isChannel ? channelData.sendMessageLoading : conversationData.sendingDMMessage;

  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onClientUploadComplete: () => Alert.alert("Upload Completed"),
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });

  useEffect(() => {
    if (!currentChat?.id) return;

    const channelName = isChannel ? currentChat.id : `private-${currentChat.id}`;
    
    const handleEvent = (event: PusherEvent) => {
      if (event.eventName === (isChannel ? 'new-channel-message' : 'new-message')) {
        const cleanedObject = parseIncomingMessage(event);
        messageHandler(cleanedObject?.data);
      } else if (event.eventName === 'typing' && !isChannel) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    pusher.subscribe({ channelName, onEvent: handleEvent });

    return () => {
      pusher.unsubscribe({ channelName });
    };
  }, [currentChat?.id, isChannel]);

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
        conversationData.markAsSeen({ conversationId: currentChat.id, messageIds: unreadIds });
      }
    }
  }, [currentChat?.messages, isChannel, profile?.id, conversationData.markAsSeen]);

  const messageHandler = useCallback((message: Message) => {
    setMessages(prev => prev.some(msg => msg.id === message.id) ? prev : [message, ...prev]);
  }, []);

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
      setNewMessage(prev => ({ ...prev, file: file[0].serverData.url }));
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
      await channelData.sendChannelMessage(caption);
    } else {
      await conversationData.sendDMMessage({
        conversationId: currentChat.id,
        message: {
          text: caption,
          file: fileUrl
        }
      });
    }
    
    setNewMessage({ caption: '', file: undefined });
  }, [newMessage, currentChat, id, isChannel, channelData.sendChannelMessage, conversationData.sendDMMessage]);

  const closeFile = useCallback(() => {
    setNewMessage(prev => ({ ...prev, file: undefined }));
  }, []);

  const handleMessageChange = useCallback((text: string) => {
    setNewMessage(prev => ({ ...prev, caption: text }));
  }, []);

  const sortedMessages = useMemo(() => sortMessages( messages ), [messages]);

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

const useChannelData = (channelId: string, isChannel: boolean) => {
  const {
    data: channel,
    isLoading,
    error
  } = useChannel(isChannel?channelId:'');
  
  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError
  } = useChannelMessages(isChannel?channelId:'');

  const { mutateAsync: sendMessage, isPending: sendMessageLoading } = useSendChannelMessage();
  const { mutateAsync: editMessage } = useEditChannelMessage();
  const { mutateAsync: deleteMessage } = useDeleteChannelMessage();

  const serverId = useMemo(() => channel?.serverId || "", [channel]);

  const { mutate: updateChannel } = useUpdateChannel(serverId, channelId);
  const { mutate: deleteChannel } = useDeleteChannel(serverId);

  const sendChannelMessage = useCallback(async (content: string) => {
    if (serverId && channelId && content.trim()) {
      await sendMessage({ channelId, serverId, message: { text: content.trim() } });
    }
  }, [channelId, serverId, sendMessage]);
  
  return {
    channel,
    messages,
    sendChannelMessage,
    editMessage,
    deleteMessage,
    updateChannel,
    deleteChannel,
    isLoading: isLoading || messagesLoading,
    error: error || messagesError,
    sendMessageLoading
  };
};

const useConversationData = (conversationId: string, isChannel: boolean) => {
  const {
    data: conversation,
    isPending: isLoading,
    error
  } = useGetConversation(!isChannel?conversationId:'');

  const { mutateAsync: sendDMMessage, isPending: sendingDMMessage } = useSendMessage();
  const { mutateAsync: markAsSeen } = useMarkMessagesAsSeen();

  return {
    conversation,
    sendDMMessage,
    markAsSeen,
    isLoading,
    error,
    sendingDMMessage
  };
};

export default useUnifiedMessaging;