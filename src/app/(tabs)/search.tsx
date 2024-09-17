import { useState, useCallback, useMemo } from 'react';
import { TextInput, Pressable, Dimensions, NativeSyntheticEvent } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { HStack, Loader, SearchResults, Suggestions, Text, View } from '@/components';
import { useCombinedSearch } from '@/lib/actions/hooks/search';
import { Feather } from '@expo/vector-icons';
import { NativeScrollEvent } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = [
  { icon: 'clock', text: 'Recents', key: 'recents' },
  { icon: 'users', text: 'People', key: 'people' },
  { icon: 'link', text: 'Media Links', key: 'media-links' },
  { icon: 'file', text: 'Files', key: 'files' },
] as const;

interface FileItemProps {
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'xls';
}
type TabKey = typeof TABS[number]['key'];


// Subcomponents
const SearchBar = ({ setSearch }: { setSearch: (term: string) => void }) => (
  <View className="px-4 py-2 my-4 bg-gray-800 rounded-full shadow-md">
    <TextInput
      placeholder="Search"
      placeholderTextColor="#9CA3AF"
      onChangeText={setSearch}
      className="text-base"
    />
  </View>
);

const SearchTabBar = ({ activeTab, onTabPress }: { activeTab: TabKey; onTabPress: (tab: TabKey) => void }) => (
  <View className="py-2 px-4 bg-gray-800 rounded-t-2xl shadow-lg">
    <HStack className="justify-between">
      {TABS.map(({ icon, text, key }) => (
        <Pressable
          key={key}
          onPress={() => onTabPress(key)}
          className={`items-center p-2 ${activeTab === key ? 'bg-blue-500 rounded-lg' : ''}`}
        >
          <Feather
            name={icon}
            size={24}
            color={activeTab === key ? '#FFFFFF' : '#9CA3AF'}
          />
          <Text className={`text-xs mt-1 ${activeTab === key ? 'text-white' : 'text-gray-400'} font-rregular`}>{text}</Text>
        </Pressable>
      ))}
    </HStack>
  </View>
);

const UserItem = ({ item }: { item: any }) => (
  <Pressable className='flex-row items-center p-4 rounded-lg mb-2' onPress={() => router.push(item.id)}>
    <Image
      source={item.image || ''}
      style={{ height: 50, width: 50, borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: 'gray' }}
    />
    <View>
      <Text className='text-base font-rmedium '>{item.name}</Text>
      <Text className='text-sm text-gray-400 font-rthin'>{item.username}</Text>
    </View>
  </Pressable>
);
// Main component
const ExploreComponent = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('recents');
  const { setQuery, results, isLoading, topCreators, topServers } = useCombinedSearch();
  const translateX = useSharedValue(0);
  const scrollX = useSharedValue(0);

  const { width } = Dimensions.get('window');
  const handleSetSearch = useCallback((term: string) => {
    setQuery(term);
  }, [setQuery]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;
    const index = Math.round(contentOffsetX / width);
    setActiveTab(TABS[index].key);
  }, []);

  const handleTabPress = useCallback((tab: TabKey) => {
    const index = TABS.findIndex(t => t.key === tab);
    translateX.value = withTiming(index * SCREEN_WIDTH);
    setActiveTab(tab);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value * -1 }],
    };
  });


  const renderContent = useMemo(() => {
    if (isLoading) return <Loader loadingText="Searching for results..." />;

    const allResults = [...(results?.posts || []), ...(results?.users || []), ...(results?.servers || [])];
    
    return [
      allResults.length > 0 ? (
        <SearchResults key="all" result={allResults} resultType="all" />
      ) : (
        <Suggestions
          key="suggestions"
          suggestedServers={topServers || []}
          suggestedUsers={topCreators || []}
          addSearch={(item) => handleSetSearch(item.name)}
          onClearSearchHistory={() => handleSetSearch('')}
        />
      ),
      <FlashList
        key="users"
        data={results?.users?.length > 0 ? results.users : topCreators}
        renderItem={({ item }) => <UserItem item={item} />}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
      />,
      <SearchResults key="posts" result={results?.posts} resultType="posts" />,
      <SearchResults key="servers" result={results?.servers} resultType="servers" />,
      <SearchResults key="files" result={results?.servers} resultType="servers" />,
    ];
  }, [isLoading, results, topCreators, topServers, handleSetSearch]);

  return (
    <View className="flex-1 bg-gray-900 pt-7">
      <SearchBar setSearch={handleSetSearch} />
      <SearchTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={animatedStyle}
      >
        {TABS.map((_, index) => (
          <View key={index} style={{ width: SCREEN_WIDTH }}>
            {renderContent[index]}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default ExploreComponent;