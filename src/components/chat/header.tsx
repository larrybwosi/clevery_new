import Feather from '@expo/vector-icons/Feather'
import React from 'react'

import { Text, View } from '@/components/themed'
import { formatDateString } from '@/lib' 
import { Pressable } from 'react-native'
import { Image } from 'expo-image'

interface Props {
  name: string
  description?: string
  created: string
  isChannel?: boolean
  image?: string
}

const Header = ({ name, description, created, isChannel, image }: Props) => {

  if (isChannel) {

    return (
      <View className='flex-1 p-5'>
        <View className={`flex flex-1 h-[100%]`} />
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
            Welcome to #{name}
          </Text>
          <Text className='font-rregular text-[12px] ' >
            {description}
          </Text>
          <Text className='font-rregular text-base mt-4 text-gray-400 ' >
            This is the begining of the #{name}
          </Text>
        </View>
      </View>
    )
  }
  return (
    <View className='flex-1 p-5'>
      <Pressable
        className='flex-row items-center h-[90px] rounded-[50px] '
      >
        {image &&
          <Image
            source={image}
            style={{width: 60, height: 60, borderRadius: 30}}
          />
        }
      </Pressable>

      <Text className='font-rbold text-xl' >
        {name}
      </Text>

      <Text className='font-pregular text-sm mt-1.5' >
        This is the beginning of your conversation with {name}
      </Text>

      <Text className='font-rmedium mt-1.5 font-[13px]'>
        Friends since: {created && formatDateString(created)}
      </Text>

      {/* {!messages?.length && (
        <View className='h-[80%] mt-[30%] mb-[70%] flex-1 '>
          <Text className='font-rthin text-sm mb-1.5 mt-1.5'>
            No Messages yet, send a message to start a conversation with {user?.username}
          </Text>
        </View>
      )} */}
    </View>
  )
}
export default React.memo(Header)