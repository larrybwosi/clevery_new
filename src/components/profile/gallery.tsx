import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { MasonryFlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GalleryImage {
  id: string;
  uri: string;
  width: number;
  height: number;
}

interface GalleryProps {
  images: GalleryImage[];
  onAddImages: () => void;
}

const GalleryPage: React.FC<GalleryProps> = ({ images, onAddImages }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 20, stiffness: 90 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const renderItem = ({ item }: { item: GalleryImage }) => {
    const imageWidth = SCREEN_WIDTH / 2 - 12; // 2 columns with 8px gap
    const aspectRatio = item.width / item.height;
    const imageHeight = imageWidth / aspectRatio;

    return (
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(500)}
        style={[styles.imageContainer, { height: imageHeight }]}
      >
        <Image
          source={{ uri: item.uri }}
          style={[styles.image, { aspectRatio }]}
          contentFit="cover"
        />
      </Animated.View>
    );
  };

  const EmptyGallery = () => (
    <View style={styles.emptyContainer}>
      <Feather name="image" size={64} color="#a3a3a3" />
      <Text style={styles.emptyTitle}>Your gallery is empty</Text>
      <Text style={styles.emptyDescription}>
        Add some amazing photos to showcase your life and experiences!
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddImages}>
        <Feather name="plus" size={24} color="#ffffff" />
        <Text style={styles.addButtonText}>Add Images</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {images.length > 0 ? (
        <MasonryFlashList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.masonry}
          estimatedItemSize={200}
        />
      ) : (
        <EmptyGallery />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  masonry: {
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  imageContainer: {
    padding: 4,
  },
  image: {
    width: '100%',
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontFamily: 'rbold',
    fontSize: 24,
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'rregular',
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  addButtonText: {
    fontFamily: 'rmedium',
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 8,
  },
});

export default GalleryPage;