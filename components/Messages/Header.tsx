import { TouchableOpacity } from 'react-native'
import { format, parseISO } from 'date-fns'
import { Text, View } from '@/components/Themed'
import { urlForImage } from '@/lib'
import ChannelHeader from '@/components/Servers/ChannelHeader'
import { Image } from 'expo-image'
import { memo } from 'react'


const Header = ({user,messages,created,channel}:any) => {

  if(channel&&!user) {
    return(
    <ChannelHeader
      messages={channel.messages}
      channelName= {channel?.name} 
      description={channel?.description}
    />
   )
  }
  return (
    <View >
      <TouchableOpacity 
        className='flex-row items-center h-[90px] rounded-[50px] '
      >
        {user?.image && 
          <Image
            source={{ uri:urlForImage(user?.image).width(100).url()}} 
            className='w-[60px] h-[60px] rounded-[20px]'
          />
        }
      </TouchableOpacity>

      <Text className='font-rbold text-xl' >
        {user?.name}
      </Text>

      <Text className='font-plight text-xs text-gray-700'>
        {user?.username}
      </Text>

      <Text className='font-pregular text-sm mt-1.5' >
        This is the beginning of your conversation with {user?.username}
      </Text>

      <Text className='font-rmedium mt-1.5 font-[13px]'>
        Friends since: {created && format(parseISO(created), 'dd MMMM yyyy')}
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