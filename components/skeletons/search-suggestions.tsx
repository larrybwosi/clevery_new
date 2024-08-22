import { FlatList } from 'react-native';
import UserSkeleton from './user-card';
import { VStack } from '../ui/vstack';

const SearchSuggestions = () => {
  return (
    <VStack className="space-y-4 px-4 py-2">
      <FlatList
        data={Array.from({ length: 3 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <UserSkeleton />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack className="space-y-4" />}
      />
    </VStack>
  );
};

export default SearchSuggestions;