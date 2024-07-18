import { memo, useCallback, useEffect, useState } from 'react'; 
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

import { selectImage,sortMessages,pusher, userMessages, parseIncomingMessage, showToastMessage } from '@/lib';
import { Loader, MessageInput, Text, View, ErrorMessage, Messages } from '@/components';

import AudioVideoComponent from '@/components/audio-video-call';
import { IMessage, Message } from '@/types';

interface newMessage {
  caption:string;
  file:any[]
} 
 
interface UserMessagesProps {
  user: any;
  messages: IMessage[];
  ids: string[];
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

  const { id } = useLocalSearchParams()
const {
  conversation,loadingconversation,conversationError, 
  sendMessage,sendingMessage,sendMessageError
}=userMessages(id as string)


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
  if (!conversation || !id) return;
  if (!caption && !file ) return showToastMessage("Please input a message")

  const message = {
    caption,
    file: newMessage.file[0],
  };

  await sendMessage({ 
    conversationId: conversation._id, 
    message 
  });

  setNewMessage({ caption: '', file: [] });
}
  
  const closeFile = () => {
    setNewMessage({...newMessage,file:[]});
  };
  
  if ( loadingconversation)return <Loader loadingText='Loading your conversation'/>
  // if ( loadingMessages)return <Loader loadingText='Loading messages'/>
  if (conversationError)return <ErrorMessage message='Network error' onRetry={()=> {}} />
  const sortedMessages=sortMessages({messages:messages!})
  
  if(audioCall || videoCall){
    return(
      <AudioVideoComponent
        channelName='test-channel'
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
        @{conversation?.username}
      </Text> 
      <View className='flex-row items-center gap-5' 
      >
        <Feather name="phone-call" size={18} color={'#007aff'} onPress={()=>setAudioCall(true)}/>
        <Feather name="video" size={18} color={'#007aff'} onPress={()=>router.navigate("/room")}/>
      </View>
    </View>

      <Messages
        conversation={conversation!}
        messages={sortedMessages}
        setNewMessage={(text)=>setNewMessage({caption:text,file:newMessage.file})}
        newMessage={newMessage}
        closeFile={closeFile}
        createdAt={conversation?._createdAt!}
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

