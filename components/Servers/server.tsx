import {
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { formatDateString, urlForImage, useGetServerById } from '../../lib';
import { Text, View } from '../Themed';
import Loader from '../Loader';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { memo } from 'react';

interface ServerComponentProps {
  serverId: string;
}

const ServerComponent: React.FC<ServerComponentProps> = ({
  serverId,
}) => {
  const {data:serverInfo,isLoading:loadingServer,error} =useGetServerById(serverId)
  const textChannels = serverInfo?.channels.filter((channel)=>channel.type ==="TEXT")
  const audioChannels = serverInfo?.channels.filter((channel)=>channel.type ==="AUDIO")
  const videoChannels = serverInfo?.channels.filter((channel)=>channel.type ==="VIDEO")
  
  const bannerImageUrl = serverInfo?.bannerImage?urlForImage(serverInfo?.bannerImage).width(400).height(200).url():'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=400'
  if(loadingServer) return <Loader loadingText='Loading Server'/>
  if(error) return <Loader loadingText='Something went wrong'/>
// console.log(serverInfo)
  const serverIcon = serverInfo?.icon? urlForImage(serverInfo.icon).width(100).url():'' 
  return (
    <View className='flex-1'>
      <Image
        className='w-full h-[180px] '
        source={{ uri: bannerImageUrl }}
      />
      <View className='p-4'>
        <View className='flex-row  justify-between items-center mb-4'>
        <View className='flex-col' >
        <Image 
          source={{ uri: serverIcon}}  
          className='h-[70px] w-[70px] rounded-[35px] border  ' 
        />
          <Text className='font-rbold  mt-5 mr-auto text-lg'>{serverInfo?.name}</Text>
        </View>
          <TouchableOpacity className='p-2 rounded mt-[-30px]' onPress={()=>router.replace(`/create-channel/${serverId}`)}>
            <Feather name="link" size={22} color={"gray"} />
          </TouchableOpacity> 
        </View>
        <Text className='text-xs font-rbold mb-2'>Created on: <Text className='font-rregular  mb-4 text-sm '>{ formatDateString(serverInfo?._createdAt!)}</Text> </Text>
        <Text className='text-xs font-rbold mb-2'>About: <Text className='font-rregular  mb-4 text-sm '>{serverInfo?.description}</Text> </Text>
        <View className='flex justify-between flex-row'>
          <Text className='text-base font-rmedium mb-2 text-gray-700' >Channels:</Text>
          <Feather name='plus' color={"gray"} size={20} onPress={()=>router.navigate(`/create-channel/${serverInfo?._id}`)} />
        </View>
          
        {!!textChannels?.length &&(
          <View >
            <Text className='text-xs font-rbold mb-2'>Text Channels:</Text>
            {textChannels?.map((channel,i)=>(
              <TouchableOpacity
                key={i}
                className='flex-wrap flex-row'
                onPress={()=>router.replace(`/channel/${channel?._id}`)}
              >
                <View className='flex-row items-center mr-2 mb-2 p-2 rounded-sm'>
                  <Feather name="hash" size={20} color="gray" />
                  <Text 
                  className='ml-2 font-pregular text-gray-600 text-sm'>{channel.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!!audioChannels?.length &&(
          <View >
            <Text className='text-xs font-rbold mb-2'>Voice Channels:</Text>
            {audioChannels?.map((channel,i)=>(
              <TouchableOpacity
                key={i}
                className='flex-wrap flex-row'
                onPress={()=>router.replace(`/channel/${channel?._id}`)}
              >
                <View className='flex-row items-center mr-2 mb-2 p-2 rounded-sm'>
                  <Feather name="mic" size={18} color="gray" />
                  <Text 
                  className='ml-2 font-pregular text-gray-600 text-sm'>{channel.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View> 
        )}

        {!!videoChannels?.length &&(
          <View >
            <Text className='text-xs font-rbold mb-2'>Video Channels:</Text>
            {videoChannels?.map((channel,i)=>(
              <TouchableOpacity
                key={i}
                className='flex-wrap flex-row'
                onPress={()=>router.replace(`/channel/${channel?._id}`)}
              >
                <View className='flex-row items-center mr-2 mb-2 p-2 rounded-sm'>
                  <Feather name="video" size={20} color="gray" />
                  <Text 
                  className='ml-2 font-pregular text-gray-600 text-sm'>{channel.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View> 
        )}
      </View>
    </View>
  );
};
export default memo(ServerComponent)