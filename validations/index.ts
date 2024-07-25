import { z } from "zod";

export const UserRole = z.enum(['ADMIN', 'USER']).Enum;
export const ChannelType = z.enum(['TEXT', 'AUDIO', 'VIDEO']).Enum;
export const MemberRole = z.enum(['ADMIN', 'MEMBER', 'MODERATOR', 'GUEST']).Enum;

const baseSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.string(),
  updatedAt: z.date(),
});

export const UserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().url(),
  bannerImage: z.string().url().nullable(),
  bio: z.string().nullable(),
  notificationToken: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  role: z.enum(['ADMIN', 'MEMBER', 'MODERATOR', 'GUEST']).optional()
});

export const UserUpdateSchema = UserSchema.omit({id: true, createdAt: true, updatedAt: true, role: true});

export const messageSchema = baseSchema.extend({
  text: z.string(),
  senderId: z.string(),
  file: z.string().nullable(),
  seen: z.boolean(),
  conversationId: z.string().nullable(),
  channelId: z.string().nullable(),
  sender:UserSchema
});

export const CommentSchema = z.object({
  id: z.string().min(1, "Comment ID is required"),
  text: z.string(),
  authorId: z.string().min(1, "Author ID is required"),
  postId: z.string().min(1, "Post ID is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: UserSchema,
});

const UpdateCommentSchema = CommentSchema.omit({id: true, createdAt: true, updatedAt: true, author: true});

const CreateCommentSchema = CommentSchema.omit({id: true, createdAt: true, updatedAt: true, author: true});

export const PostSchema = z.object({
  id: z.string().min(1, "Post ID is required"),
  content: z.string(),
  authorId: z.string().min(1, "Author ID is required"),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: UserSchema,
  images: z.custom<string[]>(),
  likes: z.array(UserSchema),
  saves: z.array(UserSchema),
  comments: z.array(CommentSchema),
  _count: z.object({
    comments: z.number(),
    likes: z.number(),
    saves: z.number(),
  }),
})

export const CreatePostSchema = PostSchema.omit({id: true, createdAt: true, updatedAt: true, author: true, images: true, comments: true, likes: true, saves: true, _count: true});

export const PostUpdateSchema = PostSchema.omit({id: true, createdAt: true, updatedAt: true, author: true, images: true, comments: true, likes: true, saves: true, _count: true});

export const TopCreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  image: z.string().nullable(),
  postCount: z.number(),
  likesCount: z.number(),
  commentsCount: z.number(),
  savesCount: z.number(),
  score: z.number(),
});

export const commentSchema = baseSchema.extend({
  text: z.string(),
  postId: z.string(),
  user:z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    image: z.string().nullable(),
  })
});

export const PostQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  search: z.string().optional(),
  tag: z.string().optional(),
  authorId: z.string().optional(),
  sortBy: z.enum(['createdAt', 'likes', 'saves']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const ReactionSchema = z.object({
  type: z.string(),
  count: z.number(),
  messageId: z.string(),
});

// Conversation and Messages

export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  file: z.string().nullable(),
  senderId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  seen: z.boolean(),
  conversationId: z.string().nullable(),
  channelId: z.string().nullable(),
  sender:UserSchema
})

const CreateMessageSchema = MessageSchema.omit({id: true, createdAt: true, seen: true, sender: true, conversationId: true, channelId: true, updatedAt: true});
const UpdateMessageSchema = MessageSchema.omit({ createdAt: true, seen: true, sender: true, conversationId: true, channelId: true, updatedAt: true});
const DeleteMessageSchema = z.object({id: z.string()});

export const ConversationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user:UserSchema,
  lastMessage: MessageSchema,
  messages: z.array(MessageSchema),
})
export const serverLogSchema = baseSchema.extend({
  serverId: z.string(),
  logType: z.string(),
  message: z.string(),
});

export const serverMemberSchema = baseSchema.extend({
  serverId: z.string(),
  userId: z.string(),
  role:  z.enum(['ADMIN', 'MEMBER', 'MODERATOR', 'GUEST']),
  joinedAt: z.date(),
  username:z.string(),
  image:z.string(),
});


export const ServerSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  id: z.string().min(1, "Server ID is required"),
  name: z.string().min(1, "Server name is required"),
  image: z.string().url(),
  description: z.string().nullable(),
  inviteCode: z.string(),
  slug: z.string(), 
  creatorId: z.string(),
  members:z.custom<Member[]>(),
  channels: z.custom<Channel[]>(),
  serverLogs: z.custom<typeof serverLogSchema>()
});

const CreateServerSchema = ServerSchema.omit({id: true, members: true, channels: true, serverLogs: true,slug: true,creatorId: true, createdAt: true, updatedAt: true,inviteCode: true});
const UpdateServerSchema = ServerSchema.omit({members: true, channels: true, serverLogs: true,slug: true,creatorId: true, createdAt: true, updatedAt: true,inviteCode: true});

export const ChannelSchema = z.object({
  id: z.string().min(1, "Channel ID is required"),
  name: z.string().min(1, "Channel name is required"),
  description: z.string().nullable(),
  type: z.custom<typeof ChannelType>(), 
  createdAt: z.string(),
  updatedAt: z.string(),
  serverId: z.string(),
  creatorId: z.string(),
  isPrivate: z.boolean().optional(),
  messages: z.custom<Message[]>().optional(),
});

const CreateChannelSchema = ChannelSchema.omit({id: true, serverId: true, creatorId: true,createdAt: true,updatedAt: true, messages: true});
const UpdateChannelSchema = ChannelSchema.omit({creatorId: true,createdAt: true,updatedAt: true, messages: true});

export type User = z.infer<typeof UserSchema>;
export type UpdateUser = z.infer<typeof UserUpdateSchema>;

export type Message = z.infer<typeof messageSchema>;
export type DeleteMessage = z.infer<typeof DeleteMessageSchema>;
export type Reaction = z.infer<typeof ReactionSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type CreateMessage = z.infer<typeof CreateMessageSchema>;
export type UpdateMessage = z.infer<typeof UpdateMessageSchema>;
export type CreateReaction = z.infer<typeof ReactionSchema>;

export type Post = z.infer<typeof PostSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type PostQuery = z.infer<typeof PostQuerySchema>;
export type TopCreator = z.infer<typeof TopCreatorSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof PostUpdateSchema>;


export type Server = z.infer<typeof ServerSchema>;
export type CreateServer = z.infer<typeof CreateServerSchema>;
export type UpdateServer = z.infer<typeof UpdateServerSchema>;
export type Member = z.infer<typeof serverMemberSchema>;
export type ServerLog = z.infer<typeof serverLogSchema>;

export type Channel = z.infer<typeof ChannelSchema>;
export type CreateChannel = z.infer<typeof CreateChannelSchema>;
export type UpdateChannel = z.infer<typeof UpdateChannelSchema>;
