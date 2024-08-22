import { FlatList, View } from 'react-native';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Skeleton } from '../ui/skeleton';

const PostsSkeleton = () => {
  return (
    <VStack className="space-y-4 px-1 py-1">
      <FlatList
        data={Array.from({ length: 5 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => (
          <HStack className="space-x-4 text-gray-300 mb-10">
            <Skeleton className="w-16 h-16 rounded-full bg-gray-500 from-gray-500 to-gray-800" />
            <VStack className="flex-1 space-y-2">
              <Skeleton className="h-4 rounded-full w-1/2 bg-gray-400 from-gray-400 to-gray-500" />
              <Skeleton className="h-4 rounded-full w-3/4 bg-gray-500 from-gray-500 to-gray-800" />
              <HStack className="mr-12 ml-7 mt-5">
                <Skeleton className="rounded-md h-[170px] mr-1 ml-1 rounded-lg w-[280px] bg-gray-400 from-gray-400 to-gray-500" />
              </HStack>
              <Skeleton className="h-1 rounded-full w-1/2 ml-7 bg-gray-500 from-gray-500 to-gray-800" />
            </VStack>
          </HStack>
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack className="space-y-4" />}
      />
    </VStack>
  );
};

export default PostsSkeleton;