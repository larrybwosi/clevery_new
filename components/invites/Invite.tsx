import {FlatList, TouchableOpacity, ScrollView } from 'react-native';

import ButtonsContainer from './ButtonsContainer';
import SearchBar from './SearchBar'; 
import { Text, View } from '../Themed';
import { urlForImage } from '@/lib';
import { Image } from 'expo-image'
import { User } from '@/types';

interface Props {
  onInvitePress: (user: User) => void;
  removeUser: (userId: string) => void;
  onClose: () => void;
  buttonText:string;
  selectedUsers:User[];
  friends?:string[];
  users:User[];
}

const InviteFriends: React.FC<Props> = ({ users,onInvitePress,buttonText,onClose,selectedUsers,removeUser }) => {

  const handleSearchPress = () => {
    console.log('Search button pressed');
  };

  return (
    <View className="flex-1 p-2.5 " >
      <TouchableOpacity className='z-10' onPress={onClose}>
        <Text
        className='z-10 shadow-lg font-pregular ml-auto text-purple-700' 
        >Close
      </Text>
      </TouchableOpacity>
      <ButtonsContainer/>
      {selectedUsers.length>1 &&
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
        className='mb-2.5 z-10'
         >
          {selectedUsers?.map((user) => (
            <TouchableOpacity
              key={user._id}
              className='w-12.5 h-12.5 rounded-[25px] overflow-hidden mr-2.5 mb-2.5 '
              onPress={() => removeUser(user._id)}
            >
              <Image source={{ uri: urlForImage(user.image).width(100).url() }} className='w-full h-full' />
            </TouchableOpacity>
          ))}
        </ScrollView>
      }
      <SearchBar onSearchPress={handleSearchPress} /> 
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View  className='flex-row items-center mb-4'>
            <Image
              source={{ uri: urlForImage(item.image).width(100).url() }}
              className='w-12.5 h-12.5 mr-4 rounded-[25px] '
            />
            <View
            className='flex-1'>
              <Text className='font-rregular text-sm' >{item.name}</Text>
            </View>
            <TouchableOpacity className='bg-[#4caf50] px-2 rounded-[20px] py-1' onPress={() => onInvitePress(item)}>
              <Text className='text-white text-sm font-rregular' >{buttonText}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

export default InviteFriends;