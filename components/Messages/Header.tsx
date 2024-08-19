import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { memo } from 'react'

import { Text, View } from '@/components/Themed'
import { formatDateString } from '@/lib'
import Image from '@/components/image'

const Header = ({user,messages,created,channel}:any) => {

  if(channel&&!user) {
    
    return(
      <>
      <View className={`flex flex-1 h-[100%] mb-${!!messages?.length?'auto':'[100%]'}`}/>
        <View className={`flex-1 p-2.5 mb-5 w-full`} >
          <View
            className='w-[60px] h-[60px] rounded-[20px] pt-2.5 border-[.5px] flex items-center border-gray-500 bg-zinc-700'
          >
            <Feather  
              name='hash'
              size={40}
              color="gray"
            />
          </View>
        <Text className='font-rbold text-[30px]'>
          Welcome to #{channel.name}
        </Text>
        <Text className='font-rregular text-[12px] ' >
          {channel.description}
        </Text>
        <Text className='font-rregular text-base mt-4 text-gray-400 ' >
          This is the begining of the #{channel.name}
        </Text>
      </View>
      </>
   )
  }
  return (
    <View >
      <TouchableOpacity 
        className='flex-row items-center h-[90px] rounded-[50px] '
      >
        {user?.image && 
          <Image
            source={user?.image} 
            width={100}
            height={100}
            style='w-[60px] h-[60px] rounded-[20px]'
          />
        }
      </TouchableOpacity>

      <Text className='font-rbold text-xl' >
        {user?.name || user?.username}
      </Text>

      <Text className='font-plight text-xs text-gray-700'>
        { user?.username|| user?.name}
      </Text>

      <Text className='font-pregular text-sm mt-1.5' >
        This is the beginning of your conversation with {user?.username || user?.name}
      </Text>

      <Text className='font-rmedium mt-1.5 font-[13px]'>
        Friends since: {created && formatDateString(created)}
      </Text>

      {! messages?.length && (
        <View className='h-[80%] mt-[30%] mb-[70%] flex-1 '>
          <Text className='font-rthin text-sm mb-1.5 mt-1.5'>
            No Messages yet, send a message to start a conversation with {user?.username}
          </Text>
        </View>
      )}
    </View>
  )
}
export default memo(Header)