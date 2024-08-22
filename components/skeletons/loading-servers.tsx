import { FlatList } from 'react-native';
import { HStack } from '../ui/hstack';
import { Skeleton } from '../ui/skeleton';
import { VStack } from '../ui/vstack';

const ServerCardSkeleton = () => {
  return (
    <HStack className="space-x-4 items-center p-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <VStack className="flex-1 space-y-2">
        <Skeleton className="h-4 rounded-full w-1/2 bg-teal-500" />
        <Skeleton className="h-4 rounded-full w-3/4" />
      </VStack>
      <Skeleton className="w-6 h-6 rounded-full" />
    </HStack>
  );
};

const LoadingServers = () => {
  return (
    <VStack className="space-y-4 px-4 py-2">
      <FlatList
        data={Array.from({ length: 10 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <ServerCardSkeleton />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack className="space-y-4" />}
      />
    </VStack>
  );
};

export default LoadingServers;