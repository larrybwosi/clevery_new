import React, { useState, useMemo } from 'react';
import { FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Text, View } from '../Themed';

interface ImageComponentProps {
  image: string;
  width: string;
  height: string;
  onLoad?: () => void;
}
const ImageComponent = ({ image, width, height, onLoad }:ImageComponentProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = useMemo(() => 
    image, 
    [image, imageLoaded, width]
  );

  return (
    <Image
      source={{ uri: imageUrl }}
      className={`m-[3px] rounded-[5px] ${height} ${width}`}
      onLoad={() => {
        setImageLoaded(true);
        onLoad?.();
      }}
    />
  );
};

const ImageCont = ({ images, caption }: { images: string[]; caption: string }) => {
  if (!images?.length) {
    return <Text className="font-pregular text-sm my-2">{caption}</Text>;
  }

  return (
    <View className="flex-1 flex-col justify-center p-1 items-center">
      <Text className="font-pregular text-sm mb-auto w-full">{caption}</Text>
      {images.length === 1 ? (
        <ImageComponent image={images[0]} width="w-[350px]" height="h-[230px]" />
      ) : (
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ImageComponent image={item} width="w-40" height="h-[230px]" />
          )}
        />
      )}
    </View>
  );
};

export default ImageCont;