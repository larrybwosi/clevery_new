import { useState, useCallback, memo } from 'react';
import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { Channel, Conversation, Message as MessageType } from '@/types';
import { Text, View } from '@/components/themed';
import Header from '../header';
import PopupComponent from './popup';
import Message from './item';

type NewMessage = {
  caption: string;
  file: string | undefined;
};

type Props = {
  conversation?: Conversation,
  messages: MessageType[]
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

const MessagesContainer: React.FC<Props> = ({
  conversation,
  messages,
  setNewMessage,
  closeFile,
  newMessage,
  createdAt,
  channel,
}) => {
  const [popupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => setPopupVisible(!popupVisible);
  const closePopup = () => setPopupVisible(false);

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
        renderItem={({ item }: { item: any }) => (
          <Message
            item={item}
            onDelete={() => {}}
            onLongPress={() => togglePopup()}
            onClose={() => togglePopup()}
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
      <PopupComponent isVisible={popupVisible} onClose={closePopup} username='Clevery' setMessage={setNewMessage} />
    </View>
  );
};

export default memo(MessagesContainer);