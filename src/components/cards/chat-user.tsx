import { Pressable } from 'react-native';

import { Text, View } from '../themed';
import { Conversation } from '@/types';
import Image from '../image';
interface UserCardProps {
  conversation: Conversation
  onSelectUser: (id: string) => void;
  lastMessage?: string;
}

const UserCard: React.FC<UserCardProps> = ({ conversation, onSelectUser }) => {
  const { id, user: { image, name, username }, lastMessage } = conversation;
  const isOnline = true;
  const isTyping = false;
  const unreadMessages = 3

  return (
    <Pressable className='flex-row items-center px-4xs py-1' onPress={() => onSelectUser(id)}>
      <View className='mr-2.5'>
        <Image
          source={image ? image : "https://via.placeholder.com/150"}
          width={80}
          height={80}
          style='w-12.5 h-12.5 rounded-[25px]'
        />
        {isOnline && <View style={{
          position: 'absolute', right: 0, bottom: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFFFFF'
        }} />}
      </View>
      <View className='flex-1'>
        <Text className='font-rmedium mt-1.5 text-sm'>{name}</Text>
        <Text className='text-gray-400 text-[11px] font-rthin' >@{username || name}</Text>
        <Text className='mt-1.5 font-rthin text-[10px] '>{lastMessage?.text}</Text>
      </View>
    </Pressable>
  );
};

export default UserCard
