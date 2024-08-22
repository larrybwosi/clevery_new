import { TouchableOpacity, Linking, BackHandler } from 'react-native';
import { View as SepV, Text as SepT } from '@/components';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { formatDateString, multiFormatDateString } from '@/lib/utils';
import { Text, View } from '@/components/Themed';
import * as WebBrowser from 'expo-web-browser';
import Image from '../image';
import FullScreenImage from '../full-screen-image';
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  createdAt: string;
  text: string;
  timestamp: string;
  sender: {
    image: string;
    name: string;
    isAdmin?: boolean;
  };
  isSeparator?: boolean;
  file?: string;
  reactions?: string;
}

interface MessagesProps {
  item: Message;
  onDelete: (key: string) => void;
  onLongPress: (id: string) => void;
}

const MessagesContainer: React.FC<MessagesProps> = ({ item, onDelete, onLongPress }) => {
  const { id, text, sender, createdAt, isSeparator, file, reactions } = item;
  const [isFullScreenImageOpen, setIsFullScreenImageOpen] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullScreenImageOpen) {
        setIsFullScreenImageOpen(false);
        return true; // Prevent the default back button behavior
      }
      return false; // Allow the default back button behavior
    });

    return () => backHandler.remove();
  }, [isFullScreenImageOpen]);

  const handleImagePress = () => {
    setIsFullScreenImageOpen(true);
  };

  const handleCloseFullScreenImage = () => {
    setIsFullScreenImageOpen(false);
  };

  if (isSeparator) {
    return <MessageSeparator timestamp={item?.timestamp} />;
  }

  const formattedTimestamp = multiFormatDateString(createdAt);

  return (
    <TouchableOpacity
      className="flex flex-row items-start mb-[15px] px-[5px]"
      activeOpacity={1}
      onLongPress={() => onLongPress(id)}
    >
      <TouchableOpacity>
        <Image
          source={sender?.image}
          width={80}
          height={80}
          style="rounded-2xl border border-gray-300 h-10 w-10 mr-2.5"
        />
      </TouchableOpacity>
      <View className="flex-1">
        <View className="flex-row items-center mb-1.5">
          <Text className="font-rmedium mr-1.5 text-light">
            {sender.name}
            {sender.isAdmin && <Feather name="shield" color="red" size={12} className="ml-1" />}
          </Text>
          <Text className="font-rmedium text-xs text-[#666]">{formattedTimestamp}</Text>
        </View>
        <FileAttachment file={file} onImagePress={handleImagePress} />
        <MessageText text={text} />
        {reactions && (
          <View className="flex-row mt-1">
            {/* Implement reactions here */}
          </View>
        )}
      </View>
      {file && (
        <FullScreenImage
          isOpen={isFullScreenImageOpen}
          onClose={handleCloseFullScreenImage}
          imageUri={file}
        />
      )}
    </TouchableOpacity>
  );
};

const FileAttachment = ({ file, onImagePress }: { file: Message['file']; onImagePress: () => void }) => {
  if (!file) return null;

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file);
  const isPDF = !isImage;

  return (
    <>
      {isPDF ? (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(file)}
          className="mb-2"
          activeOpacity={1}
        >
          <View className="flex-row items-center bg-gray-100 p-2 rounded-lg">
            <FontAwesome5 name="file-pdf" size={50} color="red" />
            <Text className="ml-2 font-rmedium">View PDF</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onImagePress} className="mb-2" activeOpacity={1}>
          <Image source={file} width={270} height={288} style="w-full h-60 border border-gray-300 rounded-[10px] shadow-lg" />
        </TouchableOpacity>
      )}
    </>
  );
};

const MessageSeparator = ({ timestamp }: { timestamp: string }) => (
  <SepV className='flex-row items-center my-3' >
    <SepV className='flex-1 h-[0.35px] bg-gray-400' />
    <SepT className="font-rregular mx-2 text-[8px]">
      {formatDateString(timestamp)}
    </SepT>
    <SepV className='flex-1 h-[0.35px] bg-gray-400' />
  </SepV>
);

const MessageText = ({ text }: { text: string }) => {
  const parts = text.split(/(@\w+|\bhttps?:\/\/\S+\b)/gi);

  return (
    <Text className="text-sm mr-10 font-rregular mb-1.5">
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          return <Text key={index} className="text-blue-500 font-rmedium">{part}</Text>;
        } else if (part.startsWith('http')) {
          return (
            <Text key={index} className="text-blue-500 underline" onPress={() => Linking.openURL(part)}>
              {part}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
};

export default MessagesContainer;