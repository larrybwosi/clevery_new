import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '../Themed';
import { router } from 'expo-router';
import Image from '../image';

interface ServerCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
}

const ServerCard: React.FC<ServerCardProps> = ({ id, name, description, image }) => {

    return (
    <TouchableOpacity onPress={()=>router.navigate(`/server/${id}`)} className='flex-1' >
      <View className='flex-row items-center p-4'>
        <Image
          source={ image } 
          width={80}
          height={80}
          style='h-[60px] w-[60px] rounded-[30px]' 
        />
        <View className='ml-4'>
          <Text className='text-base font-rbold'>{name}</Text>
          <Text 
          className='text-sm font-rregular text-[#666]'>{description}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#666" className='absolute right-4'/>
      </View>
    </TouchableOpacity>
  );
};

export default ServerCard;