import { endpoint } from '@/lib';
import { Image as ExpoImage } from 'expo-image';
import { Skeleton } from 'native-base';
import { useMemo, useState } from 'react';

interface ImageProps {
  source: string;
  width: number;
  height: number;
  style?: string;
}

export default function Image({ source, width, height, style }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [url, setUrl] = useState('');

  const imageUrl = useMemo(async () => {
    setIsLoaded(false)
    const response = await fetch(
      `${endpoint}/optimizations?url=${source}&width=${width}&height=${height}`
    )
    const res= await response.json().then((res) => res.optimizedImage);
    setUrl(res)
    setIsLoaded(true)
    return res;
  }, [source, width, height]);

  return (
    <>
      {isLoaded ? (
        <ExpoImage
          source={{ uri: url }}
          contentFit="cover"
          className={style }
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <Skeleton size="16" rounded="full" h={'12'} w={'12'} startColor='gray.500' endColor={'gray.800'} borderRadius="full" className={style} />

      )}
    </>
  );
}
