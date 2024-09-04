import { memo, useCallback, useState, useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import { Dimensions, NativeSyntheticEvent, NativeScrollEvent, ScrollView, PanResponder, GestureResponderEvent, PanResponderGestureState, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { Chat, Groups, ServerList, Text, View } from '@/components';

interface FilterItem {
  name: string;
  icon: keyof typeof Feather.glyphMap;
}

const FILTER_ITEMS: FilterItem[] = [
  { name: "chats", icon: 'message-square' },
  { name: "status", icon: 'users' },
  { name: "servers", icon: 'server' },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / FILTER_ITEMS.length;

const Messages: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('chats');
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (gestureState.dx < -50) {
        const nextTab = getNextTab('left');
        setActiveFilter(nextTab);
        scrollViewRef.current?.scrollTo({ x: FILTER_ITEMS.findIndex(item => item.name === nextTab) * width, animated: true });
      } else if (gestureState.dx > 50) {
        const previousTab = getNextTab('right');
        setActiveFilter(previousTab);
        scrollViewRef.current?.scrollTo({ x: FILTER_ITEMS.findIndex(item => item.name === previousTab) * width, animated: true });
      }
    },
  });

  const getNextTab = (direction: 'left' | 'right'): string => {
    const currentIndex = FILTER_ITEMS.findIndex(item => item.name === activeFilter);
    const nextIndex = direction === 'left' ? (currentIndex + 1) % FILTER_ITEMS.length : (currentIndex - 1 + FILTER_ITEMS.length) % FILTER_ITEMS.length;
    return FILTER_ITEMS[nextIndex].name;
  };

  const getFilterName = useCallback((filter: string): string => {
    switch (filter) {
      case 'chats': return 'Threads';
      case 'status': return 'Servers';
      case 'servers': return 'Communities';
      default: return '';
    }
  }, []);

  const handlePress = useCallback((): void => {
    if (activeFilter === 'chats') router.push("/users");
    else if (activeFilter === 'status') {/* voiceCallHandler(); */ }
    else if (activeFilter === 'servers') router.push("/create-server");
  }, [activeFilter]);

  const AddButton: React.FC = memo(() => (
    <Pressable
      className='flex-row border border-gray-500 rounded-full p-2 ml-auto gap-1.5'
      onPress={handlePress}
    >
      <Feather name="plus" size={20} color='gray' />
      <Text className='text-right font-rmedium text-sm'>
        {activeFilter === 'chats' ? 'Add Friend' : activeFilter === 'servers' ? 'Create Server' : 'Create Group'}
      </Text>
    </Pressable>
  ));

  const FilterIcon: React.FC<{ item: FilterItem, index: number }> = memo(({ item, index }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [1, 1.2, 1],
      );
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.7, 1, 0.7],
      );
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    const handlePress = () => {
      setActiveFilter(item.name);
      scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    };

    return (
      <Pressable
        className='flex-1 items-center justify-center py-2'
        onPress={handlePress}
      >
        <Animated.View style={animatedStyle}>
          <Feather name={item.icon} size={24} color="#007aff" />
        </Animated.View>
      </Pressable>
    );
  });

  const Filter: React.FC = memo(() => {
    const indicatorStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
        scrollX.value,
        FILTER_ITEMS.map((_, i) => i * width),
        FILTER_ITEMS.map((_, i) => i * ITEM_WIDTH)
      );
      return {
        transform: [{ translateX }],
      };
    });

    return (
      <View className='px-4 pt-4 pb-2' {...panResponder.panHandlers}>
        <View className='flex-row justify-between mb-4 items-center'>
          <Text className='font-rmedium text-2xl text-light'>
            {getFilterName(activeFilter)}
          </Text>
          <AddButton />
        </View>

        <View className='flex-row justify-around items-center'>
          {FILTER_ITEMS.map((item, index) => (
            <FilterIcon key={item.name} item={item} index={index} />
          ))}
        </View>
        <Animated.View
          className='absolute bottom-0 left-0 h-0.75 bg-white'
          style={[
            {
              width: ITEM_WIDTH,
            },
            indicatorStyle
          ]}
        />
      </View>
    );
  });

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffsetX;
    const index = Math.round(contentOffsetX / width);
    setActiveFilter(FILTER_ITEMS[index].name);
  }, []);

  return (
    <View className='flex-1 mt-7.5'>
      <Filter />
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        {FILTER_ITEMS.map((item) => (
          <View key={item.name} style={{ width }}>
            {item.name === 'chats' && <Chat />}
            {/* {item.name === 'status' && <Groups />} */}
            {item.name === 'servers' && <ServerList />}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};
export default memo(Messages);