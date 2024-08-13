import { View } from 'react-native'
import { memo } from 'react' 
import { Ionicons } from '@expo/vector-icons';
import { useProfileStore } from '@/lib';
import { Image } from 'expo-image';

 
const ProfImage = () => {
  const { profile } = useProfileStore();
    const userImage = profile?.image? profile?.image:''

    if(profile?.image==''){
        return<Ionicons name="person"size={20} color="grey"/>
    }
    
  return (
    <View>
    <Image source={{ uri:userImage }}
      className='h-[30px] w-[30px] rounded-[15px] border-[0.5px] border-gray-400'
    />
    </View>
  )
}

export default memo(ProfImage)