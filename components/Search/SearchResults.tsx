import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { Post as PostType, Server, User} from '@/types';
import Post from '../Home/Post';
import { Ionicons } from '@expo/vector-icons';

interface Link {
  id: number;
  title: string;
  url: string;
}
interface SearchResultsProps {
  result: PostType[] | Server[] | User[] | Link[];
  resultType: 'all' | 'media-links' | 'posts' | 'users' | 'servers';
}

const UserItem: React.FC<User> = ({ id, username, image }) => (
  <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-lg mb-2 shadow-sm">
    <Image source={{ uri: image }} className="w-12 h-12 rounded-full" />
    <Text className="ml-4 text-lg font-semibold">{username}</Text>
  </TouchableOpacity>
);

const ServerItem: React.FC<Server> = ({ id, name, image }) => (
  <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-lg mb-2 shadow-sm">
    <Image source={{ uri: image! }} className="w-12 h-12 rounded-lg" />
    <Text className="ml-4 text-lg font-semibold">{name}</Text>
  </TouchableOpacity>
);

const LinkItem: React.FC<Link> = ({ id, title, url }) => (
  <TouchableOpacity className="p-4 bg-white rounded-lg mb-2 shadow-sm">
    <Text className="text-lg font-semibold mb-2">{title}</Text>
    <Text className="text-blue-500">{url}</Text>
  </TouchableOpacity>
);

const SearchResults: React.FC<SearchResultsProps> = ({ result, resultType }) => {
  const renderItem = ({ item }: { item: PostType | Server | User | Link }) => {
    switch (resultType) {
      case 'posts':
        return <Post {...(item as PostType)} />;
      case 'users':
        return <UserItem {...(item as User)} />;
      case 'servers':
        return <ServerItem {...(item as Server)} />;
      case 'media-links':
        return <LinkItem {...(item as Link)} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {result.length > 0 ? (
        <FlatList
          data={result}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="search-outline" size={64} color="#9CA3AF" />
          <Text className="mt-4 text-lg font-semibold text-gray-600">No results found</Text>
          <Text className="mt-2 text-gray-500 text-center px-4">
            Try adjusting your search or filter to find what you're looking for
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchResults;