import React, { useState, useCallback, useMemo } from 'react';
import { TextInput, Linking, Text as RNText, View as RNView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import Image from '@/components/image';
import { Text, View } from '@/components/themed'; 
import { formatDateString } from '@/lib';
import PopupComponent from './popup';
import { HStack } from '@/components/ui/hstack';

interface Message {
  id: string;
  createdAt: string;
  text: string;
  timestamp: string;
  sender: {
    image: string;
    name: string;
    isAdmin?: boolean;
  };
  isSeparator?: boolean;
  file?: string;
  reactions?: { [key: string]: string[] };
  replyTo?: {
    id: string;
    text: string;
    sender: {
      name: string;
    };
  };
}



const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MessageSeparator: React.FC<{ message: Message }> = React.memo(({ message }) =>{ 
  if (!message.isSeparator) return null;

  return(
    <RNView className='flex-row items-center my-3'>
      <RNView className='flex-1 h-[0.35px] bg-gray-400' />
      <Text className="font-rregular mx-2 text-[8px]">{message.text}</Text>
      <RNView className='flex-1 h-[0.35px] bg-gray-400' />
    </RNView>
  )
});

const ReactionButton: React.FC<{ reaction: string; count: number; onPress: () => void }> = React.memo(
  ({ reaction, count, onPress }) => (
    <Pressable
      className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-2 flex-row items-center"
      onPress={onPress}
    >
      <Text className="mr-1">{reaction}</Text>
      <Text className="text-xs text-gray-600 font-rmedium">{count}</Text>
    </Pressable>
  )
);

const MessageContent: React.FC<{ text: string }> = React.memo(({ text }) => {
  const parts = useMemo(() => text?.split(/(@\w+)|(https?:\/\/[^\s]+)/g), [text]);
  
  return (
    <>
      {parts?.map((part, index) => {
        if (part?.startsWith('@')) {
          return <RNText key={index} className="text-blue-500 font-rmedium">{part}</RNText>;
        } else if (part?.startsWith('http')) {
          return (
            <RNText
              key={index}
              className="text-blue-500 underline font-rmedium"
              onPress={() => Linking.openURL(part)}
            >
              {part}
            </RNText>
          );
        }
        return <Text key={index} className="font-rregular">{part}</Text>;
      })}
    </>
  );
});

interface MessageItemProps {
  message: Message;
  onReply: (text: string, messageId: string) => void;
  onReact: (reaction: string, messageId: string) => void;
  previousMessage?: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onReply, onReact, previousMessage }) => {
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const handleReply = useCallback(() => {
    if (!replyText.trim()) return;
    onReply(replyText, message.id);
    setReplyText('');
    setIsReplying(false);
  }, [replyText, message.id, onReply]);

  const handleLongPress = useCallback(() => {
    setIsPopupVisible(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupVisible(false);
  }, []);

  const handleSetMessage = useCallback((newMessage: string) => {
    // Implement the logic to update the message
    console.log('Update message:', newMessage);
  }, []);

  const SWIPE_THRESHOLD = 50; // Minimum distance to trigger the swipe action
  const ACTIVATION_THRESHOLD = 20; // Minimum distance to start the gesture

  const gesture = Gesture.Pan()
    .minDistance(ACTIVATION_THRESHOLD)
    .activeOffsetX([-ACTIVATION_THRESHOLD, ACTIVATION_THRESHOLD])
    .onStart(() => {
      'worklet';
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = Math.max(0, Math.min(event.translationX + context.value.x, 100));
    })
    .onEnd(() => {
      'worklet';
      if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(setIsReplying)(!isReplying);
        translateX.value = withTiming(100, { duration: 150 });
      }
      translateX.value = withSpring(0, { damping: 15 });
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rReplyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 100], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateX: interpolate(translateX.value, [0, 100], [-100, 0], Extrapolation.CLAMP) },
    ],
  }));
  const renderFile = useCallback(() => {
    if (!message.file) return null;
    if (message.file.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return <Image source={message.file} width={270} height={288} style="w-full h-60 border border-gray-300 rounded-[10px] shadow-lg" />;
    }
    return (
      <View className="flex-row items-center mt-2 bg-gray-100 p-2 rounded-lg">
        <Feather name="file" size={24} color="#4B5563" />
        <Text className="ml-2 text-gray-600 font-rmedium">Attached file</Text>
      </View>
    );
  }, [message.file]);

  const renderReactions = useCallback(() => {
    if (!message.reactions) return null;
    return (
      <View className="flex-row flex-wrap mt-2">
        {Object.entries(message.reactions).map(([reaction, users]) => (
          <ReactionButton
            key={reaction}
            reaction={reaction}
            count={users.length}
            onPress={() => onReact(reaction, message.id)}
          />
        ))}
      </View>
    );
  }, [message.reactions, message.id, onReact]);

  const renderReplyPreview = useCallback(() => {
    if (!message.replyTo) return null;
    return (
      <View className="bg-gray-100 p-2 rounded-lg mb-2">
        <Text className="text-xs text-gray-500 font-rmedium">
          Replying to {message.replyTo.sender.name}
        </Text>
        <Text className="text-sm text-gray-700 font-rregular" numberOfLines={1}>
          {message.replyTo.text}
        </Text>
      </View>
    );
  }, [message.replyTo]);

  const isNewSender = !previousMessage || previousMessage?.sender?.name !== message?.sender?.name;

  
  if (message.isSeparator) {
    return <MessageSeparator message={message} />;
  }
  
  return (
    <>
      <GestureDetector gesture={gesture}>
      <Animated.View className="flex-row mb-1">
        <Animated.View style={[rReplyStyle]} className="absolute left-0 h-full justify-center">
          <View className="bg-blue-500 p-2 rounded-r-lg">
            <Feather name="corner-up-left" size={24} color="white" />
          </View>
        </Animated.View>
        <Animated.View style={[rStyle]} className="flex-1">
          <AnimatedPressable onLongPress={() => setIsPopupVisible(true)}>
            <View className="px-4">
              {isNewSender && (
                <View className="flex-row items-center mt-2 mb-1">
                  <Image
                    source={message.sender?.image}
                    width={80}
                    height={80}
                    style="rounded-2xl border border-gray-300 h-10 w-10 mr-3"
                  />
                  <HStack space='2xl' className='justify-between'>
                    <Text className="ml-2 font-rbold text-gray-800">{message?.sender?.name}</Text>
                    <Text className='text-[8px] font-rregular'>{formatDateString(message.createdAt)}</Text>
                  </HStack>
                  {message?.sender?.isAdmin && (
                    <Feather name="shield" size={14} color="#4B5563" className="ml-1" />
                  )}
                </View>
              )}
              <View className="flex-row">
                {!isNewSender && <View className="w-6" />}
                <View className="flex-1">
                  {renderReplyPreview()}
                  <Text className="text-gray-700 mb-1">
                    <MessageContent text={message.text} />
                  </Text>
                  {renderFile()}
                  {renderReactions()}
                </View>
              </View>
              <Text className="text-xs text-gray-500 font-rregular mt-1">{message?.timestamp}</Text>
            </View>
          </AnimatedPressable>
          {isReplying && (
            <Animated.View 
              entering={FadeIn.duration(200)} 
              exiting={FadeOut.duration(200)}
              className="mt-2 px-4 py-2 rounded-lg flex-1 flex-row items-center"
            >
              <TextInput
                className="bg-gray-100 p-2 rounded-lg font-rregular flex-1 mr-2"
                placeholder="Type your reply..."
                value={replyText}
                onChangeText={setReplyText}
              />
              <Pressable
                className="bg-blue-500 p-2 rounded-lg items-center"
                onPress={handleReply}
              >
                <Feather name='send' size={24} color="white" />
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
    <PopupComponent
      isVisible={isPopupVisible}
      onClose={handleClosePopup}
      setMessage={handleSetMessage}
      username={message?.sender?.name}
    />
    </>
  );
};

export default React.memo(MessageItem);