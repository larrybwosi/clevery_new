
const userPaths = {
  currentUser: '/profile',
  users: '/users',
  topCreators: '/users/top',
  user: (id: string) => `/users/${id}`,
  friends: '/profile/friends',
  friend: (id: string) => `/users/friends/${id}`,
  profilePicture: '/users/me/profile-picture',
  userServers: '/users/me/servers',
  searchUsers: '/users/search',
};

const conversationPaths = {
  getCreateConversations: '/conversations',
  getConversations: '/conversations',
  getConversation: (id: string) => `/conversations/${id}`,
  sendMessage: (id: string) => `/conversations/${id}/messages`,
  updateMessage: (conversationId: string, messageId: string) => `/conversations/${conversationId}/messages/${messageId}`,
  deleteMessage: (conversationId: string, messageId: string) => `/conversations/${conversationId}/messages/${messageId}`,
  markMessagesAsSeen: (id: string) => `/conversations/${id}/messages`,
  editMessage: (conversationId: string, messageId: string) => `/conversations/${conversationId}/messages/${messageId}`,
};

const postsPaths = {
  getPosts: '/posts',
  getTopPosts: '/posts',
  createPost: '/posts',
  getPostById: (id: string) => `/posts/${id}`,
  getPostsByAuthorId: (id: string) => `/posts/author/${id}`,
  updatePost: (id: string) => `/posts/${id}`,
  interactPost: (id: string) => `/posts/${id}/interact`,
  interactComment: (id: string) => `/posts/${id}/interact`,
  deletePost: (id: string) => `/posts/${id}`,
};

const serverPaths = {
  servers: '/servers',
  topServers: '/servers/top',
  server: (id: string) => `/servers/${id}`,
  serverChannels: (id: string) => `/servers/${id}/channels`,
  serverMembers: (id: string) => `/servers/${id}/members`,
  channels: '/channels',
  channel: (id: string) => `/channels/${id}`,
  channelMessages: (id: string) => `/channels/${id}/messages`,
  messages: '/messages',
  message: (id: string) => `/messages/${id}`,
  sendMessage: (serverId: string, channelId: string) => `/servers/${serverId}/channels/${channelId}/msg`,
  editMessage: (serverId: string, channelId: string, messageId: string) => `/server/${serverId}/channels/${channelId}/msg/${messageId}`,
  deleteMessage: (serverId: string, channelId: string, messageId: string) => `/server/${serverId}/channels/${channelId}/msg/${messageId}`,
};

export { postsPaths, serverPaths, userPaths, conversationPaths }