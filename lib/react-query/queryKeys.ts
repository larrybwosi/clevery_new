export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_FRIENDS = "getUserFriends",
  GET_INFINITE_USERS = "getInfiniteUsers",
  GET_USER_BY_ID = "getUserById",
  GET_USER_BY_NAME = "getUserByName",
  SEND_MESSAGE_ID = 'sendUserMessage',
  GET_MESSAGES_BY_IDS = 'getUserMessages',
  GET_USER_MESSAGES = 'usermessages',
  GET_CONVERSATIONS = 'userconversations',
  GET_USER_GALLERY = 'getUserGallery',

  //COMMUNITiES
  GET_COMMUNITIES = "getCommunities",
  GET_COMMUNITY_BY_ID = "getCommunityById",
  GET_COMMUNITY_BY_NAME = "getCommunityByName",
  GET_GROUPMESSAGES_BY_IDS = "getCommunityMessages",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_FILE_PREVIEW = "getFilePreview",
  GET_TOP_CREATORS = "getTopCreators",

  //  SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",
  SEARCH_ALL = "getSearchAll",
  SEARCH_USERS = "getSearchUsers",
  SEARCH_USER_FILES = "getSearchUserFiles",

  // MESSAGES KEYS
  GET_ALL_MESSAGES_BY_CONVERSATION_ID='getAllMessagesByConversationId',
  GET_INFINITE_USER_MESSAGES='getInfiniteMessages',
  GET_CONVERSATION_ID='getConversationId',

  // SERVER KEYS
  GET_SERVERS='getServers',
  GET_SERVER_BY_ID='getServerById',
  GET_TOP_SERVERS='getServerById',

  GET_CHANNEL_BY_ID='getServerById',
  GET_CHANNEL_MESSAGES='getChannelMessages',
  SEND_CHANNEL_MESSAGE='sendChannelMessage',

  GET_BANNERS='getBanners'
}
