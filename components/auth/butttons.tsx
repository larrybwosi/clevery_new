import { TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Image } from 'expo-image';
import { View } from '../Themed';


type AuthProviders = "google" | "facebook" | "github";
const Butttons = ({signInWithProvider}:{signInWithProvider:(provider:AuthProviders)=>void}) => {
  return (
    <View className='flex-row justify-around mt-3 w-full mb-4 bg-primary'>
        <TouchableOpacity className='p-2.5 rounded border border-gray-600 w-[30%] items-center' onPress={()=>signInWithProvider('google')} >
          <Image source={require('@/assets/images/google.png')} className='w-6 h-6' />
        </TouchableOpacity>
        <TouchableOpacity className='p-2.5 rounded border border-gray-600 w-[30%] items-center' onPress={()=>signInWithProvider('facebook')} >
          <Image source={require('@/assets/images/facebook.png')} className='w-6 h-6' />
        </TouchableOpacity>
        <TouchableOpacity className='p-2.5 rounded border border-gray-600 w-[30%] items-center' onPress={()=>signInWithProvider('github')} >
          <FontAwesome name="github" size={24} color="white" className='w-6 h-6' />
        </TouchableOpacity>
      </View>
  )
}

export default Butttons