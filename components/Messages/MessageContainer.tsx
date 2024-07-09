import { View as SepV, Text as SepT } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import { formatDateString, multiFormatDateString } from '@/lib/utils';
import { Text, View } from '@/components/Themed';
import { urlForImage } from '@/lib';
import { Feather } from '@expo/vector-icons';

interface Message {
  _id: string;
  _createdAt: string;
  text: string;
  sender: {
    image: string;
    name: string;
  };
  timestamp: string;
  isSeparator?: boolean;
  image?: string;
  reactions?:string;
}

interface MessagesProps {
   item: Message ,
   onDelete:(key:string)=>void,
   onLongPress:(_id:string)=>void;
   onPress:()=>void
  }

const MessagesContainer = ({ item ,onDelete,onLongPress,onPress}: MessagesProps) => {
  const {_id, text, sender, _createdAt,timestamp, isSeparator, image,reactions } = item;

  const formattedTimestamp = multiFormatDateString(_createdAt);
  if (isSeparator) {
    return (
      <SepV flexDirection="row" alignItems="center" my={4}>
        <SepV flex={1} height={"0.35"} bg="gray.400" />
          <SepT mx={2} color="gray.500" fontSize="xs" className='font-rregular text-[8px]'>
          {formatDateString(timestamp)}
          </SepT>
        <SepV flex={1} height={.35} bg="gray.400" />
    </SepV>
    );
  }

  return (
    <TouchableOpacity className='flex flex-row items-start mb-[15px] px-[5px]'
    activeOpacity={1}
     onLongPress={()=>onLongPress(_id)}
    >
      <TouchableOpacity>
        <Image
          source={{ uri: urlForImage(sender?.image).width(100).url() }}
          className='rounded-2xl border border-gray-300 h-10 w-10 mr-2.5'
        />
      </TouchableOpacity>
      <View className='flex-col'>
        <View className='flex-row items-center mb-1.5'>
          <Text className='font-rmedium mr-1.5 text-light' >
            {sender.name}
            <Feather name='shield' color={"red"}/>
          </Text>
          <Text className='font-rmedium text-xs text-[#666] '>
            {formattedTimestamp}
          </Text>
        </View>
        {image && (<Image source={{ uri: urlForImage(image).width(280).height(150).url() }} className='w-[280px] h-[150px] border border-gray-300 rounded-[10px]'/>
        )}
        <Text className='text-sm mr-10 font-rregular mb-1.5'>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default MessagesContainer;