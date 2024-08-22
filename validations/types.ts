import { z } from 'zod';

// Enums
export type UserRole = 'ADMIN' | 'USER';
export type ChannelType = 'TEXT' | 'AUDIO' | 'VIDEO';
export type MemberRole = 'ADMIN' | 'MEMBER' | 'MODERATOR' | 'GUEST';

// Base type
interface BaseSchema {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User type
export interface User extends BaseSchema {
  name: string;
  username: string | null;
  email: string;
  image: string;
  bannerImage: string | null;
  bio: string | null;
  notificationToken: string | null;
  phone: string | null;
  address: string | null;
  emailVerified: Date | null;
  friends: string[];
  posts: string[] | null;
  userScore: string;
  postCount: number;
}

// Comment type
export interface Comment extends BaseSchema {
  text: string;
  authorId: string;
  postId: string;
  user: User;
}

// Post type
export interface Post extends BaseSchema {
  content: string;
  authorId: string;
  tags: string[];
  images: string[];
  author: User;
  comments: Comment[];
  likes: string[];
  saves: string[];
}

// Message type
export interface Message extends BaseSchema {
  text: string;
  senderId: string;
  file: string | null;
  seen: boolean;
  conversationId: string | null;
  channelId: string | null;
  sender: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
}

// Conversation type
export interface Conversation extends BaseSchema {
  user1Id: string;
  user2Id: string;
  user: User;
  messages: Message[];
  lastMessage: Message;
  unreadMessages: number;
}

// ServerMember type
export interface ServerMember extends BaseSchema {
  serverId: string;
  userId: string;
  image: string | null;
  name: string | null;
  username: string | null;
  role: MemberRole;
  joinedAt: Date;
}

// Channel type
export interface Channel extends BaseSchema {
  name: string;
  description: string | null;
  type: ChannelType;
  isPrivate: boolean;
  serverId: string;
  messages: Message[];
}

// Server type
export interface Server extends BaseSchema {
  name: string;
  description: string | null;
  creatorId: string;
  inviteCode: string;
  slug: string;
  image: string | null;
  members: ServerMember[];
  channels: Channel[];
}

// Payload types
export interface ChannelMessagePayload {
  serverId: string;
  channelId: string;
  text?: string;
  image?: string;
}

export interface UpdateMessagePayload {
  serverId: string;
  channelId: string;
  messageId: string;
  text?: string;
  image?: string;
}

export interface PostQuery {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  authorId?: string;
  sortBy?: 'createdAt' | 'likes' | 'saves';
  sortOrder?: 'asc' | 'desc';
}

// Validation types
export const Validations = {
  SignUp: {
    name: z.string().min(4, { message: "Name must be at least 4 characters." }),
    username: z.string().min(4, { message: "Username must be at least 4 characters." }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  },
  SignIn: {
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  },
  CreatePost: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'author' | 'comments' | 'likes' | 'saves'>,
  CreateComment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'user'>,
  CreateServer: Omit<Server, 'id' | 'createdAt' | 'updatedAt' | 'creatorId' | 'inviteCode' | 'slug' | 'channels'>,
  CreateChannel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt' | 'serverId' | 'messages'>,
  SendMessage: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'senderId' | 'seen' | 'sender' | 'conversationId' | 'channelId'>,
  UpdateMessage: Omit<Message, 'createdAt' | 'updatedAt' | 'senderId' | 'seen' | 'sender'>,
  UpdateUser: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified'>>,
  UpdateServer: Partial<Omit<Server, 'id' | 'createdAt' | 'updatedAt' | 'creatorId' | 'inviteCode' | 'slug' | 'members' | 'channels'>>,
  UpdateChannel: Partial<Omit<Channel, 'id' | 'createdAt' | 'updatedAt' | 'serverId' | 'messages'>>,
};

// Query type
export interface Query {
  page: number;
  limit: number;
  search?: string;
  tag?: string;
  authorId?: string;
  sortBy?: 'createdAt' | 'likes' | 'saves';
  sortOrder?: 'asc' | 'desc';
}

// Export all types
export const Types = {
  User,
  Post,
  Comment,
  Conversation,
  Message,
  Server,
  ServerMember,
  Channel,
  ChannelMessagePayload,
  UpdateMessagePayload,
  PostQuery,
  Validations,
  Query,
};