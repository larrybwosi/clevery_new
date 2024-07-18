import { useState } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Loader, MenuItems, Text, UserCard, UserInfo, View } from '@/components';
import { urlForImage, useGetUserPosts, useProfileStore } from '@/lib';
import { format, parseISO } from 'date-fns';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

const ProfilePage = () => {
  const [activeButton, setActiveButton] = useState('profile');
  const { profile } = useProfileStore();
  const { data: posts } = useGetUserPosts(profile?._id);

  if (!profile) return <Loader loadingText='Loading Profile'/>;

  const stats = {
    Posts: posts?.length || 0,
    Friends: profile.friends?.length || 0,
  };

  const renderItem = ({ item }:any) => {
    if (item.type === 'menu') return <MenuItems />;
    if (item.type === 'friends') return <FriendsComponent friends={profile.friends} />;
    return null;
  };

  return (
    <View className='flex-1'>
      <Image 
        source={{ uri: profile.bannerImage ? urlForImage(profile.bannerImage).width(350).url() : '' }} 
        className='w-full justify-end items-center h-52' 
      />
      <TouchableOpacity 
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 20,
          padding: 8,
        }} 
        onPress={() => router.navigate("/editprofile")}
      >
        <Feather name='edit' size={24} color="white" />
      </TouchableOpacity>

      <View className='flex-row justify-between'>
        <UserInfo profile={profile} />
        <View className='flex-row justify-between items-center gap-1 mr-4 mt-3'>
          {Object.entries(stats).map(([label, number]) => (
            <View key={label} className='flex-col items-center mt-3'>
              <Text className='font-pregular font-[15px]'>{number}</Text>
              <Text className='font-rregular font-[10px] p-1 rounded-[9px]'>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='mx-2.5'>
        <Text className='font-rmedium mt-3.5'>About Me: <Text className='font-pregular mt-2.5 text-sm'>{profile.bio}</Text></Text>
        <Text className='font-rmedium mt-3.5'>Member Since: <Text className='font-pregular mt-2.5 text-sm'>{profile._createdAt && format(parseISO(profile._createdAt), 'dd MMM yyyy')}</Text></Text>
      </View>

      <View className='flex-row justify-between items-center p-5 me-12 ms-12'>
        {['profile', 'gallery'].map((button) => (
          <TouchableOpacity 
            key={button}
            onPress={() => setActiveButton(button)}
            className={`flex flex-row gap-2.5 ${activeButton === button ? 'bg-light px-[2px] rounded-[5px] h-7' : ''}`}
          >
            <Text className={`font-rmedium tex-sm ${activeButton === button ? 'text-white mr-2' : ''}`}>{button.charAt(0).toUpperCase() + button.slice(1)}</Text>
          </TouchableOpacity>
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
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
          <UserCard
            key={item?._id}
            user={item}
            handleAddFriend={() => {}}
            showlastMessage={false}
            onSelectUser={() => router.navigate(`/conversation/${item?._id}`)}
            isFriend
          />
        )}
      />
    </View>
  );
};

export default ProfilePage;