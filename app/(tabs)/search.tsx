import { useState } from 'react';
import { FlatList, TextInput,TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { SearchResults, Suggestions, SearchTabBar as TabBar, Text, View} from '@/components';
import ImageSkeletons from '@/components/skeletons/images';
import LoadingUsers from '@/components/skeletons/loading-users';

type TabBarOptions= 'recents'|'people'|'media-links'|'files'

const SearchBar = ({ setSearch }: { setSearch: (text: string) => void }) => (
  <View className="flex-row items-center bg-gray-600 border border-gray-900 rounded-xl px-3 py-2 mx-2 mr-2 my-1 shadow-md">
    <Feather name="search" size={24} color="#666" className="mr-3" />
    <TextInput
      className="flex-1 text-base text-gray-200"
      placeholder="Search for ..."
      placeholderTextColor="#999"
      onChangeText={(query) => setSearch(query)}
    />
    <MaterialCommunityIcons name="tune" size={26} color="#666" className="absolute right-[-50px]" />
  </View>
);

const ExploreComponent = () => {
  const [selectedTabBar, setSelectedTabBar] = useState<TabBarOptions>('recents');
  const { searchResult, people, topServers } = useSearchState(selectedTabBar);

  const handleSetSearch = (term: string) => {
    
  };

  return (
    <View className="flex-1 mt-7.5">
      <SearchBar setSearch={handleSetSearch} />
      <TabBar onTabPress={setSelectedTabBar} selected={selectedTabBar} />
      {renderContent(selectedTabBar, searchResult, people, topServers)}
    </View>
  );
};

const renderContent = (
  selectedTabBar: TabBarOptions,
  searchResult: any[],
  people: any[],
  topServers: any[]
) => {

  const persistSearches=()=>{

  }

  if (selectedTabBar === 'recents' && searchResult.length < 1) {
    return (
      <Suggestions
        suggestedUsers={people}
        suggestedServers={topServers}
        onClearAllSearches={() => {}}
        onClearSearchHistory={(index) => {}}
        searchHistory={[]}
        addSearch={persistSearches}
      />
    );
  } else if (selectedTabBar === 'recents') {
    return <SearchResults result={searchResult} resultType={selectedTabBar} />;
  } else if (selectedTabBar === 'people') {
    return (
      <FlatList
        data={people}
        ListEmptyComponent={<LoadingUsers />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center p-1.5"
            key={item?._id}
            onPress={() => router.push(`/user/${item?._id}`)}
          >
            <Image
              source={{ uri: urlForImage(item.image).width(100).url() }}
              className="w-12.5 h-12.5 rounded-[25px] mr-4"
            />
            <Text className="font-rregular text-base">{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
    );
  } else if (selectedTabBar === 'files') {
    return <ImageSkeletons />;
  }
};

const useSearchState = (selectedTabBar: TabBarOptions) => {
  const [peopleTerm, setPeopleTerm] = useState('');
  const [postsTerm, setPostsTerm] = useState('');
  const [allTerm, setAllTerm] = useState('');

  const { searchResult, topServers, people } = useCombinedSearchResults(
    peopleTerm,
    allTerm,
    postsTerm
  );

  const handleSetSearch = (term: string) => {
    if (selectedTabBar === 'recents') setAllTerm(term);
    if (selectedTabBar === 'people') setPeopleTerm(term);
    if (selectedTabBar === 'media-links') setPostsTerm(term);
  };

  return { searchResult, people, topServers, handleSetSearch };
};



export default ExploreComponent;