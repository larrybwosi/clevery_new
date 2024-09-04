import { TouchableOpacity, FlatList, FlatListProps, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/components/themed';
import { SvgFromXml } from 'react-native-svg';
import { Image } from 'expo-image';
import { createSvg } from '@/assets/images/svgs';

interface SelectedImagesProps {
  images: string[];
  onDeleteImage: (index: number) => void;
  handleSelectImages: () => void;
}

const SelectedImages: React.FC<SelectedImagesProps> = ({ images, onDeleteImage, handleSelectImages }) => {
  const renderItem: FlatListProps<string>['renderItem'] = ({ item, index }) => {
    return (
      <View style={{ marginRight: 10 }}>
        <Image source={{ uri: item }} style={{ width: 100, height: 100, borderRadius: 8 }} />
        <TouchableOpacity
          style={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 15, padding: 5, }}
          onPress={() => onDeleteImage(index)}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  if (images.length === 0) {

    return (
      <Pressable
        className='flex-1 items-center justify-center border rounded-lg p-[20%] h-16'
        onPress={handleSelectImages}
      >
        <SvgFromXml xml={createSvg} />

        <Text
          className='mt-1.5 font-pregular text-base text-[#555]'
        >
          Select images
        </Text>
      </Pressable>
    );
  }


  if (images.length === 1) {
    return (
      <View>
        <Image source={{ uri: images[0] }} style={{ width: '100%', height: 200 }} />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: 15,
            padding: 5,
          }}
          onPress={() => onDeleteImage(0)}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={images}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
};

export default SelectedImages;
