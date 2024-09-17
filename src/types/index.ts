// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum ChannelType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO'
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST'
}

export enum StaticUserStatuses {
  Online = "online",
  Idle = "idle",
  DND = "dnd",
  Offline = "offline",
  Mobile = "mobile",
}

// Base interface
interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User interface
export interface User extends BaseModel {
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
  friends?: string[];
  posts?: string[] | null;
  userScore?: string;
  postCount?: number;
  connections:any
  achievements:any
}

// Comment interface
export interface Comment extends BaseModel {
  text: string;
  authorId: string;
  postId: string;
  author: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  replies?: Comment[] | null;
  likes?: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  }[] | null;
}

// Post interface
export interface Post extends BaseModel {
  content: string;
  authorId: string;
  tags?: string[];
  images: string[];
  author: User;
  comments: Comment[];
  likes: any[];
  saves: any[];
}

// Message interface
export interface Message extends BaseModel {
  text: string;
  senderId: string;
  file?: string | null;
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

// Conversation interface
export interface Conversation extends BaseModel {
  user1Id: string;
  user2Id: string;
  user: User;
  messages: Message[];
  lastMessage: Message;
  unreadMessages: number;
}

// ServerMember interface
export interface ServerMember extends BaseModel {
  serverId: string;
  userId: string;
  image: string | null;
  name: string | null;
  username: string | null;
  role: MemberRole;
  joinedAt: Date;
}

// Channel interface
export interface Channel extends BaseModel {
  name: string;
  description: string | null;
  type: ChannelType;
  isPrivate: boolean;
  serverId: string;
  messages: Message[];
}

// Server interface
export interface Server extends BaseModel {
  name: string;
  description: string | null;
  creatorId: string;
  inviteCode: string;
  slug: string;
  image: string | null;
  members: ServerMember[];
  channels: Channel[];
}

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
  sortBy?: string | null;
  sortOrder?: string;
}

// Validation interfaces
export interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface CreatePostData {
  content: string;
  tags?: string[];
  images: string[];
}

export interface CreateCommentData {
  text: string;
  postId: string;
}

export interface CreateServerData {
  name: string;
  description?: string | null;
  image?: string | null;
  members:string[]
}

export interface CreateChannelData {
  name: string;
  description?: string | null;
  type: ChannelType;
  isPrivate: boolean;
}

export interface SendMessageData {
  text: string;
  file?: string | null;
}

export interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  bannerImage?: string | null;
  bio?: string | null;
  notificationToken?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface UpdateServerData {
  name?: string;
  description?: string | null;
  image?: string | null;
}

export interface UpdateChannelData {
  name?: string;
  description?: string | null;
  type?: ChannelType;
  isPrivate?: boolean;
}

export interface QueryParams {
  page: number;
  limit: number;
  search?: string;
  tag?: string;
  authorId?: string;
  sortBy: 'createdAt' | 'likes' | 'saves';
  sortOrder: 'asc' | 'desc';
}

export interface SendMessageDataPayload {
  serverId: string;
  channelId: string;
  message: SendMessageData;
}

export interface DeleteMessagePayload {
  serverId: string;
  channelId: string;
  messageId: string;
}

// Action Types
export type Action =
  | { type: 'CREATE_USER'; payload: SignUpData }
  | { type: 'SIGN_IN'; payload: SignInData }
  | { type: 'CREATE_POST'; payload: CreatePostData }
  | { type: 'CREATE_COMMENT'; payload: CreateCommentData }
  | { type: 'CREATE_SERVER'; payload: CreateServerData }
  | { type: 'CREATE_CHANNEL'; payload: CreateChannelData }
  | { type: 'SEND_MESSAGE'; payload: SendMessageData }
  | { type: 'UPDATE_USER'; payload: UpdateUserData }
  | { type: 'UPDATE_SERVER'; payload: UpdateServerData }
  | { type: 'UPDATE_CHANNEL'; payload: UpdateChannelData }
  | { type: 'DELETE_POST'; payload: { id: string } }
  | { type: 'DELETE_COMMENT'; payload: { id: string } }
  | { type: 'DELETE_SERVER'; payload: { id: string } }
  | { type: 'DELETE_CHANNEL'; payload: { id: string } }
  | { type: 'DELETE_MESSAGE'; payload: { id: string } }
  | { type: 'JOIN_SERVER'; payload: { serverId: string; userId: string } }
  | { type: 'LEAVE_SERVER'; payload: { serverId: string; userId: string } }
  | { type: 'LIKE_POST'; payload: { postId: string; userId: string } }
  | { type: 'UNLIKE_POST'; payload: { postId: string; userId: string } }
  | { type: 'BOOKMARK_POST'; payload: { postId: string; userId: string } }
  | { type: 'UNBOOKMARK_POST'; payload: { postId: string; userId: string } }
  | { type: 'ADD_REACTION'; payload: { messageId: string; type: string } }
  | { type: 'REMOVE_REACTION'; payload: { messageId: string; type: string } };

// Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

// Utility Types
export type WithId<T> = T & { id: string };
export type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date };
export type FullModel<T> = WithId<WithTimestamps<T>>;

// Specific Response Types
export type UserResponse = ApiResponse<FullModel<User>>;
export type PostResponse = ApiResponse<FullModel<Post>>;
export type CommentResponse = ApiResponse<FullModel<Comment>>;
export type ServerResponse = ApiResponse<FullModel<Server>>;
export type ChannelResponse = ApiResponse<FullModel<Channel>>;
export type MessageResponse = ApiResponse<FullModel<Message>>;

export type PostsResponse = ApiResponse<PaginatedResponse<FullModel<Post>>>;
export type ServersResponse = ApiResponse<PaginatedResponse<FullModel<Server>>>;
export type ChannelsResponse = ApiResponse<PaginatedResponse<FullModel<Channel>>>;
export type MessagesResponse = ApiResponse<PaginatedResponse<FullModel<Message>>>;