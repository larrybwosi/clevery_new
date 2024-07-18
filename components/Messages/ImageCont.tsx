import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity,TextInput } from 'react-native';
import { Image } from 'expo-image';

import { Text, View } from '@/components/Themed';

interface ImageWithCaptionProps {
  source: string;
  onCaptionChange: (caption: string) => void;
  closeFile: () => void;
  showInputs: boolean;
}

const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({
  source,
  onCaptionChange,
  closeFile,
  showInputs,
}) => {

  const handleCaptionChange = (text: string) => {
    onCaptionChange(text);
  };

  const handleClose = () => {
    closeFile();
  };

  const isImage =
    source?.endsWith('.jpg') ||
    source?.endsWith('.jpeg') ||
    source?.endsWith('.png') ||
    source?.endsWith('.gif');

  const renderPreview = () => {
    if (isImage) {
      return <Image source={{ uri: source }} className='w-[230] h-[200]' />;
    } else {
      return (
        <TouchableOpacity>
          <View className='w-[230px] h-12.5 mb-2.5' >
            <Ionicons name="document" size={24} color="black" />
            <Text>File name: {source}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View className='flex-1 items-center justify-center mr-15.5 mb-5 mt-[-25px]'>
      <View className='border-b border-[#ccc] rounded-[10px] overflow-hidden resize'>
        <TouchableOpacity onPress={handleClose} className='absolute  top-[2px] left-[190px] z-20 right-0 rounded-[10px] mr-2.5'>
          <Ionicons name="close" size={24} color="#007aff" />
        </TouchableOpacity>
        {renderPreview()}
        {showInputs && (
          <View className='bg-white p-2.5 '>
            <TextInput
              className='text-base'
              placeholder="Add a caption"
              onChangeText={handleCaptionChange}
            />
          </View> 
        )}
      </View>
    </View>
  );
};

export default ImageWithCaption;