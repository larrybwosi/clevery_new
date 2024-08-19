import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, } from 'expo-router';

import { parseIncomingMessage, pusher, selectImage, sortMessages, useChannelData, useSendChannelMessage} from '@/lib';
import { ChannelTop, ErrorMessage, Loader, MessageInput, Messages, View } from '@/components'
import AudioVideoComponent from '@/components/audio-video-call';
import { Message } from '@/types';

interface newMessage {
    caption:string;
    file:string
  }
  
const Channel = () => {
  const [messages, setMessages] = useState<Message[]>() 
    
  const [newMessage, setNewMessage] = useState<newMessage>({
    caption:'',
    file:''
  })
  const {id,serverId} = useLocalSearchParams()

  const {
    channel,
    state,
    sendChannelMessage,
    isLoading,
    sendMessageLoading,
    error
  } =useChannelData(id as string)
  
  useEffect(()=>{
    setMessages(channel?.messages!)

  const messageHandler = (message:Message) => {
    setMessages((prev) => {
      const existingMessageIds = new Set(prev?.map((msg) => msg.id));
      if (existingMessageIds.has(message.id)) {
        return prev;
      } else {
        if (prev) return[message,...prev]
        return [message];
      }
    });
  };
  if (channel?.id){
    pusher.subscribe({
      channelName: channel?.id,
      onEvent: (event: PusherEvent) => {
        if (event.eventName === 'new-channel-message') {
          const cleanedObject = parseIncomingMessage(event);
          console.log(cleanedObject)
          messageHandler(cleanedObject.data);
        }
      }
    });
    return ()=>{
      pusher.unsubscribe({channelName:channel?.id});
    }
  }
  },[channel?.id])


  const handleSend = async () => {
    if (!channel?.id) return;
    const { caption, file } = newMessage;
    if (caption || file ) {
      
     const message = await sendChannelMessage(caption).then(() => {
        setNewMessage({ caption: '', file:'' });
      });
      console.log(message)
    }
  };

const chooseFile = async () => {
  const file = await selectImage();
  if (file) {
    setNewMessage({ ...newMessage, file:file[0] });
  }
};

const closeFile = () => {
  setNewMessage({ ...newMessage, file: '' });
};
  
  if (isLoading || state?.status === 'loading') return <Loader loadingText='Loading Channel'/>
  // if (error) return <ErrorMessage message='Failed'/>
  const sortedMessages=messages ?sortMessages({messages:messages!}):[]

  if (channel?.type === "AUDIO"){
    return ( 
      <AudioVideoComponent
        channelName={channel?.name!}
        callType='default'
        video
      />
    )
  }
  return (
    <View className='flex-1 mt-6 p-0.5' >

      <ChannelTop channelName= {channel?.name!}/>

      <Messages
        messages={sortedMessages}
        setNewMessage={(text)=>setNewMessage({caption:text,file:newMessage.file})}
        newMessage={newMessage}
        closeFile={closeFile}
        createdAt={channel?.createdAt!}
        channel={channel}
      />
      <MessageInput
        caption={newMessage.caption}
        onMessageChange={(e)=>setNewMessage({...newMessage,caption:e})}
        onSend={handleSend}
        sending={sendMessageLoading}
        onChooseFile={chooseFile}
      />
    </View>
  )
}

export default Channel
