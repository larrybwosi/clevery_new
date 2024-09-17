import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Text, View } from '../themed'
import { HStack } from '../ui/hstack'

const DmHeader = ( name: string ) => {
  return (
    <HStack className='rounded-[5px] z-30 pb-2 border-b-[.5px]' space='lg'>
      <Ionicons name="arrow-back" size={24} color="#007aff"
        onPress={() => router.back()} className='absolute left-[15px] mr-2.5 z-30 mb-2.5 rounded-[5px]' />
      <Text className='ml- mt-[5px] text-lg font-pbold'>
        #{name}
      </Text>
    </HStack>
  )
}

export default DmHeader
