import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import { User } from '@/types';

const AUTH_STORAGE_KEY = 'auth-storage';

interface ProfileState {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export interface Profile extends User {
  bannerImage: string | null;
  friends?: User[];
  streamToken?: string | undefined;
  country?: string | undefined;
  connections:{
    github: string
    linkedin: string
    twitter: string
    website: string
    facebook: string
    instagram: string
    discord: string
  }
  phoneNumber:string
}
interface Search {
  id: string;
  name: string;
  image: string;
}
interface SearchState {
  searches: Search[];
  addSearch: (search: Search) => void;
  removeSearch: (id: string) => void;
  clearSearch: () => void;
}

interface ThemeState {
  mode: 'light' | 'dark' | 'default';
  setMode: (mode: 'light' | 'dark' | 'default') => void;
}

const initialProfileState: Profile = {
  name: 'Guest Doe',
  id: '',
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
  address: '',
  emailVerified: null,
  phone: '',
  username: 'janedoe',
  email: '',
  image: '' as any,
  bio: '',
  friends: [],
  country: '',
  bannerImage: 'https://via.placeholder.com/350x150',
  streamToken: '',
  notificationToken: '',
  phoneNumber:'',
  connections:{
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    facebook: '',
    instagram: '',
    discord: '',
  }
};


const initialSearchState: SearchState = {
  searches: [],
  addSearch: (search: Search) => {},
  removeSearch: (id: string) => {},
  clearSearch: () => {},
};

const initialThemeState: ThemeState = {
  mode: 'default',
  setMode: (mode: 'light' | 'dark' | 'default') => {},
};

const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: initialProfileState,
      setProfile: (profile: Profile) => set({ profile }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: initialThemeState.mode,
      setMode: (mode: 'light' | 'dark' | 'default') => set({ mode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searches: initialSearchState.searches,
      addSearch: (search: Search) => set((state:any) => ({ searches: [...state.searches, search] })),
      removeSearch: (id: string) => set((state:any) => ({ searches: state.searches.filter((search:any) => search._id !== id) })),
      clearSearch: () => set({ searches: [] }),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Represents the structure of the authentication state.
 */
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
}
/**
 * Zustand store for authentication state
 */
const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


/**
 * @typedef {Object} OnlineFriendsStore
 * @property {User[]} onlineFriends - The list of online friends
 * @property {(friends: User[]) => void} setOnlineFriends - Function to set online friends
 * @property {(friend: User) => void} addOnlineFriend - Function to add an online friend
 * @property {(friendId: string) => void} removeOnlineFriend - Function to remove an online friend
 */
type OnlineFriendsStore = {
  onlineFriends: User[];
  setOnlineFriends: (friends: User[]) => void;
  addOnlineFriend: (friend: User) => void;
  removeOnlineFriend: (friendId: string) => void;
};

/**
 * Zustand store for managing online friends
 */
const useOnlineFriendsStore = create<OnlineFriendsStore>((set) => ({
  onlineFriends: [],
  setOnlineFriends: (friends) => set({ onlineFriends: friends }),
  addOnlineFriend: (friend) => set((state) => ({ onlineFriends: [...state.onlineFriends, friend] })),
  removeOnlineFriend: (friendId) => set((state) => ({ 
    onlineFriends: state.onlineFriends.filter((friend) => friend.id !== friendId) 
  })),
}));


export { useProfileStore, useThemeStore, useSearchStore, useAuthStore, useOnlineFriendsStore };
