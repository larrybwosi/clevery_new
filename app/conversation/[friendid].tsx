import { memo, useCallback, useEffect, useState } from 'react'; 
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { selectImage,sortMessages,pusher, userMessages, parseIncomingMessage, selector, showToastMessage } from '@/lib';
import { Loader, MessageInput, Text, View, ErrorMessage, Messages } from '@/components';

import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import AudioVideoComponent from '@/components/audio-video-call';
import { IMessage, Message } from '@/types';

interface newMessage {
  caption:string;
  file:any[]
} 
 
interface UserMessagesProps {
  user: any;
  messages: IMessage[];
  friendIds: string[];
  created:string;
  convId:string; 
  handleRefresh: ()  => void;
}

const UserMessages: React.FC<UserMessagesProps> = () => {
  const [messages, setMessages] = useState<Message[]>()
  const [audioCall, setAudioCall] = useState(false) 
  const [videoCall, setVideoCall] = useState(false) 
  const [newMessage, setNewMessage] = useState<newMessage>({
    caption:'',
    file:[]
  })

  const profile = selector((state) => state.profile.profile);
  const { friendid } = useLocalSearchParams()
const {
  user,loadingUser,userError,conversation,loadingconversation,conversationError, 
  sendMessage,sendingMessage,sendMessageError,refetchUser
}=userMessages(friendid as string)


  useEffect(()=>{
    const messageHandler=(message:Message)=>{
      setMessages((prev)=>{
        if( prev?.find((msg)=>msg?._id === message?._id)){
          return prev
        } else {
          if (prev) return[message,...prev]
          return [message]
        }
      }) 
    }
    if (conversation?._id){
      pusher.subscribe({
        channelName: conversation?._id,
        onEvent: (event: PusherEvent) => {
          if (event.eventName === 'new-message') {
            const cleanedObject = parseIncomingMessage(event); 
            messageHandler(cleanedObject?.data);
          }
        }
      });
      return ()=>{
        pusher.unsubscribe({channelName:conversation?._id});
      }
    }
  },[conversation?._id]) 

  useEffect(()=>{
    setMessages(conversation?.messages)
  },[conversation?.messages])
  
const chooseFile = async () => {
  const file = await selectImage();
  if (file) {
    setNewMessage({...newMessage,file:file});
  }
};

const handleSend = async () => {
  const { caption, file } = newMessage
  if (!user || !conversation || !friendid) return;
  if (!caption && !file ) return showToastMessage("Please input a message")

  const message = {
    caption,
    friendid:friendid as string,
    file: newMessage.file[0],
  };

  await sendMessage({ 
    conversationId: conversation._id, 
    message 
  });

  setNewMessage({ caption: '', file: [] });
}

const latestMessage = messages?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]; 

const handleLastMessage = useCallback(() => {
  
 }, [latestMessage, user]); 

  
  const closeFile = () => {
    setNewMessage({...newMessage,file:[]});
  };
  
  const refetch =()=>{
    refetchUser()
  }
  if (loadingUser)return <Loader loadingText='Loading user'/>
  if ( loadingconversation)return <Loader loadingText='Loading your conversation'/>
  // if ( loadingMessages)return <Loader loadingText='Loading messages'/>
  if (userError||!user||conversationError)return <ErrorMessage message='Network error' onRetry={()=>refetch()} />
  const sortedMessages=sortMessages({messages:messages!})
  
  if(audioCall || videoCall){
    return(
      <AudioVideoComponent
        channelid='test-channel'
        callType='default'
        video
      />
    )
  }
  return (
    <View
    className='flex-1 p-1 pt-7' > 
      <Ionicons 
        name="arrow-back" 
        size={24} color="#007aff"  
        onPress={()=>router.back()} 
        className='absolute top-[30px] left-[15px] mr-2.5 z-30 mb-2.5 br-[5px] mx-1'
       />
    <View 
    className='flex-row justify-between pb-2 border-b-[.5px] border-gray-500 '
     >
      <Text className='text-sm font-pbold ml-[20%] mt-1.5  '
       >
        @{user?.username}
      </Text> 
      <View className='flex-row items-center gap-5' 
      >
        <Feather name="phone-call" size={18} color={'#007aff'} onPress={()=>setAudioCall(true)}/>
        <Feather name="video" size={18} color={'#007aff'} onPress={()=>router.navigate("/room")}/>
      </View>
    </View>

      <Messages
        messages={sortedMessages}
        setNewMessage={(text)=>setNewMessage({caption:text,file:newMessage.file})}
        newMessage={newMessage}
        closeFile={closeFile}
        createdAt={conversation?._createdAt!}
        //@ts-ignore
        user={user}
      />
    <MessageInput
      caption={newMessage.caption}
      onMessageChange={(e)=>setNewMessage({...newMessage,caption:e})}
      onSend={handleSend}
      sending={sendingMessage}
      onChooseFile={chooseFile}
    />
  </View>
  );
};
 
export default memo(UserMessages);

