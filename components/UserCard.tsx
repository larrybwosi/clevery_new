import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import { conversation } from '@/types';
import { Text, View } from './Themed';
import { urlForImage } from '@/lib';
interface UserCardProps {
  conversation: conversation
 onSelectUser: (id: string) => void;
 lastMessage?: string;
}

const UserCard: React.FC<UserCardProps> = ({ conversation, onSelectUser }) => {
 const { image, name, username, _id, lastMessage, isOnline, isTyping,unreadMessages } = conversation;


 return (
    <TouchableOpacity className='flex-row items-center px-4xs py-1' activeOpacity={1} onPress={() => onSelectUser(_id)}>
      <View className='mr-2.5'>
        <Image source={{ uri: image?urlForImage(image).url():"https://via.placeholder.com/150" }} className='w-12.5 h-12.5 rounded-[25px]' />
        {isOnline && <View style={{
          position: 'absolute', right: 0, bottom: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFFFFF'
        }} />}
      </View>
      <View className='flex-1'>
        <Text className='font-rmedium mt-1.5 text-sm'>{name}</Text>
         <Text className='text-gray-400 text-xs font-rthin' >@{username}</Text>
         <Text className='mt-1.5 font-pthin text-[10px] '>{lastMessage?.text}</Text>
      </View>
    </TouchableOpacity>
 );
};

export default UserCard
