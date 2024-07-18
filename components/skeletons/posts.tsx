import { FlatList, View } from 'react-native';
import { VStack, Skeleton, HStack } from 'native-base';

const PostsSkeleton = () => {
  return (
    <VStack space={4} px={4} py={2}>
      <FlatList
        data={Array.from({ length: 5 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => (
          <HStack space={4} color={"gray.300"} marginBottom={"10"}>

            <Skeleton size="16" rounded="full"  startColor='gray.500' endColor={'gray.800'} borderRadius="full" />

            <VStack flex={1} space={2} >
              <Skeleton h="4" rounded="full" w="1/2" startColor='gray.400' endColor={'gray.500'} />
              <Skeleton h="4" rounded="full" w="3/4" startColor='gray.500' endColor={'gray.800'} />
              <HStack marginRight="12" marginLeft="-7" marginTop="5" >
                <Skeleton rounded="md" h="170" marginRight={"1"} marginLeft="1" borderRadius="lg" w="280" startColor='gray.400' endColor={'gray.500'} />
              </HStack>
              <Skeleton h="1" rounded="full" w="1/2" marginLeft="-7" startColor='gray.500' endColor={'gray.800'} />
            </VStack>
          </HStack>
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack space={4} />}
      />
    </VStack>
  );
};

export default PostsSkeleton;
