import { TouchableOpacity } from 'react-native'
import { format, parseISO } from 'date-fns'
import { Text, View } from '@/components/Themed'
import { formatDateString, multiFormatDateString, urlForImage } from '@/lib'
import ChannelHeader from '@/components/Servers/ChannelHeader'
import { memo } from 'react'
import Image from '../image'


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