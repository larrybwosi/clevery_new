import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, TextInput } from 'react-native';

import { View, Text } from '@/components/Themed';
import ButtonsContainer from './ButtonsContainer';

const AddFriend = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query:string) => {
    setSearchQuery(query);
  };

  return (
    <View className='flex-1 justify-between items-center px-2'>
      <ButtonsContainer/>
      <View className='flex-row justify-center items-center w-full'>
        <TouchableOpacity className='bg-[#ddd] items-center rounded-[25px] p-2.5 mx-1 '>
          <MaterialCommunityIcons name="account-plus" size={32} color="black" />
          <Text className='text-black mt-1 text-xs '>Add Friend</Text>
        </TouchableOpacity>
      </View>
      <View className='w-full mt-4'>
        <TextInput
          className='bg-[#f2f2f2] p-2.5 rounded-lg'
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
};
export default AddFriend;