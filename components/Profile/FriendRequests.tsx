import { memo, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, Animated } from 'react-native';
import { Box, Text, VStack, HStack, Heading, Icon, Spinner } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

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
      <Box bg="$white" rounded="$xl" p={4} mb={'$3'}>
        <HStack space={'md'} alignItems="center">
          <Image 
            source={{ uri: item.avatar }} 
            style={{ width: 60, height: 60, borderRadius: 30 }}
            transition={1000}
          />
          <VStack flex={1}>
            <Text fontSize="$lg" fontWeight="bold" mb={1}>{item.username}</Text>
            <Text fontSize="$sm" color="gray.600">Wants to be your friend</Text>
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
      <Box flex={1} justifyContent="center" alignItems="center" bg="gray.100">
        <Spinner size="large" color="$blue.500" />
        <Text mt={4} fontSize="$md" color="gray.600">Loading friend requests...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1}p={4}>
      
      {friendRequests.length === 0 ? (
        <VStack flex={1} justifyContent="center" alignItems="center" space={'md'}>
          <LottieView
            source={require('@/assets/animations/empty.json')}
            ref={animation}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text fontSize="$lg" color="gray.600" textAlign="center">
            No friend requests at the moment.
          </Text>
          <Text fontSize="$md" color="gray.500" textAlign="center">
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