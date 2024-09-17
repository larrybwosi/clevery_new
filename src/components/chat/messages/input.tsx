import React from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, TextInput } from 'react-native';
import  Feather  from '@expo/vector-icons/Feather';
import  FontAwesome  from '@expo/vector-icons/FontAwesome';
import { View } from '@/components/themed';
import { useDocumentUploader, useImageUploader } from '@/lib/uploadthing';
import { Ionicons } from '@expo/vector-icons';

interface MessageInputProps {
  caption: string;
  sending: boolean;
  onMessageChange: (text: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ caption, onMessageChange, onSend, sending }) => {
  const [file, setFile] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    if (file) {
      onSend();
    }
  };

  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });
  const handleAttachmentPress = async (type: 'image' | 'document') => {
    if (type === 'image') {
      const file = await openImagePicker({
      source: "library", // or "camera"
      onInsufficientPermissions: () => {
        Alert.alert(
          "No Permissions",
          "You need to grant permission to your Photos to use this",
          [
            { text: "Dismiss" },
            { text: "Open Settings", onPress: async()=> await Linking.openSettings() },
          ],
        );
      },
    });
     setFile(file[0]?.serverData?.url)
    } else {
      
    }
  };
  return (
    <>
      <View className='flex-row items-center m-1 mb-1.5  rounded-[10px] h-12.5'>
        <Pressable
          className='text-light p-[9px] w-10 mr-[1px] rounded-[10px] h-[45px]'
          onPress={()=>handleAttachmentPress('image')}
          disabled={sending || isUploading}
        >
          <Ionicons name="attach" size={25} color="gray" />
        </Pressable>
        <View className='flex-1 flex-row border items-center rounded-[10px] p-[7px]'>
          <TextInput
            className='text-sm text-2.5 flex-1 font-rregular'
            placeholder="Message"
            value={caption}
            onChangeText={onMessageChange}
          />
          <Pressable
            className='p-[4px] h-[30px] rounded-[10px] mr-2 z-30'
          >
            <Feather name="smile" size={24} color="gray" />
          </Pressable>
          <Pressable
            className='bg-light p-[9px] h-[30px] rounded-[10px] ml-[5px] mr-2.5'
            onPress={onSend}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator size={15} color="white" />
            ) : (
              <FontAwesome name="send" size={12} color="white" />
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default React.memo(MessageInput);