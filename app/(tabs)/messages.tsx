import React, { memo, useCallback, useState, useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { router } from 'expo-router';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';

import { Chat, Groups, ServerList, Text, View } from '@/components';
import { voiceCallHandler } from '@/lib';

interface FilterItem {
  name: string;
  icon: string;
}

const FILTER_ITEMS: FilterItem[] = [
  { name: 'chats', icon: 'message-square' },
  { name: 'status', icon: 'users' },
  { name: 'servers', icon: 'server' },
];

const { width } = Dimensions.get('window');

const Messages: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('chats');
  const scrollViewRef = useRef<typeof ScrollView>(null);

  const userNavigate = (userId: string): void => {
    router.navigate(`/conversation/${userId}`);
  };
  
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

  const AddButton: React.FC = () => {
    return (
      <TouchableOpacity 
        className='flex-row border border-gray-500 rounded-[5px] p-[5px] ml-[35%] gap-1.5'
        onPress={handlePress}
      >
        <Feather name="user-plus" size={20} color={'gray'}/>
        <Text className='text-right font-rmedium font-sm'>
          {activeFilter === 'chats' ? 'Add Friend' : activeFilter === 'servers' ? 'Create Server' : activeFilter === 'status' ? 'Create Group' : null}
        </Text>
      </TouchableOpacity>
    );
  };

  const Filter: React.FC = () => {
    const handleFilterChange = useCallback((filter: string, index: number): void => {
      setActiveFilter(filter);
      scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    }, []);
  
    return (
      <View>
        <View className='flex-row justify-between my-3 items-center'>
          <Text className='font-rmedium text-xl'>
            {getFilterName(activeFilter)}
          </Text>
          <AddButton/>
        </View>

        <View className='flex-row justify-around my-3 items-center'>
          {FILTER_ITEMS.map(({icon, name}, index) => (
            <TouchableOpacity
              key={name}
              className={`flex-1 items-center justify-center py-1 ${activeFilter === name && 'border-light border-b-2'}`}
              onPress={() => handleFilterChange(name, index)}
            >
              <Feather name={icon} size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveFilter(FILTER_ITEMS[index].name);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className='flex-1 mt-7.5'>
        <Filter />
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
        >
          <View style={{ width }}>
            <Chat navigate={userNavigate} />
          </View>
          <View style={{ width }}>
            <Groups />
          </View>
          <View style={{ width }}>
            <ServerList />
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default memo(Messages);