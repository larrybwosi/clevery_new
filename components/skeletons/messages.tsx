import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Skeleton } from '../ui/skeleton';

const LoadingMessages = () => {
  return (
    <VStack className="space-y-4 px-4 py-2">
      <FlatList
        data={Array.from({ length: 10 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() =>
          <TouchableOpacity
            className="flex flex-row items-start mb-[15px] px-[5px]"
            activeOpacity={1}
          >
            <TouchableOpacity>
              <Skeleton className="w-10 h-10" />
            </TouchableOpacity>
            <VStack className="flex-1 space-y-2">
              <HStack className="items-center space-x-2">
                <Skeleton className="h-4 w-100" />
                <Skeleton className="h-3 w-50" />
              </HStack>
              <Skeleton className="h-100 w-280" />
              <Skeleton className="h-4 w-full" />
            </VStack>
          </TouchableOpacity>
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack className="space-y-4" />}
      />
    </VStack>
  );
};

export default LoadingMessages;