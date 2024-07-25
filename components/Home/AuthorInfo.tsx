import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { multiFormatDateString, urlForImage } from '@/lib';
import  CertificateIcon from '../CheckIcon';
import { Text, View } from '../Themed';

type AuthorInfoProps = {
  author: {
    id:string;
    name: string;
    username?: string;
    image?: string | null;
  };
  timestamp:string;
  iscomment?:boolean;
};

const AuthorInfo = ({ author, timestamp,iscomment }:AuthorInfoProps) => {
    return (
      <View className='flex-row items-center mb-2.5'>
        <TouchableOpacity onPress={() => router.push(`/user/${author?.id}`)}>
          {author?.image &&
           <Image source={{ uri: urlForImage(author?.image).width(100).url() }} 
            className='mr-2.5 w-[50px] h-[50px] rounded-3xl'
          />
          }
        </TouchableOpacity>
        <View className='flex-1'>
          <View className='flex-row gap-1.5'>
            <Text className={`text-4 font-rmedium text-${iscomment? "[12px]":"[16px]"}`} >{author?.name}</Text>
            {/* {author?.isVerified && <CertificateIcon />} */}
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