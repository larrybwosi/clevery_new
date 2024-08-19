import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Post as PostType, Server, User } from '@/types';
import { Text, View } from '../Themed';
import { HStack } from 'native-base';
import Image from '../image';

interface Link {
  id: number;
  title: string;
  url: string;
}

interface SearchResultsProps {
  result: (PostType | Server | User | Link)[];
  resultType: 'all' | 'media-links' | 'posts' | 'users' | 'servers';
}

const UserItem: React.FC<User> = ({ id, username, image, name }) => (
  <TouchableOpacity className="flex-row items-center p-4 rounded-lg mb-2 shadow-sm">
    <Image
      source={image! }
      height={80}  
      width={80}
      style='h-[50px] w-[50px] rounded-[25px] border '
    />
    <Text className="ml-4 text-sm font-rregular">{username || name}</Text>
  </TouchableOpacity>
);

const ServerItem: React.FC<Server> = ({ id, name, image }) => (
  <TouchableOpacity className="flex-row items-center p-4 rounded-lg mb-2 shadow-sm">

    <Image
      source={image|| ''}
      height={80}  
      width={80}
      style='h-[50px] w-[50px] rounded-[25px] border '
    />    <Text className="ml-4 text-sm font-rregular">{name}</Text>
  </TouchableOpacity>
);

const LinkItem: React.FC<Link> = ({ id, title, url }) => (
  <TouchableOpacity className="p-4 rounded-lg mb-2 shadow-sm">
    <Text className="text-sm font-rregular mb-2">{title}</Text>
    <Text className="text-blue-500">{url}</Text>
  </TouchableOpacity>
);

const Post: React.FC<PostType> = ({ id, content, createdAt, author }) => (
  <View className="p-4 rounded-lg mb-2 shadow-sm">
    <HStack style={{ gap:80 }} alignItems={'center'}>
      <View>
        <View className="flex-row items-center mb-2">
        <Image
          source={author.image! }
          height={80}  
          width={80}
          style='h-[50px] w-[50px] rounded-[25px] border'
        />          
        <Text className="ml-2 font-rbold">{author.name}</Text>
        </View>
        <Text className="font-rregular mb-2">{content}</Text>
      </View>
      <Text className="text-gray-500 text-xs">{new Date(createdAt).toLocaleString()}</Text>
    </HStack>
  </View>
);

const SearchResults: React.FC<SearchResultsProps> = ({ result, resultType }) => {
  const renderItem = ({ item }: { item: PostType | Server | User | Link }) => {
    if (resultType === 'all') {
      if ('content' in item) return <Post {...(item as PostType)} />;
      if ('username' in item) return <UserItem {...(item as User)} />;
      if ('name' in item && !('username' in item)) return <ServerItem {...(item as Server)} />;
      if ('url' in item) return <LinkItem {...(item as Link)} />;
    }

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
    <View className="flex-1">
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