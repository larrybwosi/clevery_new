import { memo, useCallback, useState, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { router } from 'expo-router';

import { Chat, Groups, ServerList, Text, View } from '@/components';
import { voiceCallHandler } from '@/lib';
import { ScrollView } from 'native-base';

interface FilterItem {
  name: any;
  icon: any;
}

const FILTER_ITEMS: FilterItem[] = [
  { name: "chats", icon: 'message-square' },
  { name: "status", icon: 'users' },
  { name: "servers", icon: 'server' },
];

const { width } = Dimensions.get('window');

const Messages: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('chats');
  const scrollViewRef = useRef<typeof ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const linePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      const lineX = (value / width) * (width / FILTER_ITEMS.length);
      linePosition.setValue(lineX);
    });
    return () => scrollX.removeAllListeners();
  }, []);

  const getFilterName = (filter: string): string => {
    switch (filter) {
      case 'chats':
        return 'Threads';
      case 'status':
        return 'Servers';
      case 'servers':
        return 'Communities';
      default:
        return '';
    }
  };
  
  const handlePress = (): void => {
    if (activeFilter === 'chats') router.navigate("/users");
    else if (activeFilter === 'status') voiceCallHandler();
    else if (activeFilter === 'servers') router.navigate("/create-server");
  };

  const AddButton: React.FC = memo(() => {
    return (
      <TouchableOpacity 
        className='flex-row border border-gray-500 rounded-full p-2 ml-auto gap-1.5'
        onPress={handlePress}
      >
        <Feather name="plus" size={20} color={'#fff'}/>
        <Text className='text-right font-rmedium font-sm text-white'>
          {activeFilter === 'chats' ? 'Add Friend' : activeFilter === 'servers' ? 'Create Server' : 'Create Group'}
        </Text>
      </TouchableOpacity>
    );
  });

  const Filter: React.FC = memo(() => {
    const handleFilterChange = useCallback((filter: string, index: number): void => {
      setActiveFilter(filter);
      // scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    }, []);
  
    return (
      <View className=' px-4 pt-4 pb-2 rounded-b-3xl shadow-lg'>
        <View className='flex-row justify-between mb-4 items-center'>
          <Text className='font-rmedium text-2xl text-light'>
            {getFilterName(activeFilter)}
          </Text>
          <AddButton/>
        </View>

        <View className='flex-row justify-around items-center'>
          {FILTER_ITEMS.map(({icon, name}, index) => (
            <TouchableOpacity
              key={name}
              className={`flex-1 items-center justify-center py-2`}
              onPress={() => handleFilterChange(name, index)}
            >
              <Feather name={icon} size={24} color={activeFilter === name ? "#fff" : "gray"} />
            </TouchableOpacity>
          ))}
        </View>
        <Animated.View 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: width / FILTER_ITEMS.length,
            height: 3,
            backgroundColor: '#fff',
            transform: [{ translateX: linePosition }],
          }}
        />
      </View>
    );
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveFilter(FILTER_ITEMS[index].name);
  };

  return (
    <View className='flex-1 mt-7.5'>
      <Filter />
      <Animated.ScrollView
        // ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ width }}>
          <Chat />
        </View>
        <View style={{ width }}>
          <Groups />
        </View>
        <View style={{ width }}>
          <ServerList />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default memo(Messages);