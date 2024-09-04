import { Pressable, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import { HStack, Loader, MenuItems, Text, UserInfo, View } from '@/components';
import { formatDateString, useProfileStore } from '@/lib';
import Image from '@/components/image';

const ProfilePage = () => {
  const [activeButton, setActiveButton] = useState('profile');
  const { profile } = useProfileStore();

  if (!profile) return <Loader loadingText='Loading Profile'/>;

  const stats = {
    Posts: 0,
    Friends: profile?.friends?.length || 0,
  };

  const renderItem = ({ item }:any) => {
    if (item.type === 'menu') return <MenuItems />;
    if (item.type === 'friends') return <FriendsComponent friends={profile.friends} />;
    return null;
  };

  return (
    <View className='flex-1'>
      <Image 
        source={ profile.bannerImage ? profile.bannerImage : '' } 
        height={250}
        width={350}
        style='w-full justify-end items-center h-52' 
      />
      <Pressable 
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 20,
          padding: 8,
        }} 
        onPress={() => router.push("/editprofile")}
      >
        <Feather name='edit' size={24} color="white" />
      </Pressable>

      <View className='flex-row justify-between'>
        <UserInfo profile={profile} />
        <View className='flex-row justify-between items-center gap-1 mr-4 mt-3'>
          {Object.entries(stats).map(([label, number]) => (
            <View key={label} className='flex-col items-center mt-3'>
              <Text className='font-pregular text-[15px]'>{number}</Text>
              <Text className='font-rregular text-[10px] p-1 rounded-[9px]'>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='mx-2.5'>
        <Text className='font-rmedium mt-3.5'>
          About Me : 
          <Text className='font-pmedium mt-2.5 text-xs ml-3'>
            {profile.bio}
          </Text>
        </Text>
        <Text className='font-rmedium mt-3.5'>
          Member Since : {' '}
          <Text className='font-pregular mt-2.5 text-xs ml-3'>
            {profile.createdAt && formatDateString(profile.createdAt)}
          </Text>
        </Text>
      </View>

      <View className='flex-row justify-between items-center p-5 me-12 ms-12'>
        {['profile', 'gallery'].map((button) => (
          <Pressable 
            key={button}
            onPress={() => setActiveButton(button)}
            className={`flex flex-row gap-2.5 ${activeButton === button ? 'bg-light px-[2px] rounded-[5px] h-7' : ''}`}
          >
            <Text className={`font-rmedium tex-sm ${activeButton === button ? 'text-white mr-2' : ''}`}>{button.charAt(0).toUpperCase() + button.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      {activeButton === 'profile' ? (
        <FlatList
          data={[{ type: 'menu' }, { type: 'friends' }]}
          renderItem={renderItem}
          keyExtractor={item => item.type}
        />
      ) : (
        <Text>Gallery</Text>
      )}
    </View>
  );
};

const FriendsComponent = ({friends}:any) => {
  if(!friends || friends.length === 0) return <Text>You have no friends yet</Text>;

  return (
    <View>
      <Text className='font-rmedium p-2.5'>Your Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <HStack className='flex flex-row items-center px-4xs py-1 space-x-1'>
            <View className='mr-2.5'>
              <Image 
                source={ item.image?item.image:"https://via.placeholder.com/150" } 
                style='w-12.5 h-12.5 rounded-[25px]' 
                height={50}
                width={50}
              />
              
            </View>
            <View className='flex-1'>
              <Text className='font-rmedium mt-1.5 text-sm'>{item.name}</Text>
              <Text className='text-gray-400 text-xs font-rthin' >@{item.username || item.name}</Text>
            </View>
          </HStack>
        )}
      />
    </View>
  );
};

export default ProfilePage;