import { NewPost} from "@/types";
import axios from "axios";
import { endpoint } from "../env";
import { uploadImages } from "./general";


  export async function getTopCreators(numCreators = 3){
    try {
      const response = await axios.get(`${endpoint}/posts/topcreators/${numCreators}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  export const createPost =async(post:NewPost)=>{
    if (post.files?.length > 0) {
      const imageAssets = await uploadImages(post.files);
      if(!imageAssets) return
      post.files = imageAssets;
    } 
    try {
      const response = await axios.post(`${endpoint}/posts`, post)
      return response.data
    } catch (error:any) {
      console.log(error.message)
    }
  }

  export const getPostById = async (postId:string)=> {
    try {
      console.log(postId)
      const response = await axios.get(`${endpoint}/posts/${postId}`)
      return response.data; 
    } catch (error:any) {
      console.log(error.message)
    }
  }
  
  export const getInfinitePosts = async ({page=1}) => {
    try {
      const response = await axios.get(`${endpoint}posts/?page=${page}`)
      return response.data
    } catch (error:any) {
      console.log(error.message)
      throw error
    }
  }
  
  export const getUserPosts = async (authorId:string) => {
    try {
      const response = await axios.get(`${endpoint}/posts/author/${authorId}`)
      return response.data;
    } catch (error:any) {
      console.log(error.message)
      throw error
    }
  };

  export const handleComment = async (commentObj:{postid:string,userid:string,comment:string}) => {
    try {
      const response = await axios.post(`${endpoint}/posts/${commentObj.postid}/comment`, commentObj)
      return response.data
    } catch (error:any) {
      console.log(error.message)
      throw error
    }
  };
  
  export const likePost = async ({postId}:{postId: string, userId: string}) => {
    try {
       const response = await axios.post(`${endpoint}/posts/${postId}/like`, )
       console.log(response.data)
       return response.data
      } catch (error:any) {
        console.log(error.message)
        throw error
      }
  };

  export const savePost = async (postId: string, userId: string) => {
    try {
      const response = await axios.post(`${endpoint}/posts/${postId}/bookmark`, {userId})
      return response.data
    } catch (error:any) {
      console.log(error.message)
      throw error
    }
  };

  export const deletePost = async (postId: string) => {
    try {
      const response = await axios.delete(`${endpoint}/posts/${postId}`)
      return response.data
    } catch (error:any) {
      console.log(error.message)
      throw error
    }

  };

  export const updatePost = async ({id, caption, tags, images }:{id:string,caption:string,tags:string,images?:string[] }) => {
    try {
      const response = await axios.patch(`${endpoint}/posts/${id}`, {caption, tags, images })
      return response.data
    } catch (error) {
      console.error(error);
      throw error
    }
  };
