import React, { useState, useCallback, useMemo } from 'react';
import { KeyboardAvoidingView, ScrollView, Image, Pressable } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useDeleteChannel, useDeleteMembers, useProfileStore, useServer } from '@/lib';
import { Channel, ServerMember } from '@/types';
import { AddIcon } from '@/components/ui/icon';
import { HStack, VStack, Text, AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Button, ButtonText, Input, InputField, Fab, FabIcon, FabLabel, ErrorMessage, Loader, Toast, ToastDescription, useToast } from '@/components';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface MemberItemProps {
  item: ServerMember;
  onChangeRole: (id: string) => void;
  onDeleteMember: (id: string) => void;
  isAdmin: boolean;
}

const MemberItem: React.FC<MemberItemProps> = React.memo(({ item, onChangeRole, onDeleteMember, isAdmin }) => {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleDelete = useCallback(() => {
    opacity.value = withTiming(0, { duration: 300 }, () => {
      onDeleteMember(item.id);
    });
  }, [opacity, onDeleteMember, item.id]);

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition.springify()}
      style={animatedStyle}
      className="flex-row justify-between items-center mb-3 p-2 bg-opacity-10  rounded-lg"
    >
      <HStack space="md" className="items-center space-x-3">
        <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full border-2 border-blue-300" />
        <VStack>
          <HStack className="items-center space-x-2">
            <Text className="font-rbold text-white text-base">{item.name}</Text>
            {item.role === "ADMIN" && <Ionicons name="shield-checkmark" color="yellow" size={18} />}
          </HStack>
          <Text className="text-xs text-blue-200">{item.role}</Text>
        </VStack>
      </HStack>
      {!isAdmin && (
        <HStack className="space-x-2">
          <Pressable onPress={() => onChangeRole(item.id)} className="p-2 rounded-full">
            <Ionicons name="create-outline" color="white" size={22}/>
          </Pressable>
          <Pressable onPress={handleDelete} className="p-2 bg-rose-400 rounded-full">
            <MaterialIcons name="delete" color="white" size={22}/>
          </Pressable>
        </HStack>
      )}
    </Animated.View>
  );
});

interface ChannelItemProps {
  item: Channel;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isGeneral: boolean;
}

const ChannelItem: React.FC<ChannelItemProps> = React.memo(({ item, onEdit, onDelete, isGeneral }) => {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleDelete = useCallback(() => {
    'worklet';
    opacity.value = withTiming(0, { duration: 300 }, () => {
      onDelete(item.id);
    });
  }, [opacity, onDelete, item.id]);

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition.springify()}
      style={animatedStyle}
      className="flex-row justify-between items-center mb-3 p-2 bg-opacity-30 rounded-lg"
    >
      <Text className="text-white text-lg font-rregular"># {item.name}</Text>
      {!isGeneral && (
        <HStack className="space-x-2">
          <Pressable onPress={() => onEdit(item.id)} className="p-2 rounded-full">
            <Ionicons name="create-outline" color="white" size={22}/>
          </Pressable>
          <Pressable onPress={handleDelete} className="p-2 rounded-full border-2 border-red-700">
            <MaterialIcons name="delete" color="red" size={22}/>
          </Pressable>
        </HStack>
      )}
    </Animated.View>
  );
});

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = React.memo(({ title, children }) => (
  <AnimatedLinearGradient
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0.5 }}
    colors={['#0e7490', '#06b6d4']}
    entering={FadeIn.delay(200)}
    className="rounded-xl p-5 mb-5 border border-blue-400 shadow-lg"
  >
    <Text className="text-2xl font-rbold mb-4 text-white">{title}</Text>
    {children}
  </AnimatedLinearGradient>
));

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = React.memo(({ isOpen, onClose, onConfirm, title, message }) => (
  <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
    <AlertDialogBackdrop />
    <AlertDialogContent className="bg-gray-800 border border-gray-700">
      <AlertDialogHeader>
        <Text className="text-white font-semibold">{title}</Text>
      </AlertDialogHeader>
      <AlertDialogBody className="mt-3 mb-4">
        <Text className="text-gray-300">{message}</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button variant="outline" action="secondary" onPress={onClose} size="sm">
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button size="sm" onPress={onConfirm} className="bg-red-600">
          <ButtonText>Delete</ButtonText>
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
));

interface ServerState {
  serverName: string;
  members: ServerMember[];
  channels: Channel[];
  selectedChannel: Channel | null;
}

