import { urlForImage, useProfileStore } from '@/lib';
import { memo } from 'react';
import { Text, View } from '../Themed';
import { Image } from 'expo-image';

const UserInfo = ({ profile }:any) => {
  const { profile:{name, image, username } } = useProfileStore();
  return (
    <View 
    className='flex flex-row items-center gap-2.5 px-5 mt-1 '
    >
    <Image 
    source={{ uri: profile.image? image :"https://via.placeholder.com/150" }}
     className='h-[70px] w-[70px] rounded-[35px] gap-1.5 border-gray-600 ' />
      <View className='flex-col flex'>
        <Text className='font-rbold text-xl' >
          {name}
          </Text> 
        <Text className='font-plight text-xs' >@{username}</Text>
      </View>
    </View>
  ); 
};

export default memo(UserInfo);