import axios from "axios";
import { CreatePostData, Post, PostQuery, User } from "@/types";
import { postsPaths as apiPaths } from "@/routes";
import { UserSchema } from "@/validations"; 
import { handleApiError } from "./error";
import { endpoint } from "@/lib/env";

type FullModel<T> = T & { id: string; createdAt: Date; updatedAt: Date };

// Posts API Types
type UpdatePostData = Partial<Omit<Post, 'authorId' | 'createdAt' | 'updatedAt' | 'author' |'comments'>>;

export const userSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true, bannerImage: true, bio: true, phone: true });

// Posts API
export const postsApi = {
  /**
   * Fetches posts with pagination, search, and filter options
   * @param params - Query parameters for fetching posts
   * @returns A promise that resolves to the API response containing fetched posts and metadata
   * @throws Error with a descriptive message if the request fails
   */
  getPosts: async (params?: PostQuery): Promise<FullModel<Post>[]> => {
    try {
      // const queryString = new URLSearchParams(params as Record<number, string>).toString();
      // ?${queryString}
      const response = await axios.get<FullModel<Post>[]>(`${endpoint}${apiPaths.getPosts}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch posts");
    }
  },

  /**
   * Get Top Posts
   * @returns A promise that resolves to the API response containing fetched top posts
   * @throws Error with a descriptive message if the request fails
   */
  getTopPosts: async (): Promise<FullModel<Post>[]> => {
    try {
      const response = await axios.get<FullModel<Post>[]>(`${endpoint}${apiPaths.getTopPosts}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch top posts");
    }
  },

  /**
   * Creates a new post
   * @param postData - The data for the new post
   * @returns A promise that resolves to the API response containing the created post
   * @throws Error with a descriptive message if the request fails
   */
  createPost: async (postData: CreatePostData): Promise<FullModel<Post>> => {
    try {
      const response = await axios.post<FullModel<Post>>(`${endpoint}${apiPaths.createPost}`, postData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create post");
    }
  },

  /**
   * Fetches a single post by its ID
   * @param postId - The ID of the post to fetch
   * @returns A promise that resolves to the API response containing the fetched post
   * @throws Error with a descriptive message if the request fails
   */
  getPostById: async (postId: string): Promise<FullModel<Post>> => {
    try {
      const response = await axios.get<FullModel<Post>>(`${endpoint}${apiPaths.getPostById(postId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch post with ID ${postId}`);
    }
  },

  /**
   * Fetches posts by author ID
   * @param authorId - The ID of the author whose posts to fetch
   * @returns A promise that resolves to the API response containing the fetched posts
   * @throws Error with a descriptive message if the request fails
   */
  getPostsByAuthorId: async (authorId: string): Promise<FullModel<Post>[]> => {
    try {
      const response = await axios.get<FullModel<Post>[]>(`${endpoint}${apiPaths.getPostsByAuthorId(authorId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to fetch posts with author ID ${authorId}`);
    }
  },

  /**
   * Updates an existing post
   * @param postData - The updated data for the post
   * @returns A promise that resolves to the API response containing the updated post
   * @throws Error with a descriptive message if the request fails
   */
  updatePost: async (postData: UpdatePostData): Promise<FullModel<Post>> => {
    try {
      const response = await axios.patch<FullModel<Post>>(`${endpoint}${apiPaths.updatePost(postData.id as string)}`, postData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to update post with ID ${postData.id}`);
    }
  },

  /**
   * Likes a post
   * @param postId - The ID of the post to like
   * @returns A promise that resolves to the API response containing the updated post
   * @throws Error with a descriptive message if the request fails
   */
  likePost: async (postId: string): Promise<FullModel<Post>> => {
    try {
      const response = await axios.post<FullModel<Post>>(`${endpoint}${apiPaths.interactPost(postId)}`, { action: 'like' });
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to like post with ID ${postId}`);
    }
  },

  /**
   * Saves a post
   * @param postId - The ID of the post to save
   * @returns A promise that resolves to the API response containing the updated post
   * @throws Error with a descriptive message if the request fails
   */
  savePost: async (postId: string): Promise<FullModel<Post>> => {
    try {
      const response = await axios.post<FullModel<Post>>(`${endpoint}${apiPaths.interactPost(postId)}`, { action: 'save' });
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to save post with ID ${postId}`);
    }
  },

  /**
   * Comments on a post
   * @param commentObj - Object containing postId and comment text
   * @returns A promise that resolves to the API response containing the updated post
   * @throws Error with a descriptive message if the request fails
   */
  commentPost: async (commentObj: { postId: string; comment: string }): Promise<FullModel<Post>> => {
    try {
      const response = await axios.post<FullModel<Post>>(`${endpoint}${apiPaths.interactPost(commentObj.postId)}`, {
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
   * @returns A promise that resolves to the API response when the post is deleted
   * @throws Error with a descriptive message if the request fails
   */
  deletePost: async (postId: string): Promise<void> => {
    try {
      const response = await axios.delete<void>(`${endpoint}${apiPaths.deletePost(postId)}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, `Failed to delete post with ID ${postId}`);
    }
  },
};