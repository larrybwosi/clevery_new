import { z } from 'zod';

// Enums
export const UserRoleEnum = z.enum(['ADMIN', 'USER']);
export const ChannelTypeEnum = z.enum(['TEXT', 'AUDIO', 'VIDEO']);
export const MemberRoleEnum = z.enum(['ADMIN', 'MEMBER', 'MODERATOR', 'GUEST']);

// Base schema
const baseSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// User schema
export const UserSchema = baseSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").nullable(),
  email: z.string().email("Invalid email address"),
  image: z.string().url(),
  bannerImage: z.string().url().nullable(),
  bio: z.string().nullable(),
  notificationToken: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  emailVerified: z.date().nullable(),
});

// Comment schema
export const CommentSchema = baseSchema.extend({
  text: z.string().min(3, "Minimum 3 characters."),
  authorId: z.string(),
  postId: z.string(),
  user: UserSchema
});

// Post schema
export const PostSchema = baseSchema.extend({
  content: z.string().min(3, "Minimum 3 characters."),
  authorId: z.string(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string().url()),
  author: UserSchema,
  comments: z.array(CommentSchema),
  likes: z.array(z.string()),
  saves: z.array(z.string()),
});

// Message schema
export const MessageSchema = baseSchema.extend({
  text: z.string(),
  senderId: z.string(),
  file: z.string().url().nullable().optional(),
  seen: z.boolean(),
  conversationId: z.string().nullable(),
  channelId: z.string().nullable(),
  sender:z.object({
    id: z.string(),
    name: z.string(),
    username: z.string().nullable(),
    image: z.string().url().nullable(),
  })
});

// Conversation schema
export const ConversationSchema = baseSchema.extend({
  user1Id: z.string(),
  user2Id: z.string(),
  user: UserSchema,
  messages: z.array(MessageSchema),
  lastMessage: MessageSchema,
  unreadMessages: z.number(),
});


// ServerMember schema
export const ServerMemberSchema = baseSchema.extend({
  serverId: z.string(),
  userId: z.string(),
  image: z.string().url().nullable(),
  name: z.string().nullable(),
  username: z.string().nullable(),
  role: MemberRoleEnum,
  joinedAt: z.date(),
});

// Channel schema
export const ChannelSchema = baseSchema.extend({
  name: z.string().min(1, "Channel name is required"),
  description: z.string().nullable(),
  type: ChannelTypeEnum,
  isPrivate: z.boolean(),
  serverId: z.string(),
  messages: z.array(MessageSchema),
});

// Server schema
export const ServerSchema = baseSchema.extend({
  name: z.string().min(1, "Server name is required"),
  description: z.string().nullable(),
  creatorId: z.string(),
  inviteCode: z.string(),
  slug: z.string(),
  image: z.string().url().nullable(),
  members: z.array(ServerMemberSchema),
  channels: z.array(ChannelSchema),
});


export const ChannelMessagePayloadSchema = z.object({
  serverId: z.string(),
  channelId: z.string(),
  text: z.string().optional(),
  image: z.string().optional(),
});

export const UpdateMessagePayloadSchema = z.object({
  serverId: z.string(),
  channelId: z.string(),
  messageId: z.string(),
  text: z.string().optional(),
  image: z.string().optional(),
});

export const PostQuerySchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  search: z.string().optional(),
  tag: z.string().optional(), 
  authorId: z.string().optional(),
  sortBy: z.string().optional().default('createdAt').nullable(), 
  sortOrder: z.string().optional().default('desc'),
});
// Validation schemas for operations
export const Validations = {
  SignUp: z.object({
    name: z.string().min(4, { message: "Name must be at least 4 characters." }),
    username: z.string().min(4, { message: "Username must be at least 4 characters." }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  }),

  SignIn: z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  }),

  CreatePost: PostSchema.omit({ id: true, createdAt: true, updatedAt: true, authorId: true ,author: true, comments: true,likes:true, saves:true}),

  CreateComment: CommentSchema.omit({ id: true, createdAt: true, updatedAt: true, authorId: true,user: true }),

  CreateServer: ServerSchema.omit({ id: true, createdAt: true, updatedAt: true, creatorId: true, inviteCode: true, slug: true, members: true, channels: true}),

  CreateChannel: ChannelSchema.omit({ id: true, createdAt: true, updatedAt: true, serverId: true, messages: true }),

  SendMessage: MessageSchema.omit({ id: true, createdAt: true, updatedAt: true, senderId: true, seen: true,sender: true, conversationId: true,channelId: true}),

  UpdateMessage: MessageSchema.omit({ createdAt: true, updatedAt: true, senderId: true, seen: true,sender: true}),

  UpdateUser: UserSchema.partial().omit({ id: true, createdAt: true, updatedAt: true, emailVerified: true }),

  UpdateServer: ServerSchema.partial().omit({ id: true, createdAt: true, updatedAt: true, creatorId: true, inviteCode: true, slug: true, members: true, channels: true }),

  UpdateChannel: ChannelSchema.partial().omit({ id: true, createdAt: true, updatedAt: true, serverId: true, messages: true }),
};

// Query schemas
export const QuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  search: z.string().optional(),
  tag: z.string().optional(),
  authorId: z.string().optional(),
  sortBy: z.enum(['createdAt', 'likes', 'saves']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Export all schemas
export const Schemas = {
  User: UserSchema,
  Post: PostSchema,
  Comment: CommentSchema,
  Conversation: ConversationSchema,
  Message: MessageSchema,
  Server: ServerSchema,
  ServerMember: ServerMemberSchema,
  Channel: ChannelSchema,
  ChannelMessagePayload: ChannelMessagePayloadSchema,
  UpdateMessagePayload: UpdateMessagePayloadSchema
};