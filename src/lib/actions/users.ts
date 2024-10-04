import axios from "axios";
import { userPaths as apiPaths } from "@/routes";
import { Profile } from "@/lib/zustand/store";
import { handleApiError } from "./error";
import { endpoint } from "@/lib/env";
import { User } from "@/types";
import { registerForPushNotificationsAsync } from "../notifications";

type UserDetailsResponse = User & {
  commonFriends: Array<{ id: string; name: string; image: string }>;
  commonServers: Array<{ id: string; name: string; image: string | null }>;
  isFriend: boolean;
};
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'bannerImage' | 'bio' | 'password' | 'emailVerified' | 'phone'>;
export type UpdateUserInput = Partial<CreateUserInput>;


// Users API
export const userApi = {
  /**
   * Retrieves the current user's details.
   * @returns A promise that resolves to the API response containing the current user's details.
   * @throws Error with a descriptive message if the request fails
   */
  getCurrentUser: async (): Promise<Profile> => {
    try {
      const token = await registerForPushNotificationsAsync();
      const response = await axios.get<Profile>(`${endpoint}${apiPaths.currentUser}?notification_token=${token}&activity=false`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch current user");
    }
  },
  getCurrentUserWithActivity: async (): Promise<Profile> => {
    try {
      const response = await axios.get<Profile>(`${endpoint}${apiPaths.currentUser}/activity`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch current user");
    }
  },

  /**
   * Gets all the users
   * @param page - The page number to fetch. Defaults to 1.
   * @returns A promise that resolves to the API response containing an array of all the users
   * @throws Error with a descriptive message if the request fails
   */
  getUsers: async (page = 1): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(`${endpoint}${apiPaths.users}?page=${page}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch users");
    }
  }, 

  /**
   * Gets the top creators
   * @param limit - The number of top creators to retrieve. Defaults to 3.
   * @returns A promise that resolves to the API response containing an array of top creators.
   * @throws Error with a descriptive message if the request fails
   */
  getTopCreators: async (limit = 3): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(`${endpoint}${apiPaths.topCreators}`, {
        params: { limit },
      });
      return response.data
    } catch (error) {
      throw handleApiError(error, "Failed to fetch top creators");
    }
  },

  /**
   * Retrieves a user by their ID, including common friends and servers.
   * @param userId - The ID of the user to fetch.
   * @returns A promise that resolves to the API response containing the user's details, including common connections.
   * @throws Error with a descriptive message if the request fails
   */
  getUserById: async (userId: string): Promise<UserDetailsResponse> => {
    try {
      const response = await axios.get<UserDetailsResponse>(`${endpoint}${apiPaths.user(userId)}`);
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
   * @returns A promise that resolves to the API response containing the updated user details.
   * @throws Error with a descriptive message if the request fails
   */
  updateCurrentUser: async (userData: UpdateUserInput): Promise<Profile> => {
    try {
      const response = await axios.patch<Profile>(`${endpoint}${apiPaths.currentUser}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update user");
    }
  },

  /**
   * Adds a friend to the current user's friend list.
   * @param friendId - The ID of the user to add as a friend.
   * @returns A promise that resolves to the API response when the friend is added successfully.
   * @throws Error with a descriptive message if the request fails
   */
  addFriend: async (friendId: string): Promise<User[]> => {
    try {
      const response = await axios.post<User[]>(`${endpoint}${apiPaths.friends}`, { friendId });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to add friend");
    }
  },

  /**
   * Removes a friend from the current user's friend list.
   * @param friendId - The ID of the user to remove from the friend list.
   * @returns A promise that resolves to the API response when the friend is removed successfully.
   * @throws Error with a descriptive message if the request fails
   */
  removeFriend: async (friendId: string): Promise<void> => {
    try {
      const response = await axios.delete<void>(`${endpoint}${apiPaths.friend(friendId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to remove friend");
    }
  },

  /**
   * Retrieves the current user's friend list.
   * @returns A promise that resolves to the API response containing an array of the user's friends.
   * @throws Error with a descriptive message if the request fails
   */
  getFriends: async (): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(`${endpoint}${apiPaths.friends}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch friends");
    }
  },

  /**
   * Deletes the current user's account.
   * @returns A promise that resolves to the API response when the account is successfully deleted.
   * @throws Error with a descriptive message if the request fails
   */
  deleteAccount: async (): Promise<void> => {
    try {
      const response = await axios.delete<void>(`${endpoint}${apiPaths.currentUser}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to delete account");
    }
  },

  /**
   * Updates the current user's profile picture.
   * @param imageFile - The new profile picture file.
   * @returns A promise that resolves to the API response containing the updated user details.
   * @throws Error with a descriptive message if the request fails
   */
  updateProfilePicture: async (imageFile: File): Promise<User> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await axios.put<User>(`${endpoint}${apiPaths.profilePicture}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update profile picture");
    }
  },

  /**
   * Retrieves the servers that the current user is a member of.
   * @returns A promise that resolves to the API response containing an array of server details.
   * @throws Error with a descriptive message if the request fails
   */
  getUserServers: async (): Promise<Array<{ id: string; name: string; image: string | null }>> => {
    try {
      const response = await axios.get<Array<{ id: string; name: string; image: string | null }>>(`${endpoint}${apiPaths.userServers}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch user servers");
    }
  },

  /**
   * Searches for users based on a query string.
   * @param query - The search query string.
   * @returns A promise that resolves to the API response containing an array of matching user details.
   * @throws Error with a descriptive message if the request fails
   */
  searchUsers: async (query: string): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(`${endpoint}${apiPaths.searchUsers}`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to search users");
    }
  }
};