import { TouchableOpacity, FlatList, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import SearchSuggestions from '@/components/search/suggestions-skeleton';
import { Text, View } from '@/components/themed';
import { useSearchStore } from '@/lib';
import { Server, User } from '@/types';
import Image from '../image';
import { HStack } from '../ui/hstack';

type RecentItem = {
  id: string;
  name: string;
  image?: string;
};

type SuggestionsProps = {
  searchHistory: RecentItem[];
  onClearSearchHistory: (item: string) => void;
  onClearAllSearches: () => void;
  suggestedUsers: User[];
  suggestedServers: Server[]
  addSearch: (search: any) => any
};

interface Users {
  suggestedUsers: User[]
  addSearch: (search: any) => any
}


const TopUsers = ({ suggestedUsers, addSearch }: Users) => {
  const handleUserClick = (user: User) => {
    addSearch({
      id: user.id,
      name: user.name,
      date: Date.now().toString(),
      image: user.image
    })
    router.push(`/user/${user.id}`)
  }
  if (!suggestedUsers) return <SearchSuggestions/>
  return (
    <View>
      <Text className='text-sm pb-2 font-rbold' >Top Users</Text>
      {suggestedUsers?.slice(0, 3).map((item) => (
        <HStack className='space-x-2' key={item.id}>
          <Pressable className='flex-row items-center p-1.5' onPress={() => handleUserClick(item)}>
            <Image
              source={item.image!}
              height={80}
              width={80}
              style='h-[50px] w-[50px] rounded-[25px] border mr-4 '
            />
            <View>
              <Text className='text-sm font-rmedium'>{item.name}</Text>
              <Text className='text-[10px] font-rregular'>{item.username}</Text>
            </View>
          </Pressable>
        </HStack>
      ))}
    </View>
  )
}
const TopServers = ({ suggestedServers }: { suggestedServers: Server[] }) => {
  if (!suggestedServers) return <SearchSuggestions/>
  return (
    <>
      <Text className='text-sm pb-2 font-rbold m-3' >Top Servers</Text>
      {suggestedServers?.map((item) => (
        <View className='flex-row items-center p-1.5' key={item.id}>
          <Image
            source={item.image!}
            height={80}
            width={80}
            style='h-[50px] w-[50px] rounded-full border mr-4'
          />
          <View>
            <Text className='text-sm font-rmedium'>
              {item.name}
            </Text>
            
            <Text className='text-[10px] font-rregular' >
              {item.description}
            </Text>
          </View>
        </View>
      ))}
    </>
  )
}

const Suggestions: React.FC<SuggestionsProps> = ({
  suggestedUsers,
  onClearSearchHistory,
  onClearAllSearches,
  suggestedServers,
  addSearch
}) => {

  const handleClearPress = (item: string) => {
    onClearSearchHistory(item);
  };

  const { searches } = useSearchStore();

  const renderRecentItem = ({ item }: { item: RecentItem }) => (
    <View className='flex-row  justify-between items-center '>
      <TouchableOpacity className='flex-row items-center p-1.5' >
        <Image
          source={item.image!}
          height={80}
          width={80}
          style='h-[50px] w-[50px] rounded-[25px] border mr-4 '
        />

        <View>
          <Text className='font-rmedium text-sm'>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleClearPress(item?.id)}>
        <Ionicons name="close-circle-outline" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderClearAllButton = () => (
    <TouchableOpacity onPress={onClearAllSearches} className='p-4 items-center'>
      <Text className='text-base'>Clear All</Text>
    </TouchableOpacity>
  );

  const renderRecentSearches = () => {
    if (!searches?.length) {
      return null;
    }

    return (
      <>
        <FlatList
          data={searches}
          renderItem={renderRecentItem}
          keyExtractor={(item) => item?.id?.toString()}
          ListHeaderComponent={
            <Text className='font-rbold pb-2 text-base'>
              Recent Searches
            </Text>}
        />
        {renderClearAllButton()}
      </>
    );
  };

  return (
    <ScrollView className='px-1 py-2'>
      {renderRecentSearches()}
      <Text className='text-lg pb-2 font-rbold'>
        Suggestions
      </Text>
      <TopUsers suggestedUsers={suggestedUsers} addSearch={addSearch} />
      <TopServers suggestedServers={suggestedServers} />
    </ScrollView>
  );
};

export default Suggestions;