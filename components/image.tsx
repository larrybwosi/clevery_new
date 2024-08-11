import React, { useMemo } from 'react';
import { endpoint } from '@/lib';
import { Image as ExpoImage } from 'expo-image';
import { Skeleton } from 'native-base';
import { useQuery } from '@tanstack/react-query';

interface ImageProps {
  source: string;
  width: number;
  height: number;
  style?: string;
}

const fetchOptimizedImage = async (source: string, width: number, height: number) => {
  const response = await fetch(
    `${endpoint}/optimizations?url=${source}&width=${width}&height=${height}`
  );
  const data = await response.json();
  return data.optimizedImage;
};

const Image: React.FC<ImageProps> = React.memo(({ source, width, height, style }) => {
  const { data: optimizedImageUrl, isLoading } = useQuery({
    queryKey: ['optimizedImage', source, width, height],
    queryFn: () => fetchOptimizedImage(source, width, height),
    staleTime: Infinity, // Cache the result indefinitely
  });

  const memoizedSkeleton = useMemo(() => (
    <Skeleton 
      size="16" 
      // rounded="full" 
      h={'12'} 
      w={'12'} 
      startColor='gray.500' 
      endColor={'gray.800'} 
      borderRadius="full" 
      className={style} 
    />
  ), [style]);

  if (isLoading) {
    return memoizedSkeleton;
  }

  return (
    <ExpoImage
      source={{ uri: optimizedImageUrl }}
      contentFit="cover"
      className={style}
    />
  );
});

export default Image;