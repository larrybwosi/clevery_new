import { FlatList, TextInput,TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ErrorMessage, Loader, SearchResults, Suggestions, SearchTabBar as TabBar, Text, View} from '@/components';
import { selector, urlForImage,useCombinedSearchResults} from '@/lib';
import { Search } from '@/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';

type TabBarOptions= 'recents'|'people'|'media-links'|'files'

const SearchBar = ({setSearch}:{setSearch: (text: string) => void}) => (
  <View className='flex-row items-center py-[5px] px-[6px] border-gray mx-[5px] mr-12.5 '>
    <Ionicons name="search-outline" size={24} color="gray" className='mr-2'/>
    <TextInput
      className='flex-1 text-xs'
      placeholder="Search for creators, groups, or your files"
      onChangeText={(query)=>setSearch(query)}
    />
    <MaterialCommunityIcons name="tune" size={26} style={{position:'absolute',right:-30}} />
  </View>
);

const ExploreComponent = () => {
  const [peopleTerm,setPeopleTerm]=useState('')
  const [postsTerm,setPostsTerm] = useState('')
  const [allTerm,setAllTerm] = useState('')

  const { 
    searchResult, resultName, loadingCreators, loadingServer,
    topCreators,topServers ,people
  }= useCombinedSearchResults(peopleTerm,allTerm,postsTerm)
  const [selectedTabBar, setSelectedTabBar] = useState<TabBarOptions>("recents")
  const profile = selector((state) => state.profile.profile);

  const persistSearches=(search:Search)=>{
    
  }

  const handleSetSearch =(term:string)=>{
    if(selectedTabBar === 'recents') setAllTerm(term)
    if (selectedTabBar === 'people') setPeopleTerm(term)
    if (selectedTabBar === 'media-links') setPostsTerm(term)
  }

  if(loadingCreators||loadingServer) return <Loader loadingText='loading recent items'/>
  // if(creatorsError||serversError) return <ErrorMessage message='Connection Error'/>
  return (
    <View className='flex-1 mt-7.5'>
      <SearchBar
        setSearch={handleSetSearch}
      />
      <TabBar
        onTabPress={(selected)=>setSelectedTabBar(selected)}
        selected={selectedTabBar}
      />
      {selectedTabBar === 'recents' &&
      searchResult.length<1?
        <Suggestions
        suggestedUsers={people!} 
        suggestedServers={topServers!}
        onClearAllSearches={()=>{}}
        onClearSearchHistory={(index)=>{}}
        searchHistory={[]}
        addSearch={persistSearches}
        />:
        <SearchResults
          result={searchResult}
          resultType={selectedTabBar}
        />
      }
      {selectedTabBar === 'people' &&
        <FlatList
        data={people}
        renderItem={({item})=>(
          <TouchableOpacity 
            className='flex-row items-center p-1.5' key={item?._id} 
            onPress={()=>router.push(`/user/${item?._id}`)}
          >
            <Image
            source={{ uri: urlForImage(item.image).width(100).url() }}
            className='w-12.5 h-12.5 rounded-[25px] mr-4'
            />
              <Text className='font-rmedium text-lg' >
                {item.name}
              </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item)=>item._id}
        />
      }
    </View>
  );
};

export default ExploreComponent;