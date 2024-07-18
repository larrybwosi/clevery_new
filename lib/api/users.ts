import axios from "axios";

import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { NewUser, User, UserUpdate } from "@/types";
import { endpoint } from "@/lib/env";

export const getUserById = async (id:string) => {
  try {
    const result = (await axios.get(`${endpoint}/users/${id}`)) 
    return result.data
  } catch (error:any) {
    console.log(error.message)
  }
};

export const getCurrentUser =async()=> {
  const token = await registerForPushNotificationsAsync()
  try {
    const currentUser = await axios.get(`${endpoint}/profile?notificaion_token=${token}`)
    return currentUser.data
    
  } catch (error:any) {
    console.log(error.message)
  }
}

export const createEmailUser = async (user:NewUser) => { 
  try {
    user.notification_token = await registerForPushNotificationsAsync()
    const response = axios.post(`${endpoint}/sign-up`,user) 
    console.log( response);
    const res = (await response)
    console.log(res)
    return (await response).data
    
  } catch (error:any) {
    console.log(error.message)
  }
}; 

export const getUsers = async (page = 1):Promise<User[]> => { 
  try {
    const response = await axios.get(`${endpoint}/users?page=${page}`);
    return response.data 
    
  } catch (error:any) {
    console.log(error.message)
    return []
  }
}
  
export const getUserFriends = async (userId:string) => {
  try {
    const response = await axios.post(`${endpoint}/users/friends?userId=${userId}`);
    return response.data 
    
  } catch (error:any) {
    console.log(error.message)
  }
};

export async function addFriend(friendId:string) {
  try {
    const response = await axios.post(`${endpoint}/users/profile/friends`,{friendId})
    console.log(response)
    return response
  } catch (error) {
    console.log(error);
  }
}

export const updateUser = async (userupdate:UserUpdate) => {
  try {
    const result = await axios.put(`${endpoint}/users/${userupdate.id}`, userupdate)
    return result.data
  }catch (error) {
    console.log(error);
  }
};
   
export const getGallery = async (id:string) => { 
  try {
    const response = await axios.get(`${endpoint}/users/${id}/gallery`);
    return response.data
  } catch (error) {
    console.log('Error fetching gallery:', error);
  }
};

export async function sendFriendRequest({currentUserId, recipientId}: {currentUserId:string, recipientId: string}) {
  try {
    const response = await axios.post(`${endpoint}/users/sendfriendrequest`, {currentUserId, recipientId});
    return response.data
  } catch (error) {
    console.log('Error sending friend request:', error);
  }
}
