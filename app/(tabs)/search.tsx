import React, { useState } from 'react';
import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { SearchResults, Suggestions, SearchTabBar as TabBar, Text, View } from '@/components';
import { useCombinedSearch } from '@/lib/actions/hooks/search';
import { Post, Server, User } from '@/types';

type TabBarOptions = 'recents' | 'people' | 'media-links' | 'files';
type SearchType = 'all' | 'posts' | 'users' | 'servers';

interface SearchBarProps {
  setSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearch }) => (
  <TextInput
    placeholder="Search"
    onChangeText={setSearch}
    className="p-2 bg-gray-100 rounded-lg"
  />
);

const ExploreComponent: React.FC = () => {
  const [selectedTabBar, setSelectedTabBar] = useState<TabBarOptions>('recents');
  const { 
    query, 
    setQuery, 
    searchType, 
    setSearchType, 
    results, 
    isLoading,
    topCreators,
    topServers,
    loadingCreators,
    loadingServers
  } = useCombinedSearch();

  const handleSetSearch = (term: string) => {
    setQuery(term);
    setSearchType(mapTabBarToSearchType(selectedTabBar));
  };

  return (
    <View className="flex-1 bg-white">
      <SearchBar setSearch={handleSetSearch} />
      <TabBar
        selected={selectedTabBar}
        onTabPress={setSelectedTabBar}
      />
      {renderContent(selectedTabBar, results, isLoading, topCreators, topServers)}
    </View>
  );
};

const mapTabBarToSearchType = (tabBar: TabBarOptions): SearchType => {
  switch (tabBar) {
    case 'people': return 'users';
    case 'media-links': return 'posts';
    case 'files': return 'servers';
    default: return 'all';
  }
};

const renderContent = (
  selectedTabBar: TabBarOptions,
  results: { posts: Post[]; users: User[]; servers: Server[] },
  isLoading: boolean,
  topCreators?: User[],
  topServers?: Server[]
) => {
  if (isLoading) {
    return <Text className="p-4 text-center">Loading...</Text>;
  }

  switch (selectedTabBar) {
    case 'recents':
      const allResults: (Post | User | Server)[] = [
        ...(results?.posts || []),
        ...(results?.users || []),
        ...(results?.servers || [])
      ];
      return allResults.length > 0 ? (
        <SearchResults result={allResults} resultType="all" />
      ) : (
        <Suggestions
          onClearSearchHistory={() => {}}
          searchHistory={[]}
          addSearch={() => {}}
          onClearAllSearches={() => {}}
          suggestedServers={topServers || []}
          suggestedUsers={topCreators || []}
        />
      );
    case 'people':
      return (
        <FlatList
          data={results?.users}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push(`/user/${item.id}`)}
              className="p-4 border-b border-gray-200"
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item?.id.toString()}
        />
      );
    case 'media-links':
      return <SearchResults result={results?.posts} resultType="posts" />;
    case 'files':
      return <SearchResults result={results?.servers} resultType="servers" />;
    default:
      return null;
  }
};

export default ExploreComponent;