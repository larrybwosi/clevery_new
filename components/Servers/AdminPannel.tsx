import { useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Avatar,
  Input,
  InputField,
  Button,
  ButtonText,
  ButtonIcon,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Divider,
  Fab,
  FabIcon,
  FabLabel,
  LinearGradient,
} from '@/components';
import { showToastMessage, useProfileStore } from '@/lib';
import { Server, Channel, User, ServerMember } from '@/types';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { AvatarImage } from '../ui/avatar';

interface StateProps {
  serverName: string,
  members: ServerMember[],
  channels: Channel[],
  selectedChannel: Channel | undefined
}

interface AdminDashboardProps {
  server: Server
  onClose: any
}

const AdminDashboard = ({
  id,
  name,
  channels,
  members
}: Server) => {
  const [state, setState] = useState<StateProps>({
    serverName: name,
    members,
    channels,
    selectedChannel: undefined
  });

  const [isDeleteServerOpen, setIsDeleteServerOpen] = useState(false);
  const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
  const { profile } = useProfileStore()
  const updateState = (key: string, value: any) => {
    setState(prevState => ({ ...prevState, [key]: value }));
  };
  const bannerImageUrl = 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=400'
  const currentUser = members.find(member => member.id === profile.id)

  const handleSubmit = () => {
    console.log('Submitting changes:', state);
    showToastMessage("Changes saved successfully");
  };

  const handleDeleteMember = (memberId: string) => {
    updateState('members', state.members.filter(member => member.id !== memberId));
    showToastMessage("Member deleted successfully");
  };

  const handleChangeRole = (memberId: string) => {
    updateState('members', state.members.map(member =>
      member.id === memberId
        ? { ...member, role: member.role === 'MEMBER' ? 'MODERATOR' : 'MEMBER' }
        : member
    ));
    showToastMessage("Member role updated");
  };

  const handleDeleteChannel = () => {
    if (state.selectedChannel) {
      updateState('channels', state.channels.filter(channel => channel.id !== state?.selectedChannel?.id));
      setIsDeleteChannelOpen(false);
      showToastMessage(`Channel "${state.selectedChannel.name}" deleted`);
    }
  };

  const handleDeleteServer = () => {
    setIsDeleteServerOpen(false);
    showToastMessage("Server deleted successfully");
  };

  return (
    <LinearGradient
      colors= {['$blue400', '$blue600', '$blue800']}
      start={[0, 0]}
      end={[1, 1]}
      className='w-full h-full flex-1'
    >
      <ScrollView>
        <Box >
          <Image
            className='w-full h-[180px] flex-1 z-10 shadow-sm'
            source={{ uri: bannerImageUrl }}
          />
          <HStack className='justify-between items-center'>
            <Text  className='text-white font-rmedium text-lg'>
              Server Dashboard
            </Text>
            {currentUser?.role == "ADMIN" &&
              <TouchableOpacity
                className='rounded-lg bg-rose-700 p-2 px-4 my'
                onPress={() => setIsDeleteServerOpen(true)}
              >
                <Text className='text-sm text-white font-rregular'>Delete</Text>
              </TouchableOpacity>
            }
          </HStack>

          <VStack className='space-y-4'>
            <LinearGradient
              className='w-full rounded-xl shadow-md elevation-5 p-4'
              colors= {['$gray400', '$blue600', '$blue800']}
              start= {[0, 0]}
              end= {[1, 1]}
            >
              <Text className='font-rmedium text-lg' >
                Server Settings
              </Text>
              <Input
                value={state.serverName}
                onChangeText={(text) => updateState('serverName', text)}
              >
                <InputField placeholder="Server Name" />
              </Input>
              <HStack className='space-x-2'>
                <Button className='flex-1' variant="solid">
                  <MaterialIcons name="image" />
                  <ButtonText className='font-rregular text-white text-sm'>Change Server Image</ButtonText>
                </Button>
                <Button className='flex-1' variant="solid">
                  <MaterialIcons name="panorama" />
                  <ButtonText className='font-rregular text-white text-sm'>Change Banner</ButtonText>
                </Button>
              </HStack>
            </LinearGradient>

            
            <LinearGradient
              className='w-full rounded-xl shadow-md elevation-5 p-4'
              colors= {['$gray400', '$blue600', '$blue800']}
              start= {[0, 0]}
              end= {[1, 1]}
            >
              <Text  className='font-rmedium text-lg'>
                Members
              </Text>
              <FlatList
                data={members}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <HStack className='justify-between items-center mb-1'>
                    <HStack className='space-x-2 items-center' >
                      <AvatarImage source={{ uri: item.image! }} />
                      <VStack>
                        <Text className='font-rmedium text-xs'>
                          {item.name}
                          {item.role == "ADMIN" &&
                            <Ionicons name='shield-checkmark-outline' color={'red'} size={14} style={{ marginLeft: 6 }} />
                          }
                        </Text>
                        <Text className='font-rregular text-gray-500'>
                          {item.role}
                        </Text>
                      </VStack>
                    </HStack>

                    {item.role !== "ADMIN" &&
                      <HStack className='space-x-2'>
                        <Button
                          variant="solid"
                          onPress={() => handleChangeRole(item.id)}
                        >
                          <MaterialIcons name="edit" />
                        </Button>
                        <Button
                          variant="solid"
                          onPress={() => handleDeleteMember(item.id)}
                        >
                          <MaterialIcons name="delete" color="$red500" />
                        </Button>
                      </HStack>
                    }
                  </HStack>
                )}
                ItemSeparatorComponent={() => <Divider className='my-2'/>}
              />
            </LinearGradient>

            <LinearGradient
              className='w-full rounded-xl shadow-md elevation-5 p-4'
              colors= {['$gray400', '$blue600', '$blue800']}
              start= {[0, 0]}
              end= {[1, 1]}
            >
              <Text className='font-rmedium text-lg'>
                Channels
              </Text>
              <FlatList
                data={channels}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <HStack className='justify-between items-center' >
                    <Text className='font-rregular'>{item.name}</Text>
                    
                    {item.name !== "general" &&
                      <HStack>
                        <Button
                          variant="solid"
                        >
                          <Feather name="edit" />
                        </Button>
                        <Button
                          variant="solid"
                          onPress={() => {
                            updateState('selectedChannel', item);
                            setIsDeleteChannelOpen(true);
                          }}
                        >
                          <MaterialIcons name="delete" color="red" />
                        </Button>
                      </HStack>
                    }
                  </HStack>
                )}
                ItemSeparatorComponent={() => <Divider className='my-2' />}
              />
            </LinearGradient>
          </VStack>
        </Box>
      </ScrollView>

      <Fab
        size="sm"
        onPress={() => router.navigate(`/create-channel/${id}`)}
      >
        <FabIcon as={MaterialIcons} name="add" />
        <FabLabel>New Channel</FabLabel>
      </Fab>

      <AlertDialog isOpen={isDeleteServerOpen} onClose={() => setIsDeleteServerOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack>
              <Text className='font-rmedium text-lg flex-row items-center'>Delete Server</Text>
              <AntDesign name="warning" color="red0" />
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className='font-rregular text-xs'>
              Are you sure you want to delete this server? This action cannot be undone.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setIsDeleteServerOpen(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button variant="solid" onPress={handleDeleteServer}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog isOpen={isDeleteChannelOpen} onClose={() => setIsDeleteChannelOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack>
              <Text className='font-rmedium text-lg flex-row items-center'>Delete Channel</Text>
              <AntDesign name="warning" color="red" />
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className='font-rregular text-xs'>
              Are you sure you want to delete the channel "{state.selectedChannel?.name}"?
              This action cannot be undone.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setIsDeleteChannelOpen(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button variant="solid" onPress={handleDeleteChannel}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LinearGradient>
  );
};

export default AdminDashboard;