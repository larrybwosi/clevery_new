import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { multiFormatDateString } from '@/lib';
import { Text, View } from '../themed';

type AuthorInfoProps = {
  author: {
    id:string;
    name: string;
    username?: string | null;
    image?: string | null;
  };
  timestamp:string;
  iscomment?:boolean;
};

const AuthorInfo = ({ author, timestamp,iscomment }:AuthorInfoProps) => {
    return (
      <View className='flex-row items-center mb-2.5'>
        <Pressable onPress={() => router.push(`/user/${author?.id}`)}>
          {author?.image &&
           <Image 
            source={author?.image} 
            style={{marginRight:10, width:50, height:50, borderRadius:20}}
          />
          }
        </Pressable>
        <View className='flex-1'>
          <View className='flex-row gap-1.5'>
            <Text className={`text-4 font-rmedium text-${iscomment? "[12px]":"[16px]"}`} >{author?.name}</Text>
            {/* {author?.isVerified && <CertificateIcon />} */}
            {/* <MasterBadge/> */}
          </View>
          <Text className={`text-[#aaa] font-pregular text-${iscomment? "[8px]":"[12px]"}`} >@{author?.username} </Text>
        </View>
        <Text 
          className='font-pregular text-[10px] text-light'>
          {multiFormatDateString(timestamp)}
        </Text>
      </View>
    );
  };

export default AuthorInfo;