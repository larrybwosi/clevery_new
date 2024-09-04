import { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity, Linking, BackHandler, Pressable, Text, View as RNView, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { formatDateString, multiFormatDateString } from '@/lib/utils';
import { View } from '@/components/themed';
import * as WebBrowser from 'expo-web-browser';
import Image from '@/components/image';
import FullScreenImage from './full_image';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

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
  reactions?: string;
}

interface MessageProps {
  item: Message;
  onDelete: (id: string) => void;
  onReply: (id: string, text: string) => void;
  onLongPress: (id: string) => void;
}

const Message: React.FC<MessageProps> = ({ item, onDelete, onReply, onLongPress }) => {
  const { id, text, sender, createdAt, isSeparator, file, reactions } = item;
  const [isFullScreenImageOpen, setIsFullScreenImageOpen] = useState(false);
  const swipeProgress = useSharedValue(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullScreenImageOpen) {
        setIsFullScreenImageOpen(false);
        return true; // Prevent the default back button behavior
      }
      return false; // Allow the default back button behavior
    });

    return () => backHandler.remove();
  }, [isFullScreenImageOpen]);

  const panGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
    'worklet';
    swipeProgress.value = event.nativeEvent.translationX;
    if (event.nativeEvent.translationX < -50) {
      setSwipeDirection('left');
    } else if (event.nativeEvent.translationX > 50) {
      setSwipeDirection('right');
    } else {
      setSwipeDirection(null);
    }
  }, [swipeProgress]);

  const actionButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: swipeProgress.value }],
      opacity: swipeProgress.value.interpolate({
        inputRange: [-150, 0],
        outputRange: [1, 0],
      }),
    };
  }, [swipeProgress]);

  const handlePanRelease = useCallback(() => {
    'worklet';
    if (swipeDirection === 'left') {
      swipeProgress.value = withTiming(-150);
    } else if (swipeDirection === 'right') {
      swipeProgress.value = withTiming(0);
    } else {
      swipeProgress.value = withTiming(0);
    }
  }, [swipeProgress, swipeDirection]);

  const handleImagePress = () => {
    setIsFullScreenImageOpen(true);
  };

  const handleCloseFullScreenImage = () => {
    setIsFullScreenImageOpen(false);
  };

  const handleReply = () => {
    // Prompt the user to construct the reply message
    const replyText = prompt('Enter your reply:');
    if (replyText) {
      onReply(id, replyText);
    }
  };

  const handleDelete = () => {
    onDelete(id);
  };

  if (isSeparator) {
    return <MessageSeparator timestamp={item?.timestamp} />;
  }

  const formattedTimestamp = multiFormatDateString(createdAt);

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={panGestureEvent} onEnded={handlePanRelease}>
        <Pressable
          className="flex flex-row items-start mb-[15px] px-[5px]"
          onLongPress={() => onLongPress(id)}
        >
          <Pressable>
            <Image
              source={sender?.image}
              width={80}
              height={80}
              style="rounded-2xl border border-gray-300 h-10 w-10 mr-2.5"
            />
          </Pressable>
          <View className="flex-1">
            <View className="flex-row items-center mb-1.5">
              <Text className="font-rmedium mr-1.5 text-white">
                {sender.name}
                {sender.isAdmin && <Feather name="shield" color="red" size={12} className="ml-1" />}
              </Text>
              <Text className="font-rmedium text-xs text-[#666]">{formattedTimestamp}</Text>
            </View>
            <FileAttachment file={file} onImagePress={handleImagePress} />
            <MessageText text={text} />
            {reactions && (
              <View className="flex-row mt-1">
                {/* Implement reactions here */}
              </View>
            )}
          </View>
          <Animated.View
            style={[
              {
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: 150,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                backgroundColor: 'gray',
              },
              actionButtonStyle,
            ]}
          >
            <TouchableOpacity onPress={handleReply}>
              <Feather name="send" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Feather name="trash-2" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
          {file && isFullScreenImageOpen && (
            <FullScreenImage
              uri={file}
              isOpen={isFullScreenImageOpen}
              onClose={handleCloseFullScreenImage}
            />
          )}
        </Pressable>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const FileAttachment = ({ file, onImagePress }: { file: Message['file']; onImagePress: () => void }) => {
  if (!file) return null;

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file);
  const isPDF = !isImage;

  return (
    <>
      {isPDF ? (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(file)}
          className="mb-2"
          activeOpacity={1}
        >
          <View className="flex-row items-center bg-gray-100 p-2 rounded-lg">
            <FontAwesome5 name="file-pdf" size={50} color="red" />
            <Text className="ml-2 font-rmedium">View PDF</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onImagePress} className="mb-2" activeOpacity={1}>
          <Image source={file} width={270} height={288} style="w-full h-60 border border-gray-300 rounded-[10px] shadow-lg" />
        </TouchableOpacity>
      )}
    </>
  );
};

const MessageSeparator = ({ timestamp }: { timestamp: string }) => (
  <RNView className='flex-row items-center my-3'>
    <RNView className='flex-1 h-[0.35px] bg-gray-400' />
    <Text className="font-rregular mx-2 text-[8px]">
      {formatDateString(timestamp)}
    </Text>
    <RNView className='flex-1 h-[0.35px] bg-gray-400' />
  </RNView>
);

const MessageText = ({ text }: { text: string }) => {
  const parts = text.split(/(@\w+|\bhttps?:\/\/\S+\b)/gi);

  return (
    <Pressable className="text-sm mr-10 font-rregular mb-1.5">
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          return (
            <Pressable key={index} className="text-light underline" onPress={() => router.navigate(`/user/${part.slice(1)}`)}>
              <Text className="text-light underline">{part}</Text>
            </Pressable>
          );
        } else if (part.startsWith('http')) {
          return (
            <Pressable key={index} className="text-light underline" onPress={() => Linking.openURL(part)}>
              <Text className="text-light underline">{part}</Text>
            </Pressable>
          );
        }
        return <Text className="font-rregular text-white">{part}</Text>
      })}
    </Pressable>
  );
};

export default Message;