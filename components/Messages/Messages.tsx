import { useRef, useState, useCallback, memo } from 'react';
import { Animated, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import { Channel, Conversation, Message } from '@/types';
import MessagesContainer from './MessageContainer';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import PopupComponent from './Popup';
import Header from './Header';

type NewMessage = {
  caption: string;
  file: string | undefined;
};

type Props = {
  conversation?:Conversation,
  messages:Message[]
  setNewMessage: (text: string) => void;
  closeFile: () => void;
  newMessage: NewMessage;
  createdAt: string;
  channel?: Channel;
};

type ImageWithCaptionProps = {
  source: string;
  onCaptionChange: (caption: string) => void;
  closeFile: () => void;
  showInputs: boolean;
};

const Messages: React.FC<Props> = ({
  conversation,
  messages,
  setNewMessage,
  closeFile,
  newMessage,
  createdAt,
  channel,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [popupVisible, setPopupVisible] = useState(false);

  const togglePopup = useCallback((show: boolean) => {
    setPopupVisible(show);
    Animated.timing(fadeAnim, {
      toValue: show ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const ImageWithCaption: React.FC<ImageWithCaptionProps> = useCallback(({
    source,
    onCaptionChange,
    closeFile,
    showInputs,
  }) => {
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(source);
    
    return (
      <View className="flex-1 items-center justify-center -mt-6 mb-5 mr-4">
        <View className="border-b border-gray-300 rounded-lg overflow-hidden">
          <TouchableOpacity onPress={closeFile} className="absolute top-2 right-2 z-10">
            <Ionicons name="close" size={24} color="#007aff" />
          </TouchableOpacity>
          {isImage ? (
            <Image source={{ uri: source }} className="w-56 h-52" />
          ) : (
            <View className="w-56 h-12 mb-2 flex-row items-center">
              <Ionicons name="document" size={24} color="black" />
              <Text className="ml-2 truncate">{source}</Text>
            </View>
          )}
          {showInputs && (
            <TextInput
              className="bg-white p-2 text-base"
              placeholder="Add a caption"
              onChangeText={onCaptionChange}
            />
          )}
        </View>
      </View>
    );
  }, []);

  return (
    <View className="flex-1">
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessagesContainer
            item={item}
            onDelete={() => {}}
            onLongPress={() => togglePopup(true)}
            onPress={() => togglePopup(false)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <Header user={conversation?.user} messages={messages} created={createdAt} channel={channel} />}
        ListFooterComponent={() => (
          <View className="h-3/4">
            <View className="ml-1/2 -mt-12">
              {newMessage?.file && (
                <ImageWithCaption
                  source={newMessage?.file!}
                  showInputs={true}
                  onCaptionChange={setNewMessage}
                  closeFile={closeFile}
                />
              )}
            </View>
          </View>
        )}
      />
      
      {/* <Animated.View style={{ opacity: fadeAnim }}> */}
        {popupVisible && <PopupComponent />}
      {/* </Animated.View> */}
    </View>
  );
};

export default memo(Messages);