import { useRef, useState } from 'react'

import MessagesContainer from './MessageContainer'
import { Animated, FlatList } from 'react-native'
import { Channel, Message, User } from '@/types'
import { View } from '@/components/Themed'
import ImageWithCaption from './ImageCont'
import PopupComponent from './Popup'
import Header from './Header'
import LoadingMessages from '../skeletons/messages'

  interface newMessage {
    caption:string;
    file:any[]
  }
  
interface Props{
  messages:Message[];
  setNewMessage:(text:string)=>void;
  closeFile:()=>void;
  newMessage:newMessage;
  createdAt:string;
  user?:User;
  channel?:Channel
}

const Messages = ({
  messages,
  setNewMessage,
  closeFile,
  newMessage,
  createdAt,
  user,
  channel
}:Props) => {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [popupVisible, setPopupVisible] = useState(false);

 
  const longPressHandler = () => {
    setPopupVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const hidePopup = () => {
    setPopupVisible(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  return (
    <View className='flex-1'>
      <FlatList
      data={messages}
      renderItem={({ item}:any) => (
         <MessagesContainer
          item={item}
          onDelete={()=>{}}
          onLongPress={longPressHandler}
          onPress={hidePopup}
       />
      )}
      keyExtractor={(item) => item?._id}
      // ListEmptyComponent={<LoadingMessages/>}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => <Header user={user} messages={messages} created={createdAt} channel={channel}/>}
      ListFooterComponent={ 
        <View className='h-[90%]'>
          <View className='mb-[70%] ml-[50%] mt-[-50px] '>
            {newMessage.file.length>0 &&
             <ImageWithCaption
              source={newMessage.file[0]} 
              showInputs={true} 
              onCaptionChange={(text:string)=>setNewMessage(text)} 
              closeFile={closeFile} />
            }
          </View>
        </View>
      }
    />
    
    {popupVisible && <PopupComponent/>}
    </View>
  )
}

export default Messages
