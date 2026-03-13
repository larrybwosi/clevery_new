import axios, { AxiosError } from 'axios';
import {
  Server,
  Channel,
  Message,
  ServerMember,
  CreateServerData,
  UpdateServerData,
  CreateChannelData,
  UpdateChannelData,
  SendMessageData,
  PaginatedResponse,
  FullModel,
  ChannelMessagePayload,
  UpdateMessagePayload,
  SendMessageDataPayload,
  DeleteMessagePayload
} from '@/types'; // Adjust the import path as needed
import { endpoint } from '../env';
import { handleApiError } from './error';
import { serverPaths as apiPaths } from '../../../routes';

/**
 * API client for managing servers, channels, and messages.
 */
export const serverApi = {
  /**
   * Retrieves all servers.
   * @returns A promise that resolves to an API response containing a paginated list of servers.
   * @throws Error with a descriptive message if the request fails.
   */
  getAllServers: async (): Promise<FullModel<Server[]>> => {
    try {
      const response = await axios.get<FullModel<Server[]>>(`${endpoint}${apiPaths.servers}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch servers");
    }
  },

  /**
   * Retrieves the top 10 servers with the most members.
   * @returns A promise that resolves to an API response containing an array of top servers.
   * @throws Error with a descriptive message if the request fails.
   */
  getTopServers: async (): Promise<FullModel<Server>[]> => {
    try {
      const response = await axios.get<FullModel<Server>[]>(`${endpoint}${apiPaths.topServers}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch top servers");
    }
  },

  /**
   * Retrieves a server by its ID, including its channels, logs, and members.
   * @param serverId - The ID of the server to fetch.
   * @returns A promise that resolves to an API response containing the server with its details.
   * @throws Error with a descriptive message if the request fails.
   */
  getServerById: async (serverId: string): Promise<FullModel<Server>> => {
    try {
      const response = await axios.get<FullModel<Server>>(`${endpoint}${apiPaths.server(serverId)}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Server not found');
      }
      throw handleApiError(error, `Failed to fetch server with ID ${serverId}`);
    }
  },

  /**
   * Creates a new server.
   * @param serverData - The data for creating a new server.
   * @returns A promise that resolves to an API response containing the created server.
   * @throws Error with a descriptive message if the request fails.
   */
  createServer: async (serverData: CreateServerData): Promise<FullModel<Server>> => {
    try {
      const response = await axios.post<FullModel<Server>>(`${endpoint}${apiPaths.servers}`, serverData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create server");
    }
  },

  /**
   * Updates an existing server.
   * @param serverId - The ID of the server to update.
   * @param updateData - The data to update on the server.
   * @returns A promise that resolves to an API response containing the updated server.
   * @throws Error with a descriptive message if the request fails.
   */
  updateServer: async (serverId: string, updateData: UpdateServerData): Promise<FullModel<Server>> => {
    try {
      const response = await axios.patch<FullModel<Server>>(`${endpoint}${apiPaths.server(serverId)}`, updateData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to update server with ID ${serverId}`);
    }
  },

  /**
   * Deletes a server.
   * @param serverId - The ID of the server to delete.
   * @returns A promise that resolves to an API response when the server is successfully deleted.
   * @throws Error with a descriptive message if the request fails.
   */
  deleteServer: async (serverId: string): Promise<void> => {
    try {
      const response = await axios.delete<void>(`${endpoint}${apiPaths.server(serverId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to delete server with ID ${serverId}`);
    }
  },

  /**
   * Retrieves a channel by its ID, including its messages and server details.
   * @param channelId - The ID of the channel to fetch.
   * @returns A promise that resolves to an API response containing the channel with its details.
   * @throws Error with a descriptive message if the request fails.
   */
  getChannelById: async (channelId: string): Promise<FullModel<Channel>> => {
    try {
      const response = await axios.get<FullModel<Channel>>(`${endpoint}${apiPaths.channel(channelId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch channel with ID ${channelId}`);
    }
  },

  /**
   * Retrieves all channels for a specific server.
   * @param serverId - The ID of the server to fetch channels from.
   * @returns A promise that resolves to an API response containing a paginated list of channels.
   * @throws Error with a descriptive message if the request fails.
   */
  getServerChannels: async (serverId: string): Promise<PaginatedResponse<FullModel<Channel>>> => {
    try {
      const response = await axios.get<PaginatedResponse<FullModel<Channel>>>(`${endpoint}${apiPaths.serverChannels(serverId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch channels for server with ID ${serverId}`);
    }
  },

  /**
   * Creates a new channel in a server.
   * @param serverId - The ID of the server to create the channel in.
   * @param channelData - The data for creating a new channel.
   * @returns A promise that resolves to an API response containing the created channel.
   * @throws Error with a descriptive message if the request fails.
   */
  createChannel: async (serverId: string, channelData: CreateChannelData): Promise<FullModel<Channel>> => {
    try {
      const response = await axios.post<FullModel<Channel>>(`${endpoint}${apiPaths.serverChannels(serverId)}`, channelData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to create channel in server with ID ${serverId}`);
    }
  },

  /**
   * Sends a new message to a channel.
   * @param messageData - The data for the new message, including serverId and channelId.
   * @returns A promise that resolves to an API response containing the created message with sender details.
   * @throws Error with a descriptive message if the request fails.
   */
  sendChannelMessage: async (messageData: SendMessageDataPayload): Promise<FullModel<Message>> => {
    try {
      const response = await axios.post<FullModel<Message>>(
        `${endpoint}${apiPaths.sendMessage(messageData.serverId, messageData.channelId)}`,
        messageData.message
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to send message");
    }
  },

  /**
   * Retrieves all messages for a specific channel.
   * @param channelId - The ID of the channel to fetch messages from.
   * @returns A promise that resolves to an API response containing a paginated list of messages.
   * @throws Error with a descriptive message if the request fails.
   */
  getChannelMessages: async (channelId: string): Promise<PaginatedResponse<FullModel<Message>>> => {
    try {
      const response = await axios.get<PaginatedResponse<FullModel<Message>>>(`${endpoint}${apiPaths.channelMessages(channelId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch messages for channel with ID ${channelId}`);
    }
  },

  /**
   * Retrieves a single message by its ID.
   * @param messageId - The ID of the message to fetch.
   * @returns A promise that resolves to an API response containing the message with its details.
   * @throws Error with a descriptive message if the request fails.
   */
  getMessageById: async (messageId: string): Promise<FullModel<Message>> => {
    try {
      const response = await axios.get<FullModel<Message>>(`${endpoint}${apiPaths.message(messageId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch message with ID ${messageId}`);
    }
  },

  /**
   * Edits a message in a channel.
   * @param updateData - The data to update on the message, including serverId, channelId, and messageId.
   * @returns A promise that resolves to an API response containing the updated message.
   * @throws Error with a descriptive message if the request fails.
   */
  editChannelMessage: async (updateData: UpdateMessagePayload): Promise<FullModel<Message>> => {
    try {
      const response = await axios.patch<FullModel<Message>>(
        `${endpoint}${apiPaths.editMessage(updateData.serverId, updateData.channelId, updateData.messageId)}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to edit message with ID ${updateData.messageId}`);
    }
  },

  /**
   * Deletes a message in a channel.
   * @param deleteData - The data identifying the message to delete, including serverId, channelId, and messageId.
   * @returns A promise that resolves to an API response when the message is successfully deleted.
   * @throws Error with a descriptive message if the request fails.
   */
  deleteChannelMessage: async (deleteData: DeleteMessagePayload): Promise<void> => {
    try {
      const response = await axios.delete<void>(
        `${endpoint}${apiPaths.deleteMessage(deleteData.serverId, deleteData.channelId, deleteData.messageId)}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to delete message with ID ${deleteData.messageId}`);
    }
  },

  /**
   * Retrieves all members for a specific server.
   * @param serverId - The ID of the server to fetch members from.
   * @returns A promise that resolves to an API response containing a paginated list of server members.
   * @throws Error with a descriptive message if the request fails.
   */
  getServerMembers: async (serverId: string): Promise<PaginatedResponse<FullModel<ServerMember>>> => {
    try {
      const response = await axios.get<PaginatedResponse<FullModel<ServerMember>>>(`${endpoint}${apiPaths.serverMembers(serverId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch members for server with ID ${serverId}`);
    }
  },

  /**
   * Updates an existing channel in a server.
   * @param serverId - The ID of the server containing the channel.
   * @param channelId - The ID of the channel to update.
   * @param updateData - The data to update on the channel.
   * @returns A promise that resolves to an API response containing the updated channel.
   * @throws Error with a descriptive message if the request fails.
   */
  updateChannel: async (serverId: string, channelId: string, updateData: UpdateChannelData): Promise<FullModel<Channel>> => {
    try {
      const response = await axios.patch<FullModel<Channel>>(`${endpoint}${apiPaths.channel(channelId)}`, updateData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to update channel with ID ${channelId}`);
    }
  },

  /**
   * Deletes a channel from a server.
   * @param serverId - The ID of the server containing the channel.
   * @param channelId - The ID of the channel to delete.
   * @returns A promise that resolves to an API response when the channel is successfully deleted.
   * @throws Error with a descriptive message if the request fails.
   */
  deleteChannel: async (serverId: string, channelId: string): Promise<void> => {
    try {
      const response = await axios.delete<void>(`${endpoint}${apiPaths.channel(channelId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to delete channel with ID ${channelId}`);
    }
  },
  deleteMembers: async (serverId: string, members: string[]): Promise<void> => {
    try {
      const response = await axios.post<void>(`${endpoint}${apiPaths.deleteServerMembers(serverId)}`, {members});
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to delete members with IDs ${members}`);
    }
  }
};