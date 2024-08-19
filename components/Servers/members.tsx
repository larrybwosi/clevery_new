import { Skeleton, HStack } from 'native-base';
import { FlatList, View } from 'react-native';

import { Text } from '../Themed';
import Image from '../image';

interface MembersComponentProps {
  userImages: string[];
}

const MembersComponent: React.FC<MembersComponentProps> = ({ userImages }) => {
  const renderItem = ({ item }: { item: string }) => (
    <Image
      source={ item }
      height={30}
      width={30}
      style='w-[30px] h-[30px] rounded-[15px] border-[0.5px]'
    />
  );

  const renderSkeleton = () => (
    <HStack space={2}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} size={10} rounded="full" />
      ))}
    </HStack>
  );

  return (
    <View className='mt-5'>
      <Text className='text-xs font-rbold mb-2'>Members:</Text>
      <FlatList
        data={userImages}
        keyExtractor={(index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={renderSkeleton}
        ItemSeparatorComponent={() => <View className='w-3' />}
      />
    </View>
  );
};

export default MembersComponent;
