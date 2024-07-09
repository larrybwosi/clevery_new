import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { Channel, NewChannel, NewChannelMessage, NewMessage, NewPost, NewServer, NewUser, UserUpdate, channelMessage, newChannel} from "@/types";
import { sendMessage,fetchGroupMessages, fetchGroups,getConversation,getGroupById,sendGroupMessage, getConversations } from "@/lib/api/conversation";
import { createPost, deletePost,getInfinitePosts, getPostById, getTopCreators, getUserPosts, handleComment, likePost, savePost,updatePost } from "@/lib/api/posts";
import { addFriend,createEmailUser,getGallery,getUserById, getUserFriends, getUsers, updateUser } from "@/lib/api/users";
import { createChannel, createServer, getChannelById, getChannelMessages, getServerById, getServers, getTopServers, sendChannelMessage } from "@/lib/api/server";
import { getBannerImages } from "@/lib/api/general";
import { endpoint } from "@/lib/env";
import axios from "axios";
import { searchAll, searchPosts, searchUsers } from "@/lib/api/search";


// ============================================================
// POST QUERIES
// ============================================================

export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage:any) => {
      if (lastPage?.length < 8) {
        return ;
      }
      return lastPage?.length;
    },
    initialPageParam: null,
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
  });
};

export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: NewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post:{id:string,caption:string,tags:string,images?:string[] }) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
    },
  });
};

export const useGetTopCreators =(num?:number)=>{
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TOP_CREATORS],
    queryFn: ()=>getTopCreators(num),
  });
}

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => likePost({postId, userId}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?._id],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
export const useCommentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentObj:{postid:string,userid:string,comment:string}) =>
      handleComment(commentObj),
    onSuccess: (postid) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID,postid],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: string}) =>
      deletePost(postId),
    onSuccess: (data:any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?._id],
      });
    },
  });
};

// ============================================================
// USER QUERIES
// ============================================================

export const useCreateEmailUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ( user:NewUser) =>createEmailUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?._id!],
      });
    },
  });
};

export const useGetUsers = (page?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(page),
  });
};

export const useGetUserFriends=(userId:string)=> {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_USER_FRIENDS,userId],
    queryFn:()=> getUserFriends(userId)
  })
}

export const useAddFriend=()=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:(data:string)=> addFriend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FRIENDS],
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CONVERSATIONS],
      })
    },
  })
}

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: userId.length > 0,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ( updatedFields:UserUpdate) => updateUser(updatedFields),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?._id],
      });
    },
  });
};

  
export const useGetGroupMessages = (conversationId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GROUPMESSAGES_BY_IDS,conversationId],
    queryFn: () => fetchGroupMessages(conversationId),
  });
};

export const useGetGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMUNITIES],
    queryFn: () => fetchGroups(),
  });
};

export const useGeGroupById = (groupId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMUNITIES, groupId],
    queryFn: () => getGroupById(groupId),
  });
};

export const useSendGroupMessage = () => {
  return useMutation({
    mutationFn: (message: { groupId:string, text:string, senderId:any }) =>
    sendGroupMessage(message),
  });
};


export const useGetBannerImages = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_BANNERS],
    queryFn: () => getBannerImages(),
  });
};

export const useGetUserGallery =(userid:string)=> {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_USER_GALLERY],
    queryFn:() => getGallery(userid)
  })
}

//====================================
//USER MESSAGES=======================
//====================================

export const useSendUserMessage = (frienid:string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { conversationId: string, message:NewMessage}) => sendMessage(data.conversationId, data.message),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_MESSAGES, frienid],
      }); 
    },
    mutationKey: [QUERY_KEYS.SEND_MESSAGE_ID],
  });
  
};

export const useGetInfiniteMessages=({convId}:{convId:string})=>{
  return useInfiniteQuery({
    queryKey:[QUERY_KEYS.GET_INFINITE_USER_MESSAGES, convId],
    queryFn:async ({ pageParam = 0 }) => {
      const response = await axios.post(`${endpoint}/conversations/infinite/${convId}/${pageParam}`);
      return response.data;
    },

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.length < 9) {
        return undefined;
      }
      return allPages?.length;
    },
      initialPageParam: 0,
      enabled: !!convId
    }
  );
}

export const useGetConversation = (friendId:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_MESSAGES,friendId],
    queryFn: () => getConversation(friendId),
    retryDelay:3
  });
};
export const useGetConversations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CONVERSATIONS],
    queryFn: () => getConversations(),
  });
};


//====================================
// SERVER QUERRIES
//====================================

export const useCreateServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (server: NewServer) => createServer(server),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SERVERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SERVER_BY_ID,data?._id],
      });
    },
  });
};

export const useGetServers = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_SERVERS],
    queryFn:  getServers as any,
    initialPageParam:null,
    getNextPageParam: (lastPage:any) =>
    lastPage.nextCursor,
  getPreviousPageParam: (firstPage:any) =>
    firstPage.prevCursor,
  });
};

export const useGetServerById = (serverId:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SERVER_BY_ID,serverId],
    queryFn:()=> getServerById(serverId),
    enabled: !!serverId,
  });
};

export const useGetTopServers=()=>{
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TOP_SERVERS],
    queryFn: ()=>getTopServers(),
  });
}

//=====================================
// CHANNEL QUERRIES
//=====================================

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ( channel :NewChannel ) => createChannel( channel ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SERVERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SERVER_BY_ID,data?._id],
      });
    },
  });
};

export const useGetChannelById = (channelId:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHANNEL_BY_ID,channelId],
    queryFn:()=> getChannelById(channelId),
    enabled:channelId.length>0
  });
};
export const useGetChannelMessages = (channelId:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHANNEL_MESSAGES,channelId],
    queryFn:()=> getChannelMessages(channelId),
    enabled:channelId.length>0
  });
};

export const useSendChannelMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewChannelMessage) => sendChannelMessage(data),
    mutationKey: [QUERY_KEYS.SEND_CHANNEL_MESSAGE],
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHANNEL_BY_ID,data?._id],
      });
    },
  });
  
};

//=====================================
// SEARCH QUERRIES
//=====================================

export const useSearchAll =(searchTerm: string)=>{
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_ALL],
    queryFn: () => searchAll(searchTerm),
    enabled: searchTerm?.length>3
  })
}

export const useSearchUser =(searchTerm: string)=>{
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS],
    queryFn: () => searchUsers(searchTerm),
    enabled:searchTerm?.length>3
  })
}

export const useSearchPosts =(searchTerm: string)=>{
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS],
    queryFn: () => searchPosts(searchTerm),
    enabled:searchTerm?.length>3
  })
}



