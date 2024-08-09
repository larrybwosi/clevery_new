import axios from 'axios';
import { Conversation, Message, SendMessageData } from '@/types';
import { endpoint } from '@/lib/env';
import { handleApiError } from './error';
import { conversationPaths as apiPaths } from '@/routes';
export interface SendMessagePayload {
  conversationId: string;
  message: SendMessageData
}

export interface SendUpdateMessagePayload {
  conversationId: string;
  messageId: string;
  message: Omit<Message, 'createdAt' | 'updatedAt'>;
}

/**
 * API client for conversation-related operations.
 */
export const conversationApi = {
  /**
   * Gets or creates a conversation with another user.
   * @param otherUserId - The ID of the user to start/get a conversation with.
   * @returns A promise that resolves to an array of conversations.
   * @throws Error with a descriptive message if the request fails.
   */
  getCreateConversations: async (otherUserId: string): Promise<Conversation[]> => {
    try {
      const response = await axios.post<Conversation[]>(apiPaths.getCreateConversations, { otherUserId });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to get or create conversation");
    }
  },

  /**
   * Fetches the list of conversations for the current user.
   * @returns A promise that resolves to an array of conversations.
   * @throws Error with a descriptive message if the request fails.
   */
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await axios.post<Conversation[]>(`${endpoint}${apiPaths.getConversations}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch conversations");
    }
  },

  /**
   * Fetches the details of a conversation, including messages.
   * @param conversationId - The ID of the conversation to fetch.
   * @returns A promise that resolves to the conversation details.
   * @throws Error with a descriptive message if the request fails.
   */
  getConversation: async (conversationId: string): Promise<Conversation> => {
    try {
      const response = await axios.get<Conversation>(`${endpoint}${apiPaths.getConversation(conversationId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch conversation with ID ${conversationId}`);
    }
  },

  /**
   *  Gets a list of messages in a conversation.
   * @param conversationId - The ID of the conversation.
   * @param pageParam - The page number to fetch.
   * @returns A promise that resolves to an array of messages.
   * @throws Error with a descriptive message if the request fails.
   */
  getMessages: async (conversationId: string,pageParam?: number): Promise<Message[]> => {
    try {
      const response = await axios.get<Message[]>(`${endpoint}${apiPaths.getConversation(conversationId)}/messages?page=${pageParam}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch messages in conversation with ID ${conversationId}`);
    }
  },

  /**
   * Sends a message in a conversation.
   * @param payload - The message payload containing conversationId and Message.
   * @returns A promise that resolves to the sent message.
   * @throws Error with a descriptive message if the request fails.
   */
  sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
    try {
      const response = await axios.post<Message>(`${endpoint}${apiPaths.sendMessage(payload.conversationId)}`, payload.message);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to send message");
    }
  },

  /**
   * Updates an existing message.
   * @param payload - The updated message data.
   * @returns A promise that resolves to the updated message.
   * @throws Error with a descriptive message if the request fails.
   */
  updateMessage: async (payload: SendUpdateMessagePayload): Promise<Message> => {
    try {
      const response = await axios.patch<Message>(`${endpoint}${apiPaths.updateMessage(payload.conversationId, payload.message.id)}`, payload.message);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to update message with ID ${payload.message.id}`);
    }
  },

  /**
   * Deletes a message.
   * @param conversationId - The ID of the conversation.
   * @param messageId - The ID of the message to delete.
   * @returns A promise that resolves when the message is deleted.
   * @throws Error with a descriptive message if the request fails.
   */
  deleteMessage: async (conversationId: string, messageId: string): Promise<void> => {
    try {
      await axios.delete(`${endpoint}${apiPaths.deleteMessage(conversationId, messageId)}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete message with ID ${messageId}`);
    }
  },

  /**
   * Marks messages as seen.
   * @param conversationId - The ID of the conversation.
   * @param messageIds - An array of message IDs to mark as seen.
   * @returns A promise that resolves when the messages are marked as seen.
   * @throws Error with a descriptive message if the request fails.
   */
  markMessagesAsSeen: async (conversationId: string, messageIds: string[]): Promise<void> => {
    try {
      await axios.post(`${endpoint}${apiPaths.markMessagesAsSeen(conversationId)}`, { messageIds });
    } catch (error) {
      throw handleApiError(error, "Failed to mark messages as seen");
    }
  },

  /**
   * Edits an existing message in a conversation.
   * @param messageId - The ID of the message to edit.
   * @param conversationId - The ID of the conversation.
   * @param editedText - The new text content of the message.
   * @returns A promise that resolves to the edited message.
   * @throws Error with a descriptive message if the request fails.
   */
  editMessage: async (messageId: string, conversationId: string, editedText: string): Promise<Message> => {
    try {
      const response = await axios.put<Message>(`${endpoint}${apiPaths.editMessage(conversationId, messageId)}`, {
        conversationId,
        text: editedText
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to edit message with ID ${messageId}`);
    }
  }
};