import {
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
// import { Image } from 'expo-image';
import { memo } from 'react';

import { formatDateString, useServer } from '@/lib';
import { Modal } from 'react-native';
import useDisclose from '@/lib/hooks/useDisclose';
import Loader from '../states/loading';
import { Text, View } from '../themed';
import MembersComponent from './members';
import AdminDashboard from './admin';

interface ServerComponentProps {
  serverId: string;
}

const ServerComponent: React.FC<ServerComponentProps> = ({
  serverId,
}) => {
  const { isOpen, onClose, onOpen } = useDisclose()

  const {
    data: server,
    isLoading: loadingServer,
    error
  } = useServer(serverId);

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
          className='w-full justify-end items-center h-52'
          source={{uri:bannerImageUrl}}
        />
        <View className='p-4'>
          <View className='flex-row  justify-between items-center mb-4'>
            <View className='flex-col' >
              <Image
                source={{uri:server?.image!}}
                className='h-[70px] w-[70px] rounded-[35px] border'
              />
              <Text className='font-rbold  mt-5 mr-auto text-lg '>{server?.name}</Text>
            </View>
            <TouchableOpacity className='p-2 rounded mt-[-30px]' onPress={onOpen}>
              <Feather name="edit" size={22} color={"gray"} />
            </TouchableOpacity>
          </View>
          <Text className='text-xs font-rbold mb-2'>
            Created on: <Text className='font-rregular  mb-4 text-sm '>{formatDateString(server?.createdAt!)}</Text>
          </Text>

          <Text className='text-xs font-rbold mb-2'>
            About: <Text className='font-rregular  mb-4 text-sm '>{server?.description}</Text>
          </Text>

          <View className='flex justify-between flex-row'>
            <Text className='text-base font-rmedium mb-2 text-gray-700' >Channels:</Text>
            <Feather name='plus' color={"gray"} size={20} onPress={() => router.navigate(`/create-channel/${serverId}`)} />
          </View>

          {!!textChannels?.length && (
            <View >
              <Text className='text-xs font-rbold mb-2'>Text Channels:</Text>
              {textChannels?.map((channel, i) => (
                <TouchableOpacity
                  key={i}
                  className='flex-wrap flex-row'
                  onPress={() => router.replace(`/channel/${channel?.id}?serverId=${server?.id}`)}
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
            <View >
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
            <View >
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

      {isOpen &&
        <Modal style={{ flex: 1 }} >
          <AdminDashboard {...server} />
        </Modal>
      }
    </>
  );
};
export default memo(ServerComponent)