import {
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { memo } from 'react';

import { formatDateString, useServer } from '@/lib';
import Loader from '@/components/states/loading';
import { Text, View } from '@/components/themed';
import MembersComponent from '@/components/servers/members';

const Server: React.FC = () => {

  const {id: serverId} = useLocalSearchParams()
  const {
    data: server,
    isLoading: loadingServer,
    error
  } = useServer(serverId as string);

  
  const channels = server?.channels
  if (loadingServer) return <Loader loadingText='Loading Server' />
  if (error) return <Loader loadingText='Something went wrong' />

  const textChannels = channels?.filter((channel) => channel.type === "TEXT")
  const audioChannels = channels?.filter((channel) => channel.type === "AUDIO")
  const videoChannels = channels?.filter((channel) => channel.type === "VIDEO")
  const bannerImageUrl = 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=400'
  if (loadingServer) return <Loader loadingText='Loading Server' />
  if (error) return <Loader loadingText='Something went wrong' />
  
  return (
    <>
      <ScrollView className='flex-1'>
        <Image
          style={{ width: '100%', height: 200 }}
          contentFit='cover'
          source={{uri:bannerImageUrl}}
        />
        <View className='p-4'>
          <View className='flex-row  justify-between items-center mb-4'>
            <View className='flex-col' >
              <Image
                source={{uri:server?.image!}}
                style={{ width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: 'gray' }}
                contentFit='cover'
              />
              <Text className='font-rbold  mt-5 mr-auto text-3xl '>{server?.name}</Text>
            </View>
            <TouchableOpacity className='p-2 rounded mt-[-30px]' onPress={()=>router.push(`/admin?id=${serverId}`)}>
              <Feather name="edit" size={22} color={"gray"} />
            </TouchableOpacity>
          </View>
          <Text className='text-sm font-rbold mb-2'>
            Created on: <Text className='font-rregular mb-4 text-sm '>{formatDateString(server?.createdAt!)}</Text>
          </Text>

          <Text className='text-sm font-rbold mb-2'>
            About: <Text className='font-rregular  mb-4 text-sm '>{server?.description}</Text>
          </Text>

          <View className='flex justify-between flex-row mt-6'>
            <Text className='text-base font-rbold mb-6 text-gray-700' >Channels:</Text>
            <Feather name='plus' color={"gray"} size={20} onPress={() => router.navigate(`/create-channel/${serverId}`)} />
          </View>

          {!!textChannels?.length && (
            <View className='mb-4 ml-2' >
              <Text className='text-xs font-rbold mb-2'>Text Channels:</Text>
              {textChannels?.map((channel, i) => (
                <TouchableOpacity
                  key={i}
                  className='flex-wrap flex-row'
                  onPress={() => router.replace(`/channel?id=${channel?.id}&serverId=${serverId}`)}
                >
                  <View className='flex-row items-center mr-2 mb-2 p-2 rounded-sm'>
                    <Feather name="hash" size={20} color="gray" />
                    <Text
                      className='ml-2 font-pregular text-gray-600 text-sm'
                    >
                      {channel.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!!audioChannels?.length && (
            <View className='mb-4 ml-2' >
              <Text className='text-xs font-rbold mb-2'>Voice Channels:</Text>
              {audioChannels?.map((channel, i) => (
                <TouchableOpacity
                  key={i}
                  className='flex-wrap flex-row'
                  onPress={() => router.replace(`/room/`)}
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

          {!!videoChannels?.length && (
            <View className='mb-4 ml-2' >
              <Text className='text-xs font-rbold mb-2'>Video Channels:</Text>
              {videoChannels?.map((channel, i) => (
                <TouchableOpacity
                  key={i}
                  className='flex-wrap flex-row'
                  onPress={() => router.replace(`/channel/${channel?.id}`)}
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

          <MembersComponent
            userImages={server?.members?.map((usr) => usr?.image!)!}
          />
        </View>
      </ScrollView>
    </>
  );
};
export default memo(Server)