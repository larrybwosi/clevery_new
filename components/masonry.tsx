import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { View, Dimensions, LayoutChangeEvent } from 'react-native';

interface ImageItem {
  uri: string;
  width: number;
  height: number;
}

interface ImageLayout extends ImageItem {
  x: number;
  y: number;
}

interface MasonryLayoutProps {
  images: ImageItem[];
  columns?: number;
  spacing?: number;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ images, columns = 2, spacing = 5 }) => {
  const [containerWidth, setContainerWidth] = useState<number>(Dimensions.get('window').width);
  const [imageLayouts, setImageLayouts] = useState<ImageLayout[]>([]);

  useEffect(() => {
    const columnWidth = (containerWidth - spacing * (columns + 1)) / columns;
    const newImageLayouts: ImageLayout[] = [];
    const columnHeights = new Array(columns).fill(0);

    images.forEach((image) => {
      const aspectRatio = image.width / image.height;
      const height = columnWidth / aspectRatio;
      
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      const x = spacing + (columnWidth + spacing) * shortestColumnIndex;
      const y = columnHeights[shortestColumnIndex] + spacing;

      newImageLayouts.push({ ...image, x, y, width: columnWidth, height });
      columnHeights[shortestColumnIndex] += height + spacing;
    });

    setImageLayouts(newImageLayouts);
  }, [images, columns, spacing, containerWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={{ flex: 1, position: 'relative' }} onLayout={handleLayout}>
      {imageLayouts.map((layout, index) => (
        <Image
          key={index}
          source={{ uri: layout.uri }}
          style={{
            position: 'absolute',
            left: layout.x,
            top: layout.y,
            width: layout.width,
            height: layout.height,
          }}
        />
      ))}
    </View>
  );
};


export default MasonryLayout;