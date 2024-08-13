import { FlatList, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Themed';
import UserCard from '@/components/UserCard';
import { useGetConversations } from '@/lib';
import Loader from '../Loader';
import { useMessaging } from '@/lib/contexts/messaging';

const Chat = () => {
  const { conversations, } = useMessaging();

  const navigate = (userId: string) => {
    router.navigate(`/conversation/${userId}`);
  };
  
  const navigateToUsers = () => {
    router.navigate('/users');
  };

  // if (loading) return <Loader loadingText='Loading your conversations' />;

  // if (error) {
  //   return (
  //     <View className="flex-1 justify-center items-center p-5">
  //       <Text className="text-lg font-semibold text-red-500 mb-2 font-rregular">Oops! Something went wrong</Text>
  //       <Text className="text-sm text-gray-600 text-center">We couldn't load your conversations. Please try again later.</Text>
  //     </View>
  //   );
  // }

  if (!conversations?.length) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Ionicons name="chatbubbles-outline" size={64} color="#4B5563" />
        <Text className="text-xl font-semibold text-gray-600 mt-4 mb-2 font-rregular">No conversations yet</Text>
        <Text className="text-sm text-gray-400 text-center mb-6 font-rregular">
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
    <View className="flex-1">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <UserCard 
            conversation={item}
            onSelectUser={navigate}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-600" />}
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