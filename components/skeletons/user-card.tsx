import { Skeleton, HStack, VStack } from 'native-base';

const UserSkeleton = () => {
  return (
    <HStack space={4} alignItems="center" px={4} py={2}>
      <Skeleton size="12" rounded="full" startColor='gray.500' endColor={'gray.800'} />
      <VStack flex={1} space={1}>
        <Skeleton.Text lines={2}  startColor='gray.500' endColor={'gray.800'}/>
        <Skeleton h="3" rounded="full" w="1/2"  startColor='gray.500' endColor={'gray.800'} />
      </VStack>
    </HStack>
  );
};

export default UserSkeleton;