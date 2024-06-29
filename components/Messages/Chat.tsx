import ErrorMessage from '@/components/ErrorMessage';
import { Text, View } from '@/components/Themed';
import { Button } from 'react-native-elements';
import UserCard from '@/components/UserCard';
import { useGetConversations } from '@/lib';
import Loader from '@/components/Loader';
import { FlatList } from 'react-native';
import { router } from 'expo-router';

interface ChatProps {
  navigate: (userId: string) => void; 
}

const Chat: React.FC<ChatProps> = ({ navigate }) => {
  const { 
    data: friends, 
    isPending: loading, 
    error 
  } = useGetConversations();
  
  
  if (loading) return <Loader loadingText='Loading conversations' />;
  // if (error) return <ErrorMessage message='Failed to get friends' />;

  if(!friends || error){
    return (
      <View className='flex-1 justify-center p-5 gap-2.5' >
        <Text className='text-sm font-rmedium' >You have no friends yet ,click to add a friend to start a conversation</Text>
        <Button title={'Add friend'} className='w-[50%] m-2.5 ' onPress={()=>router.push("/users")} />
      </View>
    )
  }
  return (
    <FlatList
      data={friends}
      keyExtractor={(item: any) => item?._id}  
      renderItem={({ item }: any) => (
        <UserCard user={item}
          onSelectUser={navigate} 
          handleAddFriend={()=>{}} 
          showlastMessage
        />
      )}
    />
  );
};

export default Chat