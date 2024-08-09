import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serverApi } from '../servers';
import { CreateChannelData, CreateServerData, DeleteMessagePayload, SendMessageDataPayload, UpdateChannelData, UpdateChannelMessagePayload, UpdateServerData } from '@/types';

// Define query keys
const queryKeys = {
  servers: ['servers'],
  topServers: ['topServers'],
  server: (id: string) => ['server', id],
  channels: (serverId: string) => ['channels', serverId],
  channel: (id: string) => ['channel', id],
  messages: (channelId: string) => ['messages', channelId],
  message: (id: string) => ['message', id],
  members: (serverId: string) => ['members', serverId],
};

// Custom hooks for each API function
export const useServers = () => {
  return useQuery({
    queryKey: queryKeys.servers, 
    queryFn: () => serverApi.getAllServers()
  });
};

export const useTopServers = () => {
  return useQuery({
    queryKey: queryKeys.topServers, 
    queryFn: () => serverApi.getTopServers()
  });
};

export const useServer = (serverId: string) => {
  return useQuery({
    queryKey: queryKeys.server(serverId), 
    queryFn: () => serverApi.getServerById(serverId)
  });
};

export const useCreateServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (server: CreateServerData) => serverApi.createServer(server),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.servers});
    }
  });
};

export const useUpdateServer = (serverId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: UpdateServerData) => serverApi.updateServer(serverId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.servers});
    }
  })
};

export const useDeleteServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serverId: string) => serverApi.deleteServer(serverId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.servers});
    }
  });
};

export const useChannel = (channelId: string) => {
  return useQuery({
    queryKey: queryKeys.channel(channelId), 
    queryFn: () => serverApi.getChannelById(channelId), enabled: Boolean(channelId)},
    );
};

export const useServerChannels = (serverId: string) => {
  return useQuery({
    queryKey: queryKeys.channels(serverId), 
    queryFn: () => serverApi.getServerChannels(serverId)
  });
};

export const useCreateChannel = (serverId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channelData: CreateChannelData) => serverApi.createChannel(serverId, channelData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.channels(serverId)});
    }
  });
};

export const useSendChannelMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessageDataPayload) => serverApi.sendChannelMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.channels(variables.serverId)});
    }
  })
};

export const useChannelMessages = (channelId: string) => {
  return useQuery({
    queryKey: queryKeys.messages(channelId),
    queryFn:()=>serverApi.getChannelMessages(channelId)
  });
};

export const useMessage = (messageId: string) => {
  return useQuery({
    queryKey: queryKeys.message(messageId), 
    queryFn: () => serverApi.getMessageById(messageId)
  });
};

export const useEditChannelMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateChannelMessagePayload) => serverApi.editChannelMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.messages(variables.channelId)});
    }
  });
};

export const useDeleteChannelMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteMessagePayload) => serverApi.deleteChannelMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.messages(variables.channelId)});
    }
  })
};

export const useServerMembers = (serverId: string) => {
  return useQuery({
    queryKey: queryKeys.members(serverId),
    queryFn: () => serverApi.getServerMembers(serverId), enabled: Boolean(serverApi.getServerMembers(serverId))});
};

export const useUpdateChannel = (serverId: string, channelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: UpdateChannelData) => serverApi.updateChannel(serverId, channelId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.channels(serverId)});
      queryClient.invalidateQueries({queryKey:queryKeys.channel(channelId)});
    }
  })
};

export const useDeleteChannel = (serverId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channelId: string) => serverApi.deleteChannel(serverId, channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.channels(serverId)});
    }
  });
};

// Example of how to use these hooks in a component
export const useServerData = (serverId: string) => {
  const { data: server, isLoading: serverLoading, error: serverError } = useServer(serverId);
  const { data: channels, isLoading: channelsLoading, error: channelsError } = useServerChannels(serverId);
  const { data: members, isLoading: membersLoading, error: membersError } = useServerMembers(serverId);

  const isLoading = serverLoading || channelsLoading || membersLoading;
  const error = serverError || channelsError || membersError;

  return { server, channels, members, isLoading, error };
};
