import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { channelHooks, parseIncomingMessage, pusher, selectImage, sortMessages, useSendChannelMessage} from '@/lib';
import { ChannelTop, ErrorMessage, Loader, MessageInput, Messages, View } from '@/components'
import { Message } from '@/types';

interface newMessage {
    caption:string;
    file:any[]
  }
  
const Channel = () => {
  const [messages, setMessages] = useState<Message[]>() 
    
  const [newMessage, setNewMessage] = useState<newMessage>({
    caption:'',
    file:[]
  })
  console.log(messages)
  const {id} = useLocalSearchParams()

  const {
    channel,loading,error
  } =channelHooks({channelid:id as string})
  
  const {
    mutateAsync:sendMessage,
    isPending:sendingMessage,
    isError:sendMessageError
  }= useSendChannelMessage()
 
  useEffect(()=>{
    setMessages(channel?.messages!)

  const messageHandler = (message:Message) => {
    setMessages((prev) => {
      const existingMessageIds = new Set(prev?.map((msg) => msg._id));
      if (existingMessageIds.has(message._id)) {
        return prev;
      } else {
        if (prev) return[message,...prev]
        return [message];
      }
    });
  };
  if (channel?._id){
    pusher.subscribe({
      channelName: channel?._id,
      onEvent: (event: PusherEvent) => {
        if (event.eventName === 'new-channel-message') {
          const cleanedObject = parseIncomingMessage(event);
          console.log(cleanedObject)
          messageHandler(cleanedObject.data);
        }
      }
    });
    return ()=>{
      pusher.unsubscribe({channelName:channel?._id});
    }
  }
  },[channel?._id])


  const handleSend = async () => {
    if (!channel?._id) return;
    const { caption, file } = newMessage;
    if (caption || file.length > 0) {
      
      await sendMessage({
        channelId: channel._id,
        caption,
        files: file[0],
      }).then(() => {
        setNewMessage({ caption: '', file: [] });
      });
    }
  };

const chooseFile = async () => {
  const file = await selectImage();
  if (file) {
    setNewMessage({ ...newMessage, file: [file] });
  }
};

const closeFile = () => {
  setNewMessage({ ...newMessage, file: [] });
};
  
  
  if (loading) return <Loader loadingText='Loading Channel'/>
  if (error) return <ErrorMessage message='Failed'/>
    
  const sortedMessages=messages ?sortMessages({messages:messages!}):[]

  return (
    <View className='flex-1 mt-6 p-0.5' >

      <ChannelTop channelName= {channel?.name!}/>

      <Messages
        messages={sortedMessages}
        setNewMessage={(text)=>setNewMessage({caption:text,file:newMessage.file})}
        newMessage={newMessage}
        closeFile={closeFile}
        createdAt={channel?._createdAt!}
        channel={channel}
      />
      <MessageInput
        caption={newMessage.caption}
        onMessageChange={(e)=>setNewMessage({...newMessage,caption:e})}
        onSend={handleSend}
        sending={sendingMessage}
        onChooseFile={chooseFile}
      />
    </View>
  )
}

export default Channel
