import { memo, useMemo } from 'react';
import { Image as ExpoImage } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { endpoint } from '@/lib';
import { Skeleton } from './ui/skeleton';

interface ImageProps {
  source: string;
  width: number;
  height: number;
  style?: string;
}

const fetchOptimizedImage = async (source: string, width: number, height: number) => {
  const response = await fetch(
    `${endpoint}/optimizations?url=${source}&width=${width}&height=${height}&quality=60`
  );
  const data = await response.json();
  return data.optimizedImage;
};

const Image: React.FC<ImageProps> = memo(({ source, width, height, style }) => {
  // const { data: optimizedImageUrl, isLoading } = useQuery({
  //   queryKey: ['optimizedImage', source, width, height],
  //   queryFn: () => fetchOptimizedImage(source, width, height),
  //   staleTime: Infinity,
  //   gcTime: Infinity,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  // });

  const memoizedSkeleton = useMemo(() => (
    <Skeleton

      className={style}
    />
  ), [style]);

  // if (isLoading) {
  //   return memoizedSkeleton;
  // }
// console.log(optimizedImageUrl)
  return (
    <ExpoImage
      source={{ uri: source }}
      alt='image'
      // contentFit="cover"
      className={` ${style}`}
    />
  );
});

export default Image;