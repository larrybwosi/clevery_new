import { ActivityIndicator,TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { memo } from 'react';

import { View } from '../Themed';

interface MessageInputProps {
  caption: string;
  sending:boolean;
  onMessageChange: (text: string) => void;
  onSend: () => void;
  onChooseFile: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ caption, onMessageChange, onSend, onChooseFile,sending}) => {
  return (
    <View
     className='flex-row items-center m-1 mb-1.5 p-1.5 rounded-[10px] h-12.5 '
     >
      <TouchableOpacity
      className='text-light p-[9px] w-10 mr-[1px] rounded-[10px] h-[45px]'
       onPress={onChooseFile}
       disabled={sending}
      >
        <Feather name="paperclip" size={25} color="gray" />
      </TouchableOpacity>
      <View className='flex-1 flex-row border items-center rounded-[10px] p-[7px]'>
        <TextInput
          className='text-white text-base text-2.5 flex-1'
          placeholder="Message"
          value={caption}
          onChangeText={onMessageChange}
        />
        <TouchableOpacity
         className='bg-light p-[9px] h-[30px] rounded-[10px] ml-[5px] mr-2.5'
         onPress={onSend}
         disabled={sending}
        >
          {sending?
            <ActivityIndicator size={15} color="white"/>
            :<FontAwesome name="send" size={12} color="white" />
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(MessageInput);