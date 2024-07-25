import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { endpoint } from "@/lib/env";
import axios from "axios";
import { postsApi } from "../actions/posts";
import { userApi } from "../actions/users";
import { CreateChannel, CreateServer, Message, UpdateUser } from "@/validations";
import { conversationApi } from "../actions/conversations";
import { ChannelMessagePayload, serverApi } from "../actions/servers";
import searchApi from "../actions/search";


// ============================================================
// POST QUERIES
// ============================================================

export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: postsApi.getPosts as any,
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
    queryFn: () => postsApi.getPostById(postId),
  });
};

export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => postsApi.getPostsByAuthorId(userId),
    enabled: !!userId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post:any ) => postsApi.createPost(post),
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
    mutationFn: (post:{id:string,caption:string,tags:string[],images?:string[] }) => postsApi.updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
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
    queryFn: ()=>userApi.getTopCreators(num),
  });
}

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
    }: {
      postId: string;
    }) => postsApi.likePost(postId),
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
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: {  postId: string }) =>
      postsApi.savePost( postId),
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
    mutationFn: (commentObj:{postId:string,userid:string,comment:string}) =>
      postsApi.commentPost(commentObj),
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
      postsApi.deletePost(postId),
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
    queryFn: () => userApi.getUsers(page),
  });
};

export const useAddFriend=()=> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:(data:string)=> userApi.addFriend(data),
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
    queryFn: () => userApi.getUserById(userId),
    enabled: userId.length > 0,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ( updatedFields:UpdateUser) => userApi.updateCurrentUser(updatedFields),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.id],
      });
    },
  });
};

  

export const useGetBannerImages = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_BANNERS],
    queryFn: () => {},
  });
};

//====================================
//USER MESSAGES=======================
//====================================

export const useSendUserMessage = (frienid:string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Message ) => conversationApi.sendMessage(data),
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

export const useGetConversation = (id:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_MESSAGES,id],
    queryFn: () => conversationApi.getConversation(id),
    retryDelay:3
  });
};
export const useGetConversations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CONVERSATIONS],
    queryFn: () => conversationApi.getConversations(),
  });
};


//====================================
// SERVER QUERRIES
//====================================

export const useCreateServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (server: CreateServer) => serverApi.createServer(server),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SERVERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SERVER_BY_ID,data?.id],
      });
    },
  });
};

export const useGetServers = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_SERVERS],
    queryFn:  serverApi.getAllServers as any,
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
    queryFn:()=> serverApi.getServerById(serverId),
    enabled: !!serverId,
  });
};

export const useGetTopServers=()=>{
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TOP_SERVERS],
    queryFn: ()=> serverApi.getTopServers(),
  });
}

//=====================================
// CHANNEL QUERRIES
//=====================================

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ( data:{serverId: string, channelData: CreateChannel} ) => serverApi.createChannel( data.serverId, data.channelData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SERVERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SERVER_BY_ID,data?.id],
      });
    },
  });
};

export const useGetChannelById = (channelId:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHANNEL_BY_ID,channelId],
    queryFn:()=> serverApi.getChannelById(channelId),
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
    mutationFn: (data: ChannelMessagePayload) => serverApi.sendChannelMessage(data),
    mutationKey: [QUERY_KEYS.SEND_CHANNEL_MESSAGE],
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHANNEL_BY_ID,data?.id],
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
    queryFn: () => searchApi.search(searchTerm),
    enabled: searchTerm?.length>3
  })
}

export const useSearchUser =(searchTerm: string)=>{
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS],
    queryFn: () => searchApi.searchUsers(searchTerm),
    enabled:searchTerm?.length>3
  })
}

export const useSearchPosts =(searchTerm: string)=>{
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS],
    queryFn: () => searchApi.searchPosts(searchTerm),
    enabled:searchTerm?.length>3
  })
}



