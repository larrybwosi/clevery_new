import { FlatList } from 'react-native';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';
import UserCard from '@/components/UserCard';
import { useGetConversations } from '@/lib';
import CustomButton from '../CustomButton';
import Loader from '../Loader';

interface ChatProps {
  navigate: (userId: string) => void; 
}

const Chat: React.FC<ChatProps> = ({ navigate }) => {

  const {
    data:conversations,
    isLoading:loading,
    error
  } =  useGetConversations()
  console.log(conversations)
  if(error || loading) return <Loader loadingText='Loading your conversations'/>
  
  if(!conversations?.length ){
    return (
      <View className='flex-1 justify-center p-5 gap-2.5' >
        <Text className='text-sm font-rmedium' >You have no friends yet ,click to add a friend to start a conversation</Text>
        <CustomButton
         title={'Add friend'} 
         containerStyles='w-[30%] m-2.5 ' 
         handlePress={()=>router.push("/users")} 
        />
      </View>
    )
  }
  return (
    <FlatList
      data={conversations}
      keyExtractor={(item: any) => item?._id}  
      renderItem={({ item }: any) => (
        <UserCard 
          conversation={
            {...item,isOnline:true,isTyping:false,unreadMessages:3}}
          onSelectUser={navigate}
        />
      )}
    />
  );
};

export default Chat