import { 
  useQuery, 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';
import { userApi, UpdateUserInput } from '@/lib/actions/users';

const queryKeys = {
  currentUser: ['currentUser'],
  currentUserWithActivity: ['currentUserWithActivity'],
  users: ['users'],
  topCreators: ['topCreators'],
  user: (id: string) => ['user', id],
  friends: ['friends'],
  userServers: ['userServers'],
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: userApi.getCurrentUser
  });
};
export const useCurrentUserWithActivity = () => {
  return useQuery({
    queryKey: queryKeys.currentUserWithActivity,
    queryFn: userApi.getCurrentUserWithActivity,
    staleTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
};

export const useUsers = (page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.users, page],
    queryFn: () => userApi.getUsers(page)
  });
};

export const useTopCreators = (limit = 3) => {
  return useQuery({
    queryKey: [...queryKeys.topCreators, limit],
    queryFn: () => userApi.getTopCreators(limit)
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => userApi.getUserById(userId)
  });
};

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: UpdateUserInput) => userApi.updateCurrentUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.currentUser});
    }
  });
};

export const useAddFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendId: string) => userApi.addFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.friends});
      queryClient.invalidateQueries({queryKey: ['conversations']});
    }
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendId: string) => userApi.removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.friends});
    }
  });
};

export const useFriends = () => {
  return useQuery({
    queryKey: queryKeys.friends,
    queryFn: userApi.getFriends
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    }
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageFile: File) => userApi.updateProfilePicture(imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.currentUser});
    }
  });
};

export const useUserServers = () => {
  return useQuery({
    queryKey: queryKeys.userServers,
    queryFn: userApi.getUserServers
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: [...queryKeys.users, 'search', query],
    queryFn: () => userApi.searchUsers(query),
    enabled: query.length > 0
  });
};