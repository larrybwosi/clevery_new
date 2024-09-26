import { useState, useCallback } from 'react';
import { FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';

import { Text, View } from '../themed';
import { User } from '@/types';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import LoadingUsers from './loading-users';

const link = `https://clevery.vercel.app/`;

interface Props {
  onInvitePress: (user: User) => void;
  removeUser: (userId: string) => void;
  onClose: () => void;
  buttonText: string;
  selectedUsers: User[];
  users?: User[];
  loading:boolean
}


const icons = [
  { name: 'upload', component: <Feather name="upload" size={24} color="white" />, label: 'Share' },
  { name: 'link', component: <Feather name="link" size={24} color="white" />, label: 'Copy Link', onPress: true },
  { name: 'message-circle', component: <Feather name="message-circle" size={24} color="white" />, label: 'Messages' },
  { name: 'user-plus', component: <Feather name="user-plus" size={24} color="white" />, label: 'Email' },
  { name: 'whatsapp', component: <FontAwesome6 name="whatsapp" size={24} color="white" />, label: 'Whatsapp' },
];

const handlePress = (name: string) => {
  console.log(`Button with name ${name} pressed`);
};

const InviteFriends: React.FC<Props> = ({ 
  users, 
  onInvitePress, 
  buttonText, 
  onClose, 
  selectedUsers, 
  removeUser,
  loading
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log(filteredUsers);
  const clipboard = {}
  const copyToClipboard = async () => {
    // try {
      
    //   if (clipboard.hasCopied) showToastMessage('Link already copied');
    //   else {
    //     await clipboard.onCopy(link);
    //     showToastMessage('Link copied');
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const renderUser = useCallback(({ item }: { item: User }) => (
    <Animated.View 
      entering={FadeInRight.duration(500)} 
      exiting={FadeOutLeft.duration(500)}
      className="flex-row items-center  bg-opacity-10 rounded-xl mb-3 p-3"
    >
      <Image
        source={{ uri: item.image}}
        style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: 'gray',marginRight: 10 }}
      />
      <Text className="flex-1 font-rregular text-base text-gray-50">{item.name}</Text>
      <TouchableOpacity 
        disabled={loading}
        className="bg-green-500 px-4 py-2 rounded-xl" 
        onPress={() => onInvitePress(item)}
      >
        {!loading?<Text className="font-rregular">{buttonText}</Text>:<ActivityIndicator size={'small'}/>}
      </TouchableOpacity>
    </Animated.View>
  ), [onInvitePress, buttonText]);

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      className="flex-1 p-5 mt-7"
    >
      <HStack className="flex-row items-center justify-between">
        <Text className="text-3xl font-rmedium text-white">Invite Friends</Text>
        <TouchableOpacity
          onPress={onClose}
          className="p-2 bg-gray-200 rounded-full"
        >
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>
      </HStack>

      {selectedUsers.length > 0 && (
        <FlatList
          horizontal
          data={selectedUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mr-3"
              onPress={() => removeUser(item.id)}
            >
              <Image
                source={{ uri: item.image}}
                style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: 'gray',marginRight: 10 }}
              />
              <View className="absolute -top-1 -right-1 bg-black bg-opacity-50 rounded-xl p-1">
                <Feather name="x" size={12} color="gray" />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{paddingBottom:12,paddingTop:6}}
        />
      )}

      <HStack space='2xl'
       className="flex-row items-center ml-[-10]  bg-transparent shadow-cyan-700 
       shadow-md p-3 rounded-xl px-4 w-[110%] mr-5 mb-5"
      >
        <Feather name="search" size={20} color="white" />
        <TextInput
          className="flex-1 py-2 pl-3"
          placeholder="Search friends"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </HStack>

      <HStack className="bg-transparent border rounded-xl p-2 mb-5 gap-2" space='2xl'>
        <FlatList
          data={icons}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <VStack 
              className="items-center mr-4 ml-4 space-x-2" 
            >
              <HStack className=" pr-2 mb-1 bg-transparent ">
                {item.component}
              </HStack>
              <Text className="text-xs font-rregular text-white ">{item.label}</Text>
            </VStack>
          )}
        />
      </HStack>

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingTop:12}}
        ListEmptyComponent={<LoadingUsers/>}
      />
    </LinearGradient>
  );
};

export default InviteFriends;