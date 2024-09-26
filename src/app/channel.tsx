import React from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

import { ErrorMessage, Loader, MessageInput, MessagesContainer } from '@/components';
import useUnifiedMessaging from '@/lib/hooks/messaging';
import { Text, View } from '@/components/themed';

function Channel() {
  
    const {
    messages,
    newMessage,
    isTyping,
    isSending,
    currentChat,
    isChannel,
    handleMessageChange,
    handleSend,
    chooseFile,
    closeFile,
    isLoading,
    error
  } = useUnifiedMessaging();


  if (isLoading) return <Loader loadingText='Loading your conversation' />;
  if(error) return <ErrorMessage message='An error Occured while loading your conversation'/>
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View>
        <View className='flex-row items-center p-2.5 mt-7' >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="gray" />
          </TouchableOpacity>
          <Text className="font-rbold ml-2.5 text-xl" >
            {isChannel ? `#${currentChat?.name}` : `@${currentChat?.user?.username|| currentChat?.user?.name.toLowerCase().replace(' ', '')}`}
          </Text>
          <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
            <TouchableOpacity  style={{ marginRight: 15 }}>
              <Feather name="phone" size={24} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity >
              <Feather name="video" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

        <MessagesContainer
          isChannel={isChannel}
          currentChat={currentChat}
          messages={messages}
          setNewMessage={(text)=>handleMessageChange(text)}
        />

      {isTyping && (
        <Text style={{ padding: 5, fontStyle: 'italic' }}>
          {currentChat?.user?.name} is typing...
        </Text>
      )}

      <MessageInput
        caption={newMessage.caption}
        onMessageChange={(text) => handleMessageChange(text)}
        onSend={handleSend}
        sending={isSending}
      />
    </SafeAreaView>
  );
}
export default React.memo(Channel)