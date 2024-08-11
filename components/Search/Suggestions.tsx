import { TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Image } from 'expo-image';

import SearchSuggestions from '@/components/skeletons/search-suggestions';
import { useSearchStore } from '@/lib';
import { Text, View } from '@/components/Themed';
import { Badge } from '../badges/user'; 
import { Server, User } from '@/types';

type RecentItem = {
  id: string;
  name: string;
  image?:string;
};

type SuggestionsProps = {
  searchHistory: RecentItem[];
  onClearSearchHistory: (item: string) => void;
  onClearAllSearches: () => void;
  suggestedUsers:User[];
  suggestedServers:Server[]
  addSearch:(search:any)=>any
};

interface Users {
    suggestedUsers:User[]
    addSearch:(search:any)=>any
}


const TopUsers =({suggestedUsers,addSearch}:Users)=>{
  const handleUserClick=(user:User)=>{
    addSearch({
      id:user.id,
      name:user.name,
      date:Date.now().toString(),
      image:user.image
    })
    router.push(`/user/${user.id}`)
  }
    return(
    <View
    >
      <Text className='text-[10px] pb-2 font-rregular' >Top Users</Text>
      <FlatList
        data={suggestedUsers?.slice(0,3)}
        ListEmptyComponent={<SearchSuggestions/>}
        renderItem={({ item }) =>  (
          <TouchableOpacity className='flex-row items-center p-1.5' onPress={()=>handleUserClick(item)}>
          <Image
          source={{ uri: item.image }}
          className='h-[50px] w-[50px] rounded-[25px] border mr-4 '
          />
            <View>
              <Text className='text-sm font-rmedium'>{item.name} <Badge text='ace' colors={[]}/></Text>
              <Text className='text-[10px] font-rregular'>{item.username}</Text>
            </View>
            
          </TouchableOpacity>
          )
        }
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
    )
}
const TopServers =({suggestedServers}:{suggestedServers:Server[]})=>{
  return(
    <>
      <Text className='text-[10px] pb-2 font-rregular' >Top Servers</Text>
      <FlatList
      data={suggestedServers}
      ListEmptyComponent={<SearchSuggestions/>}
      renderItem={({ item }) =>  (
        <View className='flex-row items-center p-1.5'>
          <Image
          source={{ uri: item.image! }}
          className='h-[50px] w-[50px] rounded-[25px] border mr-4 '
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
        )
      }
      keyExtractor={(item) => item.id.toString()}
    />
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
          source={{ uri: item.image }}
          className='h-[10px] w-[10px] rounded-[25px] border mr-4 '
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
          keyExtractor={(item) => item.id.toString()}
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
    <View className='px-1 py-2'>
      {renderRecentSearches()}
      <Text className='text-[10px] pb-2 font-rregular'>
        Suggestions
      </Text>
      <TopUsers suggestedUsers={suggestedUsers} addSearch={addSearch}/>
      <TopServers suggestedServers={suggestedServers}/>
    </View>
  );
};

  export default Suggestions;