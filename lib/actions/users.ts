import { TopCreator, TopCreatorSchema, UpdateUser, User, UserSchema } from "@/validations";
import axios, { AxiosError } from "axios";
import { z } from "zod";

type UserResponse = Omit<User, 'password'>;
type UserDetailsResponse = UserResponse & {
  commonFriends: Array<{ id: string; name: string; image: string }>;
  commonServers: Array<{ id: string; name: string; image: string | null }>;
  isFriend: boolean;
};

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'bannerImage' | 'bio' | 'password' | 'emailVerified' | 'phone'>;
export type UpdateUserInput = Partial<CreateUserInput>;

export const userSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true, bannerImage: true, bio: true, phone: true });

const baseUrl = '/api/';

/**
 * API client for user-related operations.
 */
export const userApi = {
  /**
   * Retrieves the current user's details.
   * @returns A promise that resolves to the current user's details.
   * @throws Error with a descriptive message if the request fails
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    try {
      const response = await axios.get<UserResponse>(`${baseUrl}users/me`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch current user");
    }
  },

  /**
   * Gets all the users
   * @returns A promise that resolves to an array of all the users
   * @throws Error with a descriptive message if the request fails
   */
  getUsers: async (page = 1): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(`${baseUrl}users?page=${page}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch users");
    }
  },

  /**
   * Gets the top creators
   * @param limit - The number of top creators to retrieve. Defaults to 3.
   * @returns A promise that resolves to an array of top creators.
   * @throws Error with a descriptive message if the request fails
   */
  getTopCreators: async (limit = 3): Promise<TopCreator[]> => {
    try {
      const response = await axios.get<TopCreator[]>(`${baseUrl}users/creators`, {
        params: { limit },
      });
      return z.array(TopCreatorSchema).parse(response.data);
    } catch (error) {
      throw handleApiError(error, "Failed to fetch top creators");
    }
  },

  /**
   * Retrieves a user by their ID, including common friends and servers.
   * @param userId - The ID of the user to fetch.
   * @returns A promise that resolves to the user's details, including common connections.
   * @throws Error with a descriptive message if the request fails
   */
  getUserById: async (userId: string): Promise<UserDetailsResponse> => {
    try {
      const response = await axios.get<UserDetailsResponse>(`${baseUrl}users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw handleApiError(error, `Failed to fetch user with ID ${userId}`);
    }
  },

  /**
   * Updates the current user's details.
   * @param userData - The data to update for the current user.
   * @returns A promise that resolves to the updated user details.
   * @throws Error with a descriptive message if the request fails
   */
  updateCurrentUser: async (userData: UpdateUser): Promise<UserResponse> => {
    try {
      const response = await axios.patch<UserResponse>(`${baseUrl}users/me`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update user");
    }
  },

  /**
   * Adds a friend to the current user's friend list.
   * @param friendId - The ID of the user to add as a friend.
   * @returns A promise that resolves when the friend is added successfully.
   * @throws Error with a descriptive message if the request fails
   */
  addFriend: async (friendId: string): Promise<void> => {
    try {
      await axios.post(`${baseUrl}users`, { friendId });
    } catch (error) {
      throw handleApiError(error, "Failed to add friend");
    }
  },

  /**
   * Removes a friend from the current user's friend list.
   * @param friendId - The ID of the user to remove from the friend list.
   * @returns A promise that resolves when the friend is removed successfully.
   * @throws Error with a descriptive message if the request fails
   */
  removeFriend: async (friendId: string): Promise<void> => {
    try {
      await axios.delete(`${baseUrl}users/friends/${friendId}`);
    } catch (error) {
      throw handleApiError(error, "Failed to remove friend");
    }
  },

  /**
   * Retrieves the current user's friend list.
   * @returns A promise that resolves to an array of the user's friends.
   * @throws Error with a descriptive message if the request fails
   */
  getFriends: async (): Promise<UserResponse[]> => {
    try {
      const response = await axios.get<UserResponse[]>(`${baseUrl}users/friends`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch friends");
    }
  },

  /**
   * Deletes the current user's account.
   * @returns A promise that resolves when the account is successfully deleted.
   * @throws Error with a descriptive message if the request fails
   */
  deleteAccount: async (): Promise<void> => {
    try {
      await axios.delete(`${baseUrl}users/me`);
    } catch (error) {
      throw handleApiError(error, "Failed to delete account");
    }
  },

  /**
   * Updates the current user's profile picture.
   * @param imageFile - The new profile picture file.
   * @returns A promise that resolves to the updated user details.
   * @throws Error with a descriptive message if the request fails
   */
  updateProfilePicture: async (imageFile: File): Promise<UserResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await axios.put<UserResponse>(`${baseUrl}users/me/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update profile picture");
    }
  },

  /**
   * Retrieves the servers that the current user is a member of.
   * @returns A promise that resolves to an array of server details.
   * @throws Error with a descriptive message if the request fails
   */
  getUserServers: async (): Promise<Array<{ id: string; name: string; image: string | null }>> => {
    try {
      const response = await axios.get<Array<{ id: string; name: string; image: string | null }>>(`${baseUrl}users/me/servers`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch user servers");
    }
  },

  /**
   * Searches for users based on a query string.
   * @param query - The search query string.
   * @returns A promise that resolves to an array of matching user details.
   * @throws Error with a descriptive message if the request fails
   */
  searchUsers: async (query: string): Promise<UserResponse[]> => {
    try {
      const response = await axios.get<UserResponse[]>(`${baseUrl}users/search`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to search users");
    }
  },
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