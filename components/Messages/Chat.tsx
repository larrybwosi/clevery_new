import { FlatList, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Themed';
import UserCard from '@/components/UserCard';
import { useGetConversations } from '@/lib';
import Loader from '../Loader';
import { useOnlineFriends } from '@/lib/contexts/online_friends';

const Chat = () => {
  const {
    data: conversations,
    isLoading: loading,
    error
  } = useGetConversations();

  const {onlineFriends} = useOnlineFriends();
  console.log(onlineFriends)

  const navigate = (userId: string) => {
    router.navigate(`/conversation/${userId}`);
  };

  const navigateToUsers = () => {
    router.navigate('/users');
  };

  if (loading) return <Loader loadingText='Loading your conversations' />;

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg font-semibold text-red-500 mb-2 font-rregular">Oops! Something went wrong</Text>
        <Text className="text-sm text-gray-600 text-center">We couldn't load your conversations. Please try again later.</Text>
      </View>
    );
  }

  if (!conversations?.length) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-gray-50">
        <Ionicons name="chatbubbles-outline" size={64} color="#4B5563" />
        <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2 font-rregular">No conversations yet</Text>
        <Text className="text-sm text-gray-600 text-center mb-6 font-rregular">
          Start by adding friends and begin chatting!
        </Text>
        <TouchableOpacity 
          onPress={navigateToUsers}
          className="bg-blue-500 py-3 px-6 rounded-full shadow-md"
        >
          <Text className="text-white font-semibold">Find Friends</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <UserCard 
            conversation={item}
            onSelectUser={navigate}
          />
        )}
        ListHeaderComponent={() => (
          <View className="p-4 bg-white border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">Your Conversations</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center p-5">
            <Text className="text-lg text-gray-600 text-center">No conversations to display</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Chat;