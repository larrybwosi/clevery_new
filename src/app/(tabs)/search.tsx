import React, { useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { router } from 'expo-router';

import { Loader, SearchResults, Suggestions, SearchTabBar as TabBar, Text, View } from '@/components';
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
    className="p-2 my-4 bg-transparent border border-gray-500 text-white rounded-lg"
  />
);

const ExploreComponent: React.FC = () => {
  const [selectedTabBar, setSelectedTabBar] = useState<TabBarOptions>('recents');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const {
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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (gestureState.dx < -50) {
        setSwipeDirection('left');
      } else if (gestureState.dx > 50) {
        setSwipeDirection('right');
      } else {
        setSwipeDirection(null);
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (swipeDirection === 'left') {
        const nextTab = getNextTab('left');
        setSelectedTabBar(nextTab);
      } else if (swipeDirection === 'right') {
        const previousTab = getNextTab('right');
        setSelectedTabBar(previousTab);
      }
      setSwipeDirection(null);
    },
  });

  const getNextTab = (direction: 'left' | 'right'): TabBarOptions => {
    const tabs: TabBarOptions[] = ['recents', 'people', 'media-links', 'files'];
    const currentIndex = tabs.indexOf(selectedTabBar);
    const nextIndex = direction === 'left' ? (currentIndex + 1) % tabs.length : (currentIndex - 1 + tabs.length) % tabs.length;
    return tabs[nextIndex];
  };

  return (
    <View className="flex-1 mt-7" {...panResponder.panHandlers}>
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
    return <Loader loadingText="Wer'e searching for the result"/>;
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