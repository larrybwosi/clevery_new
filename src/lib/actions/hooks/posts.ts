import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  useInfiniteQuery
} from '@tanstack/react-query';
import { postsApi } from '@/lib/actions/posts';
import { CreatePostData, Post, PostQuery } from '@/types';

export const queryKeys = {
  posts: ['posts'],
  topPosts: ['topPosts'],
  post: (id: string) => ['post', id],
  authorPosts: (authorId: string) => ['posts', 'author', authorId],
};

 export const usePosts = (params?: Omit<PostQuery, 'page'>) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.posts, params],
    queryFn: ({ pageParam = 1 }) => postsApi.getPosts({ ...params!, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.length === params?.limit ? nextPage : undefined;
    },
    initialPageParam: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
};

export const useTopPosts = () => {
  return useQuery({
    queryKey: queryKeys.topPosts,
    queryFn: postsApi.getTopPosts
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postData: CreatePostData) => 
      postsApi.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.posts});
    }
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: queryKeys.post(postId),
    queryFn: () => postsApi.getPostById(postId),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!postId
  });
};

export const useAuthorPosts = (authorId: string) => {
  return useQuery({
    queryKey: queryKeys.authorPosts(authorId),
    queryFn: () => postsApi.getPostsByAuthorId(authorId)
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postData: Partial<Omit<Post, 'authorId' | 'createdAt' | 'updatedAt'>>) => 
      postsApi.updatePost(postData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: queryKeys.post(data.id)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts});
    }
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.likePost(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: queryKeys.post(data.id)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts});
    }
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.savePost(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: queryKeys.post(data.id)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts});
    }
  });
};

export const useCommentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentObj: { postId: string; comment: string,parentId?:string }) => 
      postsApi.commentPost(commentObj),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: queryKeys.post(data.id)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts});
    }
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => postsApi.likeComment(commentId),
    onSuccess: (data:any) => {
      queryClient.invalidateQueries({queryKey: queryKeys.post(data.postId)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts});
    }
  });
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.deletePost(postId),
    onSuccess: (_, postId) => {
      queryClient.removeQueries({queryKey: queryKeys.post(postId)});
      queryClient.invalidateQueries({queryKey: queryKeys.posts});
    }
  });
};
