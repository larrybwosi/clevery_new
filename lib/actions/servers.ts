import { Server, CreateServer, UpdateServer, Channel, CreateChannel, UpdateChannel, Member } from '@/validations';
import { Message } from '@/validations';
import axios from 'axios';


interface UpdateMessagePayload {
  serverId: string;
  channelId: string;
  messageId: string;
  text?: string;
  image?: string;
}

interface DeleteMessagePayload {
  serverId: string;
  channelId: string;
  messageId: string;
}
export interface ChannelMessagePayload {
  serverId: string;
  channelId: string,
  text?: string;
  image?: string;
}
/**
 * API client for managing servers and their channels.
 */
export const serverApi = {
  /**
   * Retrieves all servers.
   * @returns A promise that resolves to an array of servers.
   */
  getAllServers: async (): Promise<Server[]> => {
    const response = await axios.get('/servers');
    // if (!response.ok) throw new Error('Failed to fetch servers');
    return response?.data;
  },

  /**
   * Retrives the top 10 servers with the most members.
   * @returns A promise that resolves to an array of servers.
   * */
  getTopServers: async (): Promise<Server[]> => {
    const response = await axios.get('/api/servers/top');
    if (!response.data) throw new Error('Failed to fetch servers');
    return response.data;
  },

 /**
   * Retrieves a server by its ID, including its channels, logs, and members.
   * @param serverId - The ID of the server to fetch.
   * @returns A promise that resolves to the server with its details.
   */
 getServerById: async (serverId: string): Promise<Server> => {
  const response = await axios.get(`/api/servers/${serverId}`);
  if (!response.data) {
    if (response.status === 404) {
      throw new Error('Server not found');
    }
    throw new Error('Failed to fetch server');
  }
  return response.data;
},
  /**
   * Creates a new server.
   * @param serverData - The data for creating a new server.
   * @returns A promise that resolves to the created server.
   */
  createServer: async (serverData: CreateServer): Promise<Server> => {
    const response = await axios.post('/api/servers',serverData);
    if (!response.data) throw new Error('Failed to create server');
    return response.data;
  },

  /**
   * Updates an existing server.
   * @param serverId - The ID of the server to update.
   * @param updateData - The data to update on the server.
   * @returns A promise that resolves to the updated server.
   */
  updateServer: async (serverId: string, updateData: UpdateServer): Promise<Server> => {
    const response = await axios.patch(`/api/servers/${serverId}`,updateData);
    if (!response.data) throw new Error('Failed to update server');
    return response.data;
  },

  /**
   * Deletes a server.
   * @param serverId - The ID of the server to delete.
   * @returns A promise that resolves when the server is successfully deleted.
   */
  deleteServer: async (serverId: string): Promise<void> => {
    const response = await axios.delete(`/api/servers/${serverId}`);
    if (!response.data) throw new Error('Failed to delete server');
  },


  /**
   * Retrieves a channel by its ID, including its messages and server details.
   * @param channelId - The ID of the channel to fetch.
   * @returns A promise that resolves to the channel with its details.
   */
  getChannelById: async (channelId: string): Promise<Channel> => {
    const response = await axios.get(`/channels/${channelId}`);
    return response.data;
  },
  
  /**
   * Retrieves all channels for a specific server.
   * @param serverId - The ID of the server to fetch channels from.
   * @returns A promise that resolves to an array of channels.
   */
  getServerChannels: async (serverId: string): Promise<Channel[]> => {
    const response = await axios.get(`/api/servers/${serverId}/channels`);
    if (!response.data) throw new Error('Failed to fetch channels');
    return response.data;
  },

  /**
   * Creates a new channel in a server.
   * @param serverId - The ID of the server to create the channel in.
   * @param channelData - The data for creating a new channel.
   * @returns A promise that resolves to the created channel.
   */
  createChannel: async (serverId: string, channelData: CreateChannel): Promise<Channel> => {
    const response = await axios.post(`/api/servers/${serverId}/channels`,channelData);
    if (!response.data) throw new Error('Failed to create channel');
    return response.data;
  },


  /**
   * Sends a new message to a channel.
   * @param channelId - The ID of the channel to send the message to.
   * @param messageData - The data for the new message.
   * messageData should contain a `content` property with the message content.
   * @returns A promise that resolves to the created message with sender details.
   */
  sendChannelMessage: async ( messageData: ChannelMessagePayload): Promise<Message> => {
    const response = await axios.post(`/api/servers/${messageData.serverId}/channels/${messageData.channelId}/msg`, messageData);
    console.log(response.data);
    // if (!response.ok) throw new Error('Failed to send message');
    return response.data;
  },

  /**
   * Retrieves all messages for a specific channel.
   * @param channelId - The ID of the channel to fetch messages from.
   * @returns A promise that resolves to an array of messages.
   */
  getChannelMessages: async (channelId: string): Promise<Message[]> => {
    const response = await axios.get(`/api/channels/${channelId}/messages`);
    if (!response.data) throw new Error('Failed to fetch messages');
    return response.data;
  },

  /**
   * Retrieves a single message by its ID.
   * @param messageId - The ID of the message to fetch.
   * @returns A promise that resolves to the message with its details.
   */
  getMessageById: async (messageId: string): Promise<Message> => {
    const response = await axios.get(`/api/messages/${messageId}`);
    if (!response.data) throw new Error('Failed to fetch message');
    return response.data;
  },

  /**
   * Eddits a message in a channel.
   * @param messageId - The ID of the message to edit.
   * @param updateData - The data to update on the message.
   * @returns A promise that resolves to the updated message.
   * messageData should contain a `content` property with the message content.
   * 
   ** /
   */
   editChannelMessage: async (updateData: UpdateMessagePayload): Promise<Message> => {
    const response = await axios.patch(`/server/${updateData.serverId}/channels/${updateData.channelId}/messages/${updateData.messageId}`,updateData);
    if (!response.data) throw new Error('Failed to edit message');
    return response.data;
  },
  /**
   * Deletes a message in a channel.
   * @param messageId - The ID of the message to delete.
   * @returns A promise that resolves when the message is successfully deleted.
   * */
  deleteChannelMessage: async (updateData: DeleteMessagePayload): Promise<void> => {
    const response = await fetch(`/server/${updateData.serverId}/channels/${updateData.channelId}/messages/${updateData.messageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete message');
  },


  /**
   * Retrieves all members for a specific server.
   * @param serverId - The ID of the server to fetch members from.
   * @returns A promise that resolves to an array of members.
   */
  getServerMembers: async (serverId: string): Promise<Member[]> => {
    const response = await axios.get(`/api/servers/${serverId}/members`);
    if (!response.data) throw new Error('Failed to fetch members');
    return response.data;
  },

  /**
   * Updates an existing channel in a server.
   * @param serverId - The ID of the server containing the channel.
   * @param channelId - The ID of the channel to update.
   * @param updateData - The data to update on the channel.
   * @returns A promise that resolves to the updated channel.
   */
  updateChannel: async (serverId: string, channelId: string, updateData: UpdateChannel): Promise<Channel> => {
    const response = await axios.patch(`/api/servers/${serverId}/channels/${channelId}`,updateData);
    if (!response.data) throw new Error('Failed to update channel');
    return response.data;
  },

  /**
   * Deletes a channel from a server.
   * @param serverId - The ID of the server containing the channel.
   * @param channelId - The ID of the channel to delete.
   * @returns A promise that resolves when the channel is successfully deleted.
   */
  deleteChannel: async (serverId: string, channelId: string): Promise<void> => {
    const response = await axios.delete(`/api/servers/${serverId}/channels/${channelId}`);
    if (!response.data) throw new Error('Failed to delete channel');
  },
};