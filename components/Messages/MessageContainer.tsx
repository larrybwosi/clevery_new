import { TouchableOpacity, Linking } from 'react-native';
import { View as SepV, Text as SepT } from '@/components';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import { formatDateString, multiFormatDateString } from '@/lib/utils';
import { Text, View } from '@/components/Themed';
import * as WebBrowser from 'expo-web-browser';
import Image from '../image';
import FullScreenImage from '../full-screen-image';

interface Message {
  id: string;
  createdAt: string;
  text: string;
  timestamp:string;
  sender: {
    image: string;
    name: string;
    isAdmin?: boolean;
  };
  isSeparator?: boolean;
  file?: string
  reactions?: string;
}

interface MessagesProps {
  item: Message;
  onDelete: (key: string) => void;
  onLongPress: (id: string) => void;
  onPress: () => void;
}

const MessageSeparator = ({ timestamp }: { timestamp: string }) => (
  <SepV flexDirection="row" alignItems="center" my={4}>
    <SepV flex={1} height={0.35} bg="gray.400" />
    <SepT mx={2} color="gray.500" fontSize="xs" className="font-rregular text-[8px]">
      {formatDateString(timestamp)}
    </SepT>
    <SepV flex={1} height={0.35} bg="gray.400" />
  </SepV>
);

const FileAttachment = ({ file }: { file: Message['file'] }) => {
  if (!file) return null;

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file);
  const isPDF = !isImage

  return (
    <TouchableOpacity 
      onPress={() => WebBrowser.openBrowserAsync(file)}
      className="mb-2"
      activeOpacity={1}
    >
      {isPDF ? (
        <View className="flex-row items-center bg-gray-100 p-2 rounded-lg  ">
          <FontAwesome5 name="file-pdf" size={50} color="red" />
          <Text className="ml-2 font-rmedium">View PDF</Text>
        </View>
      ) : (
        <Image 
          source={file} 
          width={270}
          height={288}
          style="w-full h-60 border border-gray-300 rounded-[10px] shadow-lg"
        />
      )}
    </TouchableOpacity>
  );
};

const MessageText = ({ text }: { text: string }) => {
  const parts = text.split(/(@\w+|\bhttps?:\/\/\S+\b)/gi);

  return (
    <Text className="text-sm mr-10 font-rregular mb-1.5">
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          return <Text key={index} className="text-blue-500 font-rmedium">{part}</Text>;
        } else if (part.startsWith('http')) {
          return (
            <Text
              key={index}
              className="text-blue-500 underline"
              onPress={() => Linking.openURL(part)}
            >
              {part}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
};

const MessagesContainer: React.FC<MessagesProps> = ({ item, onDelete, onLongPress, onPress }) => {
  const { id, text, sender, createdAt, isSeparator, file, reactions } = item;
  if (isSeparator) {
    return <MessageSeparator timestamp={item?.timestamp} />;
  }

  const formattedTimestamp = multiFormatDateString(createdAt);

  return (
    <TouchableOpacity 
      className="flex flex-row items-start mb-[15px] px-[5px]"
      activeOpacity={1}
      onLongPress={() => onLongPress(id)}
      onPress={onPress}
    >
      <TouchableOpacity>
        <Image
          source={ sender?.image}
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
          <Text className="font-rmedium text-xs text-[#666]">
            {formattedTimestamp}
          </Text>
        </View>
        <FileAttachment file={file} />
        <MessageText text={text} />
        {reactions && (
          <View className="flex-row mt-1">
            {/* Implement reactions here */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MessagesContainer;