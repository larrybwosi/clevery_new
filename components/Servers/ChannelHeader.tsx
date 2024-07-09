import { Text, View } from '@/components/Themed' 
import { Feather } from '@expo/vector-icons'

interface Props {
  channelName:string,
  description:string,
  messages:any
}
const ChannelHeader = ({
  channelName,
  description, 
  messages
}:Props) => {

  return (
    <View className={`p-2.5 mb-5 w-full mt-${!!messages?.length?'auto':'[100%]'}`} >
    <Feather  
      name='hash'
      size={30}
      color="gray"
      className='w-[60px] h-[60px] rounded-[20px] border border-gray-400'
     />
      <Text className='font-rbold text-[30px]'>Welcome to #{channelName}</Text>
      <Text className='font-rregular text-[12px] ' >{description}</Text>
    </View>
  )
}

export default ChannelHeader