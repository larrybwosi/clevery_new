import { useEffect, useState } from 'react';
import { TouchableOpacity ,FlatList } from 'react-native';
import { router } from 'expo-router';

import { selector, urlForImage, useGetUserFriends, useGetUserGallery, useGetUserPosts } from '@/lib';
import { ErrorMessage, Gallery, Loader, MenuItems, Text, UserCard, UserInfo, View } from '@/components';
import { Profile, User } from '@/types';
import { format, parseISO } from 'date-fns';
import { Image } from 'expo-image';

type StatProps = {
  number: number; 
  label: string;
};

const UserNavigate = (userId: string) => {
  router.navigate(`/conversation/${userId}`);
};

const ProfileButtons = ({ activeButton, setActiveButton }: { activeButton: string; setActiveButton: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <View className='flex-row justify-between items-center p-5 me-12 ms-12 ' >
      <TouchableOpacity onPress={() => setActiveButton('profile')} 
      className={`flex flex-row gap-2.5 ${activeButton === 'profile' && 'bg-light  px-[2px]  rounded-[5px] h-7'} `} >
        <Text className={`font-rmedium tex-sm  ${activeButton === 'profile' && 'text-white mr-2 '} `} >Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity className={`flex flex-row gap-2.5 ${activeButton === 'gallery' && 'bg-light  px-[2px]  rounded-[5px] h-7'} `}
       onPress={()=>setActiveButton('gallery')}
      >
        <Text className={`font-rmedium tex-sm  ${activeButton === 'gallery' && 'text-white'} `}>Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

const UserBanner = ({ bannerImage, profile,stats }: { bannerImage: string; profile: any ,stats:any}) => {
  return (
    <>
      <Image source={{ uri: bannerImage }} className='w-full justify-end items-center h-52' />
      <View className='flex-row justify-between'>
        <UserInfo profile={profile} />
        <UserStats stats={stats}/>
      </View>
    </>
  );
};

const UserStats = ({ stats }: { stats: { Posts: number; Friends: number } }) => {
  return (
    <View  className='flex-row justify-between items-center gap-1 mr-4 mt-3'>
      <Stat number={stats.Posts} label="Posts" />
      <Stat number={stats.Friends} label="Friends" />
    </View>
  );
};

const Stat = ({ number, label }: StatProps) => {
  return (
    <View className='flex-col items-center mt-3'>
      <Text className='font-pregular font-[15px]'>{number}</Text>
      <Text className='font-rregular font-[10px] p-1 rounded-[9px]' >{label}</Text>
    </View>
  );
};

interface FriendsProps {
  friends:User[]
  loadingFriends:boolean;
  friendsError:any;
}
const FriendsComponent = ({friends,friendsError,loadingFriends}:FriendsProps) => {

  if(loadingFriends) return <Loader loadingText='Loading your friends'/>
  if(friendsError) return <ErrorMessage message="Failed to get friends, please try again" />
  if(!friends) return <Text>You have no friends yet</Text>

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
            handleAddFriend={()=>{}}
            showlastMessage={false}
            onSelectUser={() => UserNavigate(item?._id)}
            isFriend
          />
        )}
      />
    </View>
  );
};

const ProfilePage = () => {
  const [activeButton, setActiveButton] = useState('profile');

  const profile = selector((state) => state.profile.profile);
   
  const { data: posts, isPending: loadingPosts, error: postsError } = useGetUserPosts(profile?._id); 

  const stats = {
    Posts: posts?.length || 0,
    Friends:  0,
  };

  
  const renderItem = ({ item }:{item:any}) => {
    if (item.type === 'menu') {
      return <MenuItems />;
    } else if (item.type === 'friends') {
      // return <FriendsComponent friends={friends} loadingFriends={loadingFriends} friendsError={friendsError} />;
    }
    return <Text>Error</Text>
  };

  const data = [
    { type: 'menu' },
    { type: 'friends' },
  ]

  

  if (!profile) return <Loader loadingText='Loading Profile'/>
  
  return (
    <View className='flex-1'>
      <UserBanner
        bannerImage={profile.bannerImage ? urlForImage(profile.bannerImage).width(350).url() : 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=400'}
        profile={profile}
        stats={stats}
      />
      <View className='mx-2.5'>
        <Text className='font-rmedium mt-3.5'>About Me:  <Text className='font-pregular mt-2.5 text-sm'>{profile?.bio}</Text></Text>
        <Text className='font-rmedium mt-3.5' >Member Since:  <Text className='font-pregular mt-2.5 text-sm'>{profile?._createdAt&&format(parseISO(profile?._createdAt as string), 'dd MMM yyyy')}</Text></Text>
      </View>
      <ProfileButtons activeButton={activeButton} setActiveButton={setActiveButton} />
      {activeButton == 'profile'?
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.type}
        />
      :
      // <Gallery images={gallery} loading={loadingGallery} />
      <Text>Gallery</Text>
      }
    </View>
  );
};
export default ProfilePage