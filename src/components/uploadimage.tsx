import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '@/components/themed';

interface UploadImageProps {
  image: string;
  chooseImage: () => void;
  removeImage: () => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ image, chooseImage, removeImage }) => {

  return (
    <View className="flex items-center justify-center my-8">
      {image ? (
        <View className="relative">
          <Image
            source={{ uri: image }}
            className="w-52 h-52 rounded-[104px]"
          />
          <Pressable
            onPress={removeImage}
            className="absolute bottom-0 right-0 bg-gray-800 rounded-md p-2"
          >
            <Text className="font-medium text-xs text-white">Remove Image</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={chooseImage}
          className="w-32 h-32 rounded-[58px] border-2 border-gray-500 border-dashed flex items-center justify-center"
        >
          <Feather name="camera" size={34} color="gray" />
          <Feather
            name="plus"
            size={18}
            className="absolute top-0 right-0 bg-purple-600 p-1 rounded-full text-white"
          />
          <Text className="text-gray-500 mt-2 font-pregular">Upload</Text>
        </Pressable>
      )}
    </View>
  );
};

export default UploadImage;