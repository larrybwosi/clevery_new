import { Post, PostQuery } from "@/validations";
import axios, { AxiosError } from "axios";

const baseUrl = 'http://localhost:3000/api/';

interface ApiResponse<T> {
  data: T;
  message: string;
}

export const postsApi = {
  /**
   * Fetches posts with pagination, search, and filter options
   * @param params - Query parameters for fetching posts
   * @returns A promise that resolves to the fetched posts and metadata
   * @throws Error with a descriptive message if the request fails
   */
  getPosts: async (params: PostQuery): Promise<ApiResponse<Post[]>> => {
    try {
      const queryString = new URLSearchParams(params as Record<number, string>).toString();
      const response = await axios.get<ApiResponse<Post[]>>(`${baseUrl}posts/?${queryString}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch posts");
    }
  },

  /**
   * Get Top Posts
   * @returns A promise that resolves to the fetched top posts
   * @throws Error with a descriptive message if the request fails
   */
  getTopPosts: async (): Promise<ApiResponse<Post[]>> => {
    try {
      const response = await axios.get<ApiResponse<Post[]>>(`${baseUrl}posts/top`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch top posts");
    }
  },

  /**
   * Creates a new post
   * @param postData - The data for the new post
   * @returns A promise that resolves to the created post
   * @throws Error with a descriptive message if the request fails
   */
  createPost: async (postData: Omit<Post, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Post>> => {
    try {
      const response = await axios.post<ApiResponse<Post>>(`${baseUrl}posts`, postData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create post");
    }
  },

  /**
   * Fetches a single post by its ID
   * @param postId - The ID of the post to fetch
   * @returns A promise that resolves to the fetched post
   * @throws Error with a descriptive message if the request fails
   */
  getPostById: async (postId: string): Promise<ApiResponse<Post>> => {
    try {
      const response = await axios.get<ApiResponse<Post>>(`${baseUrl}posts/${postId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch post with ID ${postId}`);
    }
  },
/**
 * 
 * @param authorId 
 * @returns 
 */
  getPostsByAuthorId: async (authorId: string): Promise<ApiResponse<Post[]>> => {
    try {
      const response = await axios.get<ApiResponse<Post[]>>(`${baseUrl}posts/author/${authorId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch posts with author ID ${authorId}`);
    }
  },
  /**
   * Updates an existing post
   * @param postData - The updated data for the post
   * @returns A promise that resolves to the updated post
   * @throws Error with a descriptive message if the request fails
   */
  updatePost: async (postData: Partial<Omit<Post, 'authorId' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Post>> => {
    try {
      const response = await axios.patch<ApiResponse<Post>>(`${baseUrl}posts/${postData.id}`, postData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to update post with ID ${postData.id}`);
    }
  },

  /**
   * Likes a post
   * @param postId - The ID of the post to like
   * @returns A promise that resolves to the updated post or comment
   * @throws Error with a descriptive message if the request fails
   */
  likePost: async (postId: string): Promise<ApiResponse<Post>> => {
    try {
      const response = await axios.post<ApiResponse<Post>>(`${baseUrl}posts/${postId}/interact`, { action: 'like' });
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to like post with ID ${postId}`);
    }
  },

  /**
   * Saves a post
   * @param postId - The ID of the post to save
   * @returns A promise that resolves to the updated post or comment
   * @throws Error with a descriptive message if the request fails
   */
  savePost: async (postId: string): Promise<ApiResponse<Post>> => {
    try {
      const response = await axios.post<ApiResponse<Post>>(`${baseUrl}posts/${postId}/interact`, { action: 'save' });
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to save post with ID ${postId}`);
    }
  },

  /**
   * Comments on a post
   * @param commentObj - Object containing postId and comment text
   * @returns A promise that resolves to the updated post or comment
   * @throws Error with a descriptive message if the request fails
   */
  commentPost: async (commentObj: { postId: string; comment: string }): Promise<ApiResponse<Post>> => {
    try {
      const response = await axios.post<ApiResponse<Post>>(`${baseUrl}posts/${commentObj.postId}/interact`, {
        comment: commentObj.comment,
        action: 'comment'
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to comment on post with ID ${commentObj.postId}`);
    }
  },

  /**
   * Deletes a post
   * @param postId - The ID of the post to delete
   * @returns A promise that resolves when the post is deleted
   * @throws Error with a descriptive message if the request fails
   */
  deletePost: async (postId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await axios.delete<ApiResponse<void>>(`${baseUrl}posts/${postId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to delete post with ID ${postId}`);
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