const AdminDashboard: React.FC = () => {
  const [isDeleteServerOpen, setIsDeleteServerOpen] = useState(false);
  const [isDeleteChannelOpen, setIsDeleteChannelOpen] = useState(false);
  const { profile } = useProfileStore();
  const { id: serverId } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  
  const { data: serverData, isLoading: loadingServer, refetch: refetchServer, error } = useServer(serverId);
  const { mutateAsync: deleteChannel, isPending: deletingChannel } = useDeleteChannel(serverId);
  const { mutateAsync: deleteMembers, isPending: deletingMembers } = useDeleteMembers(serverId);

  const [state, setState] = useState<ServerState>({
    serverName: serverData?.name ?? '',
    members: serverData?.members ?? [],
    channels: serverData?.channels ?? [],
    selectedChannel: null,
  });

  const currentUser = useMemo(() => state.members.find(member => member.id === profile.id), [state.members, profile.id]);

  const showToast = useCallback((description: string) => {
    toast.show({
      placement: "top",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="muted" variant="outline" className="bg-gray-700 p-4">
          <ToastDescription className="text-white">{description}</ToastDescription>
        </Toast>
      ),
    });
  }, [toast]);

  const updateState = useCallback(<K extends keyof ServerState>(key: K, value: ServerState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleDeleteMember = useCallback(async (memberId: string) => {
    try {
      await deleteMembers([memberId]);
      updateState('members', state.members.filter(member => member.id !== memberId));
      showToast("Member deleted successfully");
    } catch (error) {
      showToast("Failed to delete member");
    }
  }, [state.members, deleteMembers, updateState, showToast]);

  const handleChangeRole = useCallback((memberId: string) => {
    updateState('members', state.members.map(member =>
      member.id === memberId
        ? { ...member, role: member.role === 'MEMBER' ? 'MODERATOR' : 'MEMBER' as any }
        : member
    ));
    showToast("Member role updated");
  }, [state.members, updateState, showToast]);

  const handleDeleteChannel = useCallback(async () => {
    if (state.selectedChannel) {
      try {
        await deleteChannel(state.selectedChannel.id);
        updateState('channels', state.channels.filter(channel => channel.id !== state.selectedChannel.id));
        setIsDeleteChannelOpen(false);
        showToast(`Channel "${state.selectedChannel.name}" deleted`);
      } catch (error) {
        showToast("Failed to delete channel");
      }
    }
  }, [state.selectedChannel, state.channels, deleteChannel, updateState, showToast]);

  const handleDeleteServer = useCallback(() => {
    setIsDeleteServerOpen(false);
    showToast("Server deleted successfully");
    router.replace('/servers');
  }, [showToast]);

  if (loadingServer) return <Loader loadingText='Loading Admin Dashboard' subText='Please wait while we load your data' />;
  if (error) return <ErrorMessage message='Failed to load server data' onRetry={refetchServer} />;

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView behavior="padding" className="p-4">
        <Animated.View entering={FadeIn} className="mb-6">
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=300' }}
            className="w-full h-56 rounded-xl shadow-lg"
          />
        </Animated.View>
        
        <HStack className="justify-between items-center mb-8">
          <Text className="text-4xl font-rbold">Server Dashboard</Text>
          {currentUser?.role === "ADMIN" && (
            <Button
              className="bg-red-600 rounded-full px-4 py-2 shadow-lg"
              onPress={() => setIsDeleteServerOpen(true)}
            >
              <ButtonText className="text-sm font-rbold">Delete Server</ButtonText>
            </Button>
          )}
        </HStack>

        <SectionContainer title="Server Settings">
          <Input className="mb-4 bg-opacity-50 rounded-lg border-blue-300">
            <InputField placeholder={state.serverName} className="text-white" />
          </Input>
          <HStack className="space-x-3">
            <Button className="flex-1 flex-row items-center justify-center rounded-lg py-1 bg-cyan-500">
              <MaterialIcons name="image" color="white" size={20} className="mr-2" />
              <ButtonText className='font-rregular text-sm'>Change Server Image</ButtonText>
            </Button>
            <Button className="flex-1 flex-row items-center justify-center rounded-lg py-1 bg-cyan-500">
              <MaterialIcons name="panorama" color="white" size={20} className="mr-2" />
              <ButtonText className='font-rregular text-sm'>Change Banner</ButtonText>
            </Button>
          </HStack>
        </SectionContainer>

        <SectionContainer title="Members">
          {state.members.map((member) => (
            <MemberItem
              key={member.id}
              item={member}
              onChangeRole={handleChangeRole}
              onDeleteMember={handleDeleteMember}
              isAdmin={member.role === "ADMIN"}
            />
          ))}
        </SectionContainer>

        <SectionContainer title="Channels">
          {state.channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              item={channel}
              onEdit={() => {/* Add edit logic */}}
              onDelete={(channelId) => {
                updateState('selectedChannel', state.channels.find(c => c.id === channelId) || null);
                setIsDeleteChannelOpen(true);
              }}
              isGeneral={channel.name === "general"}
            />
          ))}
        </SectionContainer>
      </KeyboardAvoidingView>

      <ConfirmationDialog
        isOpen={isDeleteServerOpen}
        onClose={() => setIsDeleteServerOpen(false)}
        onConfirm={handleDeleteServer}
        title="Delete Server"
        message="Are you sure you want to delete this server? This action cannot be undone."
      />

      <ConfirmationDialog
        isOpen={isDeleteChannelOpen}
        onClose={() => setIsDeleteChannelOpen(false)}
        onConfirm={handleDeleteChannel}
        title="Delete Channel"
        message="Are you sure you want to delete this channel? This action cannot be undone."
      />

      <Fab
        size="sm"
        onPress={() => router.push(`/create-channel/${serverData?.id}`)}
        className="bg-blue-500 shadow-lg"
      >
        <FabIcon as={AddIcon} />
        <FabLabel className='font-rbold'>New Channel</FabLabel>
      </Fab>
    </ScrollView>
  );
};

export default React.memo(AdminDashboard);