import { memo } from 'react';
import { Text, View } from '../themed';
import Image from '../image';

const UserInfo = ({ profile: { name, image, username } }: any) => {

  return (
    <View
      className='flex flex-row items-center gap-3 px-5 mt-1 '
    >
      <Image
        source={ image ? image : "https://via.placeholder.com/150" }
        height={80}
        width={80}
        style='h-[70px] w-[70px] rounded-[35px] gap-1.5 border-gray-600 '
      />
      <View className='flex-col flex'>
        <Text className='font-rbold text-xl' >
          {name}
        </Text>
        <Text className='font-rregular text-xs' >@{username || name}</Text>
      </View>
    </View>
  );
};

export default memo(UserInfo);