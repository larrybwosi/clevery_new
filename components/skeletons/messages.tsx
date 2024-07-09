import { FlatList } from 'react-native';
import { Box, Flex, HStack, Skeleton, VStack } from 'native-base'; 
import { TouchableOpacity } from 'react-native';

const LoadingMessages = () => {
  return (
    <VStack space={4} px={4} py={2}>
      <FlatList
        data={Array.from({ length: 10 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() =>
          <TouchableOpacity
            className="flex flex-row items-start mb-[15px] px-[5px]"
            activeOpacity={1} 
          >
            <TouchableOpacity>
              <Skeleton.Circle size="40" />
            </TouchableOpacity>
            <VStack space={2} flex={1}>
              <HStack alignItems="center" space={2}>
                <Skeleton h="4" w="100" />
                <Skeleton h="3" w="50" />
              </HStack>
              <Skeleton h="100" w="280" />
              <Skeleton h="4" w="full" />
            </VStack>
          </TouchableOpacity>
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack space={4} />}
      />
    </VStack>
  );
};

export default LoadingMessages;