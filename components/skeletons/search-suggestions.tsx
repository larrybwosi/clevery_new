import { FlatList } from 'react-native';
import { VStack } from 'native-base';
import UserSkeleton from './user-card';

const SearchSuggestions = () => {
  return (
    <VStack space={4} px={4} py={2}>
      <FlatList
        data={Array.from({ length: 3 }, (_, index) => index)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <UserSkeleton />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <VStack space={4} />}
      />
    </VStack>
  );
};

export default SearchSuggestions;