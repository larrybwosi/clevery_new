import { MasonryFlashList } from '@shopify/flash-list'
import { Button } from 'react-native-elements';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import {Text, View } from '@/components/Themed'
import Loader from '@/components/Loader';
import { urlForImage } from '@/lib';
import { image } from '@/types';

interface GalleryProps {
  images: string[];
  loading?:boolean
}

const Gallery: React.FC<GalleryProps> = ({ images,loading }) => {
  const renderItem = ({ item }: { item: string }) => {
    return (
      <View className='flex-1 m-[3px]'>
        <Image 
        source={{ uri:item}} 
        className='h-40 w-40 bg-cover'
      />
      </View>
    );
  };

  if(loading) return <Loader loadingText='Loading your grid'/>

  if(images?.length <1){
    return(
      <View  className='justify-center p-5 gap-[5px]' >
        <Text className='text-sm font-rmedium' >You have no images on your grid yet ,click to add and image. </Text>
        <Button title={'Add friend'} className='w-[50px] m-2.5' onPress={()=>router.push("/users")} />
      </View>
    )
  }
  return (
    <View className='flex-1'>
      <MasonryFlashList
        data={images}
        numColumns={3}
        renderItem={renderItem}
        estimatedItemSize={122}  
      />
    </View>
  );
};

export default Gallery;

