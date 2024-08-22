import { memo, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Box, HStack, VStack, Text, Spinner } from '@/components';
interface FriendRequest {
  id: string;
  username: string;
  avatar: string;
}

interface FriendRequestsProps {
  friendRequests: FriendRequest[];
  isLoading: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const FriendRequestItem: React.FC<{ item: FriendRequest; onAccept: () => void; onReject: () => void }> = ({ item, onAccept, onReject }) => {
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(animationValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: animationValue,
  };

  return (
    <AnimatedTouchableOpacity style={animatedStyle}>
      <Box className='bg-white rounded-xl'>
        <HStack className='items-center' >
          <Image 
            source={{ uri: item.avatar }} 
            style={{ width: 60, height: 60, borderRadius: 30 }}
            transition={1000}
          />
          <VStack className='flex-1'>
            <Text className='font-rmedium text-lg' >{item.username}</Text>
            <Text className='font-rregular text-sm text-gray-600'>Wants to be your friend</Text>
          </VStack>
          <HStack space={'sm'}>
            <TouchableOpacity onPress={onAccept}>
              <LinearGradient
                colors={['#4CAF50', '#45B649']}
                style={{ width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="checkmark-outline" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReject}>
              <LinearGradient
                colors={['#FF5252', '#FF1744']}
                style={{ width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="close-outline" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </HStack>
        </HStack>
      </Box>
    </AnimatedTouchableOpacity>
  );
};

const FriendRequests: React.FC<FriendRequestsProps> = ({ friendRequests, isLoading }) => {
  const animation = useRef<LottieView>(null);
  const onAcceptPress = (id: string) => {
    // Implement accept logic
  };

  const onRejectPress = (id: string) => {
    // Implement reject logic
  };

  const renderItem = ({ item }: { item: FriendRequest }) => (
    <FriendRequestItem
      item={item}
      onAccept={() => onAcceptPress(item.id)}
      onReject={() => onRejectPress(item.id)}
    />
  );

  if (isLoading) {
    return (
      <Box className='flex-1 justify-center items-center bg-gray-100' >
        <Spinner size="large" color="$blue.500" />
        <Text className='font-rmedium mt-1 text-gray-600'>Loading friend requests...</Text>
      </Box>
    );
  }

  return (
    <Box className='flex-1'>
      
      {friendRequests.length === 0 ? (
        <VStack className='flex-1 justify-center items-center bg-gray-100' >
          <LottieView
            source={require('@/assets/animations/empty.json')}
            ref={animation}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text className='text-lg text-gray-600 items-center'>
            No friend requests at the moment.
          </Text>
          <Text className='font-rmedium text-gray-500 items-center' >
            When someone sends you a friend request, it will appear here.
          </Text>
        </VStack>
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Box>
  );
};

export default memo(FriendRequests);