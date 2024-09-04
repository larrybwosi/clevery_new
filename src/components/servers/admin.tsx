import { useState, useCallback, memo, useEffect } from 'react';
import { BackHandler, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { showToastMessage, useProfileStore } from '@/lib';
import { Server, Channel, ServerMember } from '@/types';
import { router } from 'expo-router';
import { Image } from 'react-native';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Button, ButtonText } from '../ui/button';
import { Input, InputField } from '../ui/input';
import { Fab, FabIcon, FabLabel } from '../ui/fab';
import { LinearGradient } from 'expo-linear-gradient';
import { AddIcon } from '../ui/icon';

interface IProps {
  item: ServerMember; 
  onChangeRole: (id: string) => void; 
  onDeleteMember: (id: string) => void 
}
// Component for rendering a single member
const MemberItem = memo(({ item, onChangeRole, onDeleteMember }:IProps) => (
  <Animated.View entering={FadeIn} exiting={FadeOut}>
    <HStack className="justify-between items-center mb-3 p-2 bg-transparent rounded-lg">
      <HStack space='md' className="items-center space-x-3 gap-4 flex-row">
        <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full border-2 border-blue-300 z-10" />
        <VStack>
          <HStack className="items-center space-x-2">
            <Text className="font-rbold text-white text-base">{item.name}</Text>
            {item.role === "ADMIN" && <Ionicons name="shield-checkmark" color="yellow" size={18} />}
          </HStack>
          <Text className="text-xs text-blue-200">{item.role}</Text>
        </VStack>
      </HStack>
      {item.role !== "ADMIN" && (
        <HStack className="space-x-2">
          <Button onPress={() => onChangeRole(item.id)} className="p-2 rounded-full">
            <Ionicons name="create-outline" color="white" size={22}/>
          </Button>
          <Button onPress={() => onDeleteMember(item.id)} className="p-2 bg-rose-400 rounded-full">
            <MaterialIcons name="delete" color="white"/>
          </Button>
        </HStack>
      )}
    </HStack>
  </Animated.View>
));

// Component for rendering a single channel
const ChannelItem = memo(({ item, onEdit, onDelete }: { item: Channel; onEdit: () => void; onDelete: () => void }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut}>
    <HStack className="justify-between items-center mb-3 p-2 bg-opacity-30 rounded-lg">
      <Text className="text-white text-lg font-rregular"># {item.name}</Text>
      {item.name !== "general" && (
        <HStack className="space-x-2">
          <Button onPress={onEdit} className="p-2 rounded-full">
            <Ionicons name="create-outline" color="white" size={22}/>
          </Button>
          <Button onPress={onDelete} className="p-2 bg-red-700 rounded-full">
            <MaterialIcons name="delete" color="white"/>
          </Button>
        </HStack>
      )}
    </HStack>
  </Animated.View>
));

const AdminDashboard = ({ id, name, channels, members }: Server) => {
  const [state, setState] = useState({ serverName: name, members, channels, selectedChannel: undefined });
  const [isDeleteServerOpen, setIsDeleteServerOpen] = useState(false);
  const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
  const { profile } = useProfileStore();
  const currentUser = members.find(member => member.id === profile.id);

  const updateState = useCallback((key: string, value: any) => setState(prev => ({ ...prev, [key]: value })), []);

  const Custom = Animated.createAnimatedComponent(LinearGradient)
  const CustomView = Animated.createAnimatedComponent(KeyboardAvoidingView)

  const handleDeleteMember = useCallback((memberId: string) => {
    updateState('members', state.members.filter(member => member.id !== memberId));
    showToastMessage("Member deleted successfully");
  }, [state.members, updateState]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('Back button pressed');
      router.push('/servers');
      return true;
    });

    return () => backHandler.remove();
  }, []);
  const handleChangeRole = useCallback((memberId: string) => {
    updateState('members', state.members?.map(member =>
      member.id === memberId ? { ...member, role: member.role === 'MEMBER' ? 'MODERATOR' : 'MEMBER' } : member
    ));
    showToastMessage("Member role updated");
  }, [state.members, updateState]);

  const handleDeleteChannel = useCallback(() => {
    if (state.selectedChannel) {
      updateState('channels', state.channels.filter(channel => channel.id !== state.selectedChannel?.id));
      setIsDeleteChannelOpen(false);
      showToastMessage(`Channel "${state.selectedChannel.name}" deleted`);
    }
  }, [state.selectedChannel, state.channels, updateState]);

  const handleDeleteServer = useCallback(() => {
    setIsDeleteServerOpen(false);
    showToastMessage("Server deleted successfully");
    // Add logic to navigate away or update UI after server deletion
  }, []);

  return (
    <ScrollView className="flex-1 ">
      <CustomView behavior={"padding"}>
        <Animated.View entering={FadeIn} className="p-1">
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=300' }}
          className="w-full h-56 rounded-xl mb-6 shadow-lg"
        />
        <HStack className="justify-between items-center mb-8">
          <Text className="text-4xl font-rbold shadow-text text-gray-700">Server Dashboard</Text>
          {currentUser?.role === "ADMIN" && (
            <Button
              className="bg-red-600 rounded-full px-4 py-2 shadow-lg"
              onPress={() => setIsDeleteServerOpen(true)}
            >
              <ButtonText className="text-sm font-rbold">Delete Server</ButtonText>
            </Button>
          )}
        </HStack>

        <VStack className="space-y-6">
        <Custom
          colors={['#0891b2','#155e75']} entering={FadeIn.delay(200)} 
          className="bg-opacity-30 rounded-xl p-5 mb-5 border border-blue-400 shadow-blue-600"
        >
          <Text className="text-2xl font-rbold mb-4 text-white">Server Settings</Text>
          <Input
            // value={state.serverName!}
            className="mb-4 bg-opacity-50 rounded-lg border-blue-300"
          >
            <InputField placeholder={name} className="text-white" />
          </Input>
          <HStack className="space-x-3">
            <Button
              className="flex-1 flex-row items-center justify-center rounded-lg py-1 bg-cyan-500"
            >
              <MaterialIcons name="image" color="white"className="mr-2" />
              <ButtonText className='font-rregular text-sm'>Change Server Image</ButtonText>
            </Button>
            <Button
              variant="solid"
              className="flex-1 flex-row items-center justify-center rounded-lg py-1 bg-cyan-500"
            >
              <MaterialIcons name="panorama" color="white"className="mr-2" />
              <ButtonText className='font-rregular text-sm'>Change Banner</ButtonText>
            </Button>
          </HStack>
        </Custom>

        <Custom
          colors={['#0891b2','#155e75']} 
          entering={FadeIn.delay(400)} 
          className="bg-blue-800 bg-opacity-30 rounded-xl mb-5 p-5 border border-blue-400 border-opacity-30 shadow-lg" 
        >
            <Text className="text-2xl font-rbold mb-4 text-white">Members</Text>
            {members?.map((member) => (
              <MemberItem
                key={member.id}
                item={member}
                onChangeRole={handleChangeRole}
                onDeleteMember={handleDeleteMember}
              />
            ))}
          </Custom>

        <Custom
          colors={['#0891b2', '#155e75']} 
          entering={FadeIn.delay(600)} 
          className="bg-blue-800 bg-opacity-30 rounded-xl p-5 border border-blue-400 border-opacity-30 shadow-lg"
        >
          <Text className="text-2xl font-rbold mb-4 text-white">Channels</Text>
          {channels?.map((channel) => (
            <ChannelItem
              key={channel.id}
              item={channel}
              onEdit={() => {/* Add edit logic */ }}
              onDelete={() => {
                updateState('selectedChannel', channel);
                setIsDeleteChannelOpen(true);
              }}
            />
          ))}
          </Custom>
        </VStack>
        <Fab
          size="lg"
          onPress={() => router.navigate(`/create-channel/${id}`)}
          className=" bottom-6 right-6 w-5  shadow-lg"
        >
          <FabIcon as={AddIcon} />
          <FabLabel className='font-rbold'>New Channel</FabLabel>
        </Fab>
      </Animated.View>
      </CustomView>
    </ScrollView>
  );
};

export default AdminDashboard;