import { Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '../Themed';

interface ServerCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  onPress: () => void;
}

const ServerCard: React.FC<ServerCardProps> = ({ id, name, description, image, onPress }) => {

    return (
    <TouchableOpacity onPress={onPress} className='flex-1' >
      <View className='flex-row items-center p-4'>
        <Image 
        source={{ uri: image }} 
        className='h-16 w-16 rounded-[32px]' />
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