import { memo, useCallback, useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Chat, Groups, ServerList, Text, View } from '@/components';
import { voiceCallHandler } from '@/lib';

const FILTER_ITEMS = [
  { name: 'chats', icon: 'message-square' },
  { name: 'status', icon: 'users' },
  { name: 'servers', icon: 'server' },
];

const Messages: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('chats');
  const userNavigate = (userId: string) => {
    router.navigate(`/conversation/${userId}`);
  };
  
  const getFilterName = (filter: string) => {
    switch (filter) {
      case 'chats':
        return 'Threads';
      case 'groups':
        return 'Servers';
      case 'servers':
        return 'Communities';
      default:
        return '';
    }
  };
  
  const handlePress = () => {
    if (activeFilter === 'chats') return router.navigate("/users"); 
    if (activeFilter === 'status') return voiceCallHandler();
    if (activeFilter === 'servers') return router.navigate("/create-server"); 
  };

  const AddButton=()=>{
    return (
      <TouchableOpacity 
        className='flex-row border border-gray-500 rounded-[5px] p-[5px] ml-[35%] gap-1.5'
        onPress={handlePress}
      >
        <Feather name="user-plus" size={20} color={'gray'}/>
        <Text className='text-right font-rmedium font-sm' >
          {activeFilter === 'chats' ? 'Add Friend' : activeFilter === 'servers' ? 'Create Server' : activeFilter === 'status' ? 'Create Group' : null}
          
        </Text>
      </TouchableOpacity>
    );
  }

  const Filter = () => {
    const handleFilterChange = useCallback((filter: string) => {
      setActiveFilter(filter);
    }, [activeFilter]);
  
    return (
      <View >
        <View 
          className='flex-row justify-between my-3  items-center '
        >
          <Text className='font-rmedium text-xl'>
            {getFilterName(activeFilter)}
          </Text>

          <AddButton/>
        </View>

        <View 
        className='flex-row justify-around my-3 items-center'
         >
        {FILTER_ITEMS.map(({icon,name}) => (
          <TouchableOpacity
            key={name}
            className={`flex-1 items-center justify-center py-1 ${activeFilter === name && 'border-light border-b-2'}`}
            onPress={() => handleFilterChange(name)}
          >
            <Feather name={icon} size={20} color="gray" />
          </TouchableOpacity>
        ))}
        </View>
      </View>
    );
  };

  return (
    <View 
      className='flex-1 mt-7.5' 
    >
      <Filter /> 
      {activeFilter === 'chats' && <Chat navigate={userNavigate} />}
      {activeFilter === 'status' && <Groups />} 
      {activeFilter === 'servers' && <ServerList />} 
    </View> 
  );
};

export default memo(Messages);