export interface NewUser {
  username:string,
  password:string,
  email:string,
  notification_token?:any
}

export type lightMode = 'light' | 'dark' |'default';

export interface image {
    _type:string;
    asset:{
      _ref:string;
      _type:string
    }
  };
export interface author{
  _id:string;
  username: string;
  name: string;
  email:string;
  image:image
  isVerified:boolean
}
export interface Connections {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  snapchat: string;
  github: string;
  discord: string;
  other: string;
}

export type NewPost = {
  caption: string;
  files: string[];
  tags?: string;
};

 
export type  Post = {
  _id:string;
  author:User;
  caption: string;
  images: image[];
  likes:User[];
  comments:any[]
  tags?: string;
};
export type UpdateField = {
  doccumentId: string,
   updatedFields: {
     fieldName: string, 
     fieldValue: any
   }[];
};

export interface Search {
  _id: string;
  name: string;
  date: string;
  image?: image;
}

export  interface Profile {
    _id: string;
    _createdAt?:string;
    name: string;
    username: string;
    image:image;
    email:string;
    bio:string;
    friends?: User[];
    country?: string;
    bannerImage?:string;
    streamToken?:string;
    phonenumber?:string
    connections?:Connections
  }

 export interface User { 
    _id: string;
    name: string;
    username:string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string; 
    image: image;
    isVerified:boolean
  }
  
 export interface UserUpdate {
    id: string,
    name: string, 
    username: string, 
    image?: string, 
    bannerImage?: string, 
    email?:string;
    bio?: string;
    country?: string, 
    connections?: any
  }
  
export  interface UserProfileProps {
  user: {
    _id:string;
  _createdAt:string;
  name: string;
  username: string;
  image: string;
  status: string;
  bannerImage:string;
  memberSince: string;
  mutualServers: string[];
  mutualFriends:string[]
  mutualGroups: string[];
  note: string;
  bio:{
    text:string
  }
  };
  friendIds: string[];
  profileId:string; 
  closeProfile: () => void;
}
  
export interface conversation {
  _createdAt:string,
  _id:string,
  name:string,
  username:string,
  image:image,
  lastMessage: Message,
  unreadMessages: number;
  isOnline: boolean;
  isTyping: boolean;
  messages:Message[]
}
export interface Message {
  _id:string;
  _createdAt:string;
  text: string;
  image?: string;
  sender: string;
  reaction?: string;
  timestamp: string;
  seen: boolean;
  caption?: string;
  seenBy: string[];
}
  
export interface Group {
  _id:string,
  name:string,
  image:any,
  motto:string,
  }
  
export interface NewServer{
  name: string;
  description: string;
  icon: string;
  members: string[]
}
export interface Server {
  _id:string;
  _createdAt: string;
  name: string;
  description: string;
  icon: string;
  bannerImage: string;
  creator: author;
  groupAdmins: User[];
  members:{ 
    joinedAt:string;
    member:User;
  }[],
  channels: Channel[];
}

export interface Channel {
  _id:string;
  _createdAt:string;
  name: string;
  description: string;
  type: string;
  icon:image;
  messages:Message[]
}
export interface newChannel {
  _id:string;
  name: string;
  description: string;
  type: string;
  image?:string;
  imageUrl?:string;
  messages:Message[]
}
export interface newChannel {
  _id:string;
  name: string;
  description: string;
  type: string;
  image?:string;
  imageUrl?:string;
  messages:Message[]
}
export interface NewChannel {
  serverId: string,
  name: string;
  description: string;
  type: string;
}

export interface channelMessage{ 
  channelid: string, 
  message:NewChannelMessage
}
export interface IMessage {
  _key: string;
  text: string;
  sender: {
    image: { asset: string };
    name: string;
  };
  timestamp: string;
  isSeparator?: boolean;
  image :any
}
export interface NewMessage {
  caption: string;
  file?:string;
}
export interface NewChannelMessage {
  channelId: string;
  caption: string;
  files?:string[];
}