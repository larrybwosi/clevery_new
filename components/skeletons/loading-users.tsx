
import { FlatList } from 'react-native';
import UserSkeleton from './user-card';
import { VStack } from '../ui/vstack';

const LoadingUsers = () => {
  return (
    <VStack className="space-y-4 px-1 py-1">
      <FlatList
        data={Array.from({ length: 10 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <UserSkeleton />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack className="h-1" />}
      />
    </VStack>
  );
};

export default LoadingUsers;