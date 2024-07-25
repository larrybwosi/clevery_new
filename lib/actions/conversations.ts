import axios, { AxiosError } from 'axios';
import { Conversation, Message, UpdateMessage } from "@/validations";

const baseUrl = '/api/chat';

interface ApiResponse<T> {
  data: T;
  message: string;
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
      const response = await axios.post<ApiResponse<Conversation[]>>('/api/conversations', { otherUserId });
      return response.data.data;
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
      const response = await axios.get<ApiResponse<Conversation[]>>(`${baseUrl}`);
      return response.data.data;
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
      const response = await axios.get<ApiResponse<Conversation>>(`${baseUrl}/${conversationId}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch conversation with ID ${conversationId}`);
    }
  },

  /**
   * Sends a message in a conversation.
   * @param payload - The message payload containing conversationId and text.
   * @returns A promise that resolves to the sent message.
   * @throws Error with a descriptive message if the request fails.
   */
  sendMessage: async (payload: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> => {
    try {
      const response = await axios.post<ApiResponse<Message>>(`${baseUrl}/messages`, payload);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to send message");
    }
  },

  /**
   * Updates an existing message.
   * @param message - The updated message data.
   * @returns A promise that resolves to the updated message.
   * @throws Error with a descriptive message if the request fails.
   */
  updateMessage: async (message: UpdateMessage): Promise<Message> => {
    try {
      const response = await axios.patch<ApiResponse<Message>>(`${baseUrl}/messages/${message.id}`, message);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, `Failed to update message with ID ${message.id}`);
    }
  },

  /**
   * Deletes a message.
   * @param messageId - The ID of the message to delete.
   * @returns A promise that resolves when the message is deleted.
   * @throws Error with a descriptive message if the request fails.
   */
  deleteMessage: async (messageId: string): Promise<void> => {
    try {
      await axios.delete(`${baseUrl}/messages/${messageId}`);
    } catch (error) {
      throw handleApiError(error, `Failed to delete message with ID ${messageId}`);
    }
  },

  /**
   * Marks messages as seen.
   * @param messageIds - An array of message IDs to mark as seen.
   * @returns A promise that resolves when the messages are marked as seen.
   * @throws Error with a descriptive message if the request fails.
   */
  markMessagesAsSeen: async (messageIds: string[]): Promise<void> => {
    try {
      await axios.post(`${baseUrl}/messages/seen`, { messageIds });
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
      const response = await axios.put<ApiResponse<Message>>(`${baseUrl}/messages/${messageId}`, {
        conversationId,
        text: editedText
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, `Failed to edit message with ID ${messageId}`);
    }
  }
};

/**
 * Handles API errors and returns a more informative error message
 * @param error - The error object from the API call
 * @param defaultMessage - A default message to use if a more specific one can't be determined
 * @returns An Error object with a descriptive message
 */
function handleApiError(error: unknown, defaultMessage: string): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response) {
      return new Error(axiosError.response.data.message || `${defaultMessage}: ${axiosError.response.status}`);
    } else if (axiosError.request) {
      return new Error(`${defaultMessage}: No response received`);
    }
  }
  return new Error(defaultMessage);
}