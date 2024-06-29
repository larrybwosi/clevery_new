import { Message, User} from "@/types";
import { uploadImage } from "./general";
import axios from 'axios'
import { endpoint } from "../env";

interface conversation{
  _createdAt:string,
  _id:string,
  messages:Message[]
}

export const getConversation=async({
  friendId
}:{friendId:string}): Promise<conversation>=> {
  try {
    const response = await axios.post(`${endpoint}conversations?friendid=${friendId}`)
    return response.data
  } catch (error:any) {
    console.log(error.message)
    throw error
  }
}
export const getConversations=async(): Promise<User[]>=> {
  try {
    const response = await axios.get(`${endpoint}conversations`)
    return response.data
  } catch (error:any) {
    console.log(error.message)
    throw error
  }
}

export async function sendMessage(conversationId: string, message: {
  image?: string;
  caption: string;
}): Promise<any> {
  if (!conversationId) {
    throw new Error('SenderId and conversationId are required');
  }
  
  if (message.image) {
    const image = await uploadImage(message.image);
    message.image= image
  }
  try {
    const response = await axios.post(`${endpoint}/conversations/${conversationId}/messages`,message);
    return response.data;
  } catch (error:any) {
    console.error('Error sending message:', error.message);
    throw new Error('Error sending message.');
  }

}

export const getMessages=async(
  {
    convId,
    page
  }:{convId:string,page:number}): Promise<Message[]>=> {

    try {
      const response = await axios.post(`${endpoint}/conversations/${convId}/messages?page=${page}`);
      return response.data;
    } catch (error:any) {
      console.error('Error fetching messages:', error.message);
      throw new Error('Error fetching messages.');
    }
}

 
export const createCommunity = async (communityId:string) => {
  try {

    return ;
  } catch (error) {
    console.error('Error creating Community:', error);
  }
};

export const sendCommunityMessage = async (communityId:any, messageId:string ) => {
  try {
    
  } catch (error) {
    console.error(error);
  }
};
export const sendGroupMessage = async (message: { groupId:string, text:string, senderId:any }) => {
  try {

  } catch (error) {
    console.error(error);
  }
};

export async function fetchGroupMessages(id:string) {
  try {
    
    return 
  } catch (error) {
    console.error('Error fetching group messages:', error);  
    return[]
  }
}

export const fetchGroups = async () => {
  try {
    
    return 
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

export const getGroupById = async (groupId:string):Promise<any> => {
  try {
    return []
  } catch (error:any) {
    console.error('Error fetching groups:', error);
    throw error.message
  }
};
