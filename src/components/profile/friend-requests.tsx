import { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Text, View } from '@/components/themed';
import { Image } from 'expo-image';

// Mock data for friend requests
const mockFriendRequests = [
  {
    id: '1',
    name: 'Emma Thompson',
    username: '@emmathompson',
    mutualFriends: 5,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'Michael Chen',
    username: '@mikechen',
    mutualFriends: 3,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '3',
    name: 'Sophia Rodriguez',
    username: '@sophiarodriguez',
    mutualFriends: 8,
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: '4',
    name: 'Alexander Kim',
    username: '@alexkim',
    mutualFriends: 2,
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
];

const FriendRequestCard = ({ request, onAccept, onDecline }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View 
      entering={SlideInRight} 
      exiting={SlideOutLeft}
      style={animatedStyle}
      className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
    >
      <View className="flex-row items-center p-4">
        <Image
          source={{ uri: request.avatar }} 
          className="w-16 h-16 rounded-full mr-4" 
        />
        <View className="flex-1">
          <Text className="text-lg font-rmedium text-gray-800">{request.name}</Text>
          <Text className="text-sm font-rregular text-gray-600">{request.username}</Text>
          <Text className="text-sm font-rregular text-gray-500 mt-1">
            {request.mutualFriends} mutual friends
          </Text>
        </View>
      </View>
      <View className="flex-row justify-end p-2 bg-gray-100">
        <TouchableOpacity
          onPress={() => onDecline(request.id)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="bg-gray-200 rounded-full py-2 px-4 mr-2"
        >
          <Text className="text-sm font-rmedium text-gray-700">Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onAccept(request.id)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="bg-blue-500 rounded-full py-2 px-4"
        >
          <Text className="text-sm font-rmedium">Accept</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const EmptyState = () => (
  <Animated.View 
    entering={FadeIn.delay(300)} 
    className="bg-blue-50 rounded-lg p-6 items-center"
  >
    <Feather name="users" size={48} color="#4A90E2" />
    <Text className="text-xl font-rmedium text-gray-800 mt-4 mb-2 text-center">
      No Friend Requests... Yet!
    </Text>
    <Text className="text-base font-rregular text-gray-600 text-center mb-4">
      Boost your Clevery experience by connecting with more people!
    </Text>
    <TouchableOpacity className="bg-blue-500 rounded-full py-3 px-6">
      <Text className="text-base font-rmedium text-white">Find Friends</Text>
    </TouchableOpacity>
  </Animated.View>
);

const FriendRequestsPage = () => {
  const theme = useTheme();
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);

  const handleAccept = (id) => {
    setFriendRequests(friendRequests.filter(request => request.id !== id));
    // Implement logic to add friend
  };

  const handleDecline = (id) => {
    setFriendRequests(friendRequests.filter(request => request.id !== id));
    // Implement logic to decline request
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Animated.View entering={FadeIn.delay(300)} className="mb-6">
        <Text className="text-3xl font-rbold text-gray-800 mb-2">Friend Requests</Text>
        <Text className="text-base font-rregular text-gray-600">
          Expand your network and discover new connections!
        </Text>
      </Animated.View>

      {friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <FriendRequestCard
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))
      ) : (
        <EmptyState />
      )}

      {friendRequests.length > 0 && (
        <Animated.View entering={FadeIn.delay(600)} className="mt-6 bg-green-100 rounded-lg p-4">
          <Text className="text-lg font-rmedium mb-2 text-green-800">Pro Tip!</Text>
          <Text className="text-base font-rregular text-green-700">
            Accepting friend requests can lead to exciting new connections and experiences on Clevery. Don't forget to review each request carefully!
          </Text>
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default FriendRequestsPage;