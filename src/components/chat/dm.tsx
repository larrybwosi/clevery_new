import { useCallback } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

import { Text } from '@/components/themed';
import { useMessaging } from '@/lib/contexts/messaging';
import UserCard from './user-card';
import Loader from '../states/loading';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Chat = () => {
  const { conversations, isLoading } = useMessaging();

  const navigate = (userId: string) => {
    router.navigate(`/channel?id=${userId}`);
  };

  const navigateToUsers = () => {
    router.navigate('/users');
  };

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const onPressIn = useCallback(() => {
    buttonScale.value = withSpring(0.95);
  }, []);

  const onPressOut = useCallback(() => {
    buttonScale.value = withSpring(1);
  }, []);

  if (!conversations?.length) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Ionicons name="chatbubbles-outline" size={64} color="#4B5563" />
        </Animated.View>
        <Animated.Text 
          className="text-xl font-semibold text-gray-600 mt-4 mb-2 font-rregular"
          entering={FadeInDown.delay(400).duration(500)}
        >
          No conversations yet
        </Animated.Text>
        <Animated.Text 
          className="text-sm text-gray-400 text-center mb-6 font-rregular"
          entering={FadeInDown.delay(500).duration(500)}
        >
          Start by adding friends and begin chatting!
        </Animated.Text>
        <AnimatedPressable
          onPress={navigateToUsers}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          className="bg-blue-500 py-3 px-6 rounded-full shadow-md"
          style={buttonAnimatedStyle}
          entering={FadeInDown.delay(600).duration(500)}
        >
          <Text className="text-white font-semibold">Find Friends</Text>
        </AnimatedPressable>
      </View>
    );
  }

  const renderItem = useCallback(({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <UserCard
        conversation={item}
        onSelectUser={navigate}
      />
    </Animated.View>
  ), [navigate]);

  if(isLoading) return <Loader loadingText='Loading your Dm'/>
  return (
    <View className="flex-1">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-400 mx-1" />}
        ListEmptyComponent={() => (
          <Animated.View 
            className="flex-1 justify-center items-center p-5"
            entering={FadeInDown.duration(500)}
          >
            <Text className="text-lg text-gray-600 text-center">
              No conversations to display
            </Text>
          </Animated.View>
        )}
      />
    </View>
  );
};

export default Chat;