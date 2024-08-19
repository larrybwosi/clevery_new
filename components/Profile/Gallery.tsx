import { useState } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { Text, View } from '@/components/Themed';
import Loader from '@/components/Loader';
import { Button, Overlay } from '@/components/ui';

interface GalleryProps {
  images: string[];
  loading?: boolean;
}

const { width } = Dimensions.get('window');
const columnWidth = width / 3 - 8; // 3 columns with 4px gap on each side

const Gallery: React.FC<GalleryProps> = ({ images, loading }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderItem = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedImage(item)}
        className="m-1 overflow-hidden rounded-lg"
        style={{ width: columnWidth, height: columnWidth * 1.5 }}
      >
        <Image
          source={{ uri: item }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={1000}
          // placeholder={require('@/assets/images/placeholder.png')}
        />
      </TouchableOpacity>
    );
  };

  if (loading) return <Loader loadingText="Creating your masterpiece..." />;

  if (images?.length < 1) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Ionicons name="images-outline" size={64} color="#888" />
        <Text className="text-lg font-medium text-center mt-4 mb-2">
          Your gallery is empty
        </Text>
        <Text className="text-sm text-center mb-6">
          Add some images to start creating your beautiful grid.
        </Text>
        <Button
          icon={<Ionicons name="add-circle-outline" size={24} color="white" />}
          buttonStyle={{
            backgroundColor: '#4CAF50',
            borderRadius: 25,
            paddingHorizontal: 20,
          }}
          titleStyle={{ marginLeft: 10 }}
          onPress={() => router.push('/add-image')}
        >Add Image</Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* <MasonryFlashList
        data={images}
        numColumns={3}
        renderItem={renderItem}
        estimatedItemSize={columnWidth * 1.5}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      /> */}
      <Overlay
        onBackdropPress={() => setSelectedImage(null)}
        overlayStyle={{ backgroundColor: 'transparent', padding: 0 }}
        fullScreen
        isOpen={!!selectedImage}
      >
        <View className="flex-1 bg-black/80">
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            className="absolute top-10 right-5 z-10"
          >
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-full"
              contentFit="contain"
              transition={300}
            />
          )}
        </View>
      </Overlay>
    </View>
  );
};

export default Gallery;