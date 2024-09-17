import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance, AndroidStyle, AndroidCategory, EventType } from '@notifee/react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useCallback } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync();
    // token = await Notifications.getDevicePushTokenAsync();
    
  return token?.data;
}

export enum NOTIFICATION_CHANNELS {
  ADDED_TO_SERVER = 'added_to_server',
  REMOVED_FROM_SERVER = 'removed_from_server',
  MENTIONED = 'mentioned',
  FRIEND_REQUEST_RECEIVED = 'friend_request_received',
  FRIEND_REQUEST_ACCEPTED = 'friend_request_accepted',
  MESSAGE_RECEIVED = 'message_received',
  REACTION_RECEIVED = 'reaction_received',
  ROLE_ASSIGNED = 'role_assigned',
  ROLE_REMOVED = 'role_removed',
  SERVER_ANNOUNCEMENT = 'server_announcement',
  SERVER_MEMBER_ADDED = 'server_member_added',
  EVENT_REMINDER = 'event_reminder',
  DIRECT_MESSAGE = 'direct_message',
  CHANNEL_INVITATION = 'channel_invitation',
  STREAM_STARTED = 'stream_started',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  SYSTEM_UPDATE = 'system_update',
  FRIEND_ADDED = 'friend_added',
  POST_LIKED = 'post_liked',
  POST_SAVED = 'post_saved',
  POST_COMMENTED = 'post_commented',
  ONLINE_FRIENDS = 'online_friends'
}

interface NotificationConfig {
  id: string;
  name: string;
  importance: AndroidImportance;
  sound?: string;
}

interface NotificationData {
  title: string;
  body: string;
  largeIcon?: string;
  category?: AndroidCategory;
  data?: Record<string, unknown>;
}
 
// Zustand store for disabled notification channels
interface DisabledChannelsState {
  disabledChannels: NOTIFICATION_CHANNELS[];
  disableChannel: (channel: NOTIFICATION_CHANNELS) => void;
  enableChannel: (channel: NOTIFICATION_CHANNELS) => void;
  isChannelDisabled: (channel: NOTIFICATION_CHANNELS) => boolean;
}
  const showDmNotification = useCallback(async (conversationId: string, senderName: string, messageContent: string, senderImage: string): Promise<void> => {
    try {
      const channelId = await notifee.createChannel({
        id: NOTIFICATION_CHANNELS['DIRECT_MESSAGE'],
        name: 'New Messages',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.displayNotification({
        title: `New message from ${senderName}`,
        body: messageContent,
        android: {
          channelId,
          largeIcon: senderImage,
          importance: AndroidImportance.HIGH,
          style: {
            type: AndroidStyle.MESSAGING,
            person: {
              name: senderName,
              icon: senderImage,
            },
            messages: [
              {
                text: messageContent,
                timestamp: Date.now(),
              },
            ],
          },
          category: AndroidCategory.MESSAGE,
          actions: [
            {
              title: 'Reply',
              input: {
                placeholder: 'Type your reply...',
                allowFreeFormInput: true,
              },
              pressAction: {
                id: 'reply',
              },
            },
          ],
        },
        data: { conversationId },
      });
      console.log('Notification displayed for new message');
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, []);

const useDisabledChannelsStore = create<DisabledChannelsState>()(
  persist(
    (set, get) => ({
      disabledChannels: [],
      disableChannel: (channel) => set((state) => ({
        disabledChannels: DisabledChannelsSchema.parse([...state.disabledChannels, channel])
      })),
      enableChannel: (channel) => set((state) => ({
        disabledChannels: DisabledChannelsSchema.parse(state.disabledChannels.filter((ch) => ch !== channel))
      })),
      isChannelDisabled: (channel) => get().disabledChannels.includes(channel),
    }),
    {
      name: 'disabled-notification-channels',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const createDefaultChannelConfigs = (): Record<NOTIFICATION_CHANNELS, NotificationConfig> => {
  const configs: Partial<Record<NOTIFICATION_CHANNELS, NotificationConfig>> = {};

  Object.values(NOTIFICATION_CHANNELS).forEach((channel) => {
    configs[channel] = {
      id: channel,
      name: channel.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
      importance: AndroidImportance.DEFAULT,
      sound: 'default'
    };
  });

  // Override specific configurations if needed
  configs[NOTIFICATION_CHANNELS.DIRECT_MESSAGE] = {
    ...configs[NOTIFICATION_CHANNELS.DIRECT_MESSAGE]!,
    importance: AndroidImportance.HIGH
  };

  return configs as Record<NOTIFICATION_CHANNELS, NotificationConfig>;
};

const defaultChannelConfigs = createDefaultChannelConfigs();

export const disableNotificationChannel = (channel: NOTIFICATION_CHANNELS): void => {
  useDisabledChannelsStore.getState().disableChannel(channel);
};

export const enableNotificationChannel = (channel: NOTIFICATION_CHANNELS): void => {
  useDisabledChannelsStore.getState().enableChannel(channel);
};

export const showNotification = async (
  channel: NOTIFICATION_CHANNELS,
  notificationData: NotificationData
): Promise<void> => {
  if (useDisabledChannelsStore.getState().isChannelDisabled(channel)) {
    console.log(`Notification channel ${channel} is disabled.`);
    return;
  }

  try {
    const channelConfig = defaultChannelConfigs[channel];
      //@ts-ignore
    const id = await notifee.createChannel(channelConfig);

    await notifee.displayNotification({
      title: notificationData.title,
      body: notificationData.body,
      android: {
        channelId: id,
        largeIcon: notificationData?.largeIcon?notificationData?.largeIcon:'',
        importance: channelConfig.importance,
        category: notificationData.category,
      },
      //@ts-ignore
      data: notificationData.data,
    });

    console.log(`Notification displayed for channel: ${channel}`);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};
// Specific notification functions for each channel

export const showAddedToServerNotification = async (
  serverName: string,
  serverIcon: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.ADDED_TO_SERVER, {
    title: 'Added to Server',
    body: `You've been added to ${serverName}`,
    largeIcon: serverIcon,
    data: { serverName },
  });
};

export const showRemovedFromServerNotification = async (
  serverName: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.REMOVED_FROM_SERVER, {
    title: 'Removed from Server',
    body: `You've been removed from ${serverName}`,
    data: { serverName },
  });
};

export const showMentionNotification = async (
  mentionedBy: string,
  name: string,
  messageContent: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.MENTIONED, {
    title: `Mentioned by ${mentionedBy}`,
    body: `In ${name}: ${messageContent}`,
    category: AndroidCategory.SOCIAL,
    data: { mentionedBy, name },
  });
};

export const showFriendRequestReceivedNotification = async (
  senderName: string,
  senderImage: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.FRIEND_REQUEST_RECEIVED, {
    title: 'New Friend Request',
    body: `${senderName} sent you a friend request`,
    largeIcon: senderImage,
    category: AndroidCategory.SOCIAL,
    data: { senderName },
  });
};

export const showFriendRequestAcceptedNotification = async (
  friendName: string,
  friendImage: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.FRIEND_REQUEST_ACCEPTED, {
    title: 'Friend Request Accepted',
    body: `${friendName} accepted your friend request`,
    largeIcon: friendImage,
    category: AndroidCategory.SOCIAL,
    data: { friendName },
  });
};

export const showMessageReceivedNotification = async (
  senderName: string,
  messageContent: string,
  senderImage: string,
  conversationId: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.MESSAGE_RECEIVED, {
    title: `New message from ${senderName}`,
    body: messageContent,
    largeIcon: senderImage,
    category: AndroidCategory.MESSAGE,
    data: { senderName, conversationId },
  });
};

export const showReactionReceivedNotification = async (
  reactorName: string,
  messageContent: string,
  reaction: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.REACTION_RECEIVED, {
    title: `New reaction from ${reactorName}`,
    body: `Reacted with ${reaction} to: "${messageContent}"`,
    category: AndroidCategory.SOCIAL,
    data: { reactorName, reaction },
  });
};

export const showRoleAssignedNotification = async (
  roleName: string,
  serverName: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.ROLE_ASSIGNED, {
    title: 'New Role Assigned',
    body: `You've been given the ${roleName} role in ${serverName}`,
    data: { roleName, serverName },
  });
};

export const showRoleRemovedNotification = async (
  roleName: string,
  serverName: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.ROLE_REMOVED, {
    title: 'Role Removed',
    body: `The ${roleName} role has been removed from you in ${serverName}`,
    data: { roleName, serverName },
  });
};

export const showServerAnnouncementNotification = async (
  serverName: string,
  announcement: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.SERVER_ANNOUNCEMENT, {
    title: `Announcement from ${serverName}`,
    body: announcement,
    category: AndroidCategory.EVENT,
    data: { serverName },
  });
};

export const showServerMemberAddedNotification = async (
  newMemberName: string,
  serverName: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.SERVER_MEMBER_ADDED, {
    title: 'New Server Member',
    body: `${newMemberName} has joined ${serverName}`,
    category: AndroidCategory.SOCIAL,
    data: { newMemberName, serverName },
  });
};

export const showEventReminderNotification = async (
  eventName: string,
  eventTime: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.EVENT_REMINDER, {
    title: 'Event Reminder',
    body: `${eventName} is starting at ${eventTime}`,
    category: AndroidCategory.REMINDER,
    data: { eventName, eventTime },
  });
};

export const showDirectMessageNotification = async (
  senderName: string,
  messageContent: string,
  senderImage: string,
  conversationId: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.DIRECT_MESSAGE, {
    title: `DM from ${senderName}`,
    body: messageContent,
    largeIcon: senderImage,
    category: AndroidCategory.MESSAGE,
    data: { senderName, conversationId },
  });
};

export const showChannelInvitationNotification = async (
  inviterName: string,
  name: string,
  serverName: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.CHANNEL_INVITATION, {
    title: 'Channel Invitation',
    body: `${inviterName} invited you to join #${name} in ${serverName}`,
    category: AndroidCategory.SOCIAL,
    data: { inviterName, name, serverName },
  });
};

export const showStreamStartedNotification = async (
  streamerName: string,
  streamTitle: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.STREAM_STARTED, {
    title: `${streamerName} is now live!`,
    body: streamTitle,
    category: AndroidCategory.SOCIAL,
    data: { streamerName, streamTitle },
  });
};

export const showAchievementUnlockedNotification = async (
  achievementName: string,
  description: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.ACHIEVEMENT_UNLOCKED, {
    title: 'Achievement Unlocked!',
    body: `${achievementName}: ${description}`,
    category: AndroidCategory.PROGRESS,
    data: { achievementName },
  });
};

export const showSystemUpdateNotification = async (
  updateVersion: string,
  updateDescription: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.SYSTEM_UPDATE, {
    title: 'System Update Available',
    body: `Version ${updateVersion}: ${updateDescription}`,
    category: AndroidCategory.RECOMMENDATION,
    data: { updateVersion },
  });
};

export const showFriendAddedNotification = async (
  friendName: string,
  friendImage: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.FRIEND_ADDED, {
    title: 'New Friend Added',
    body: `You are now friends with ${friendName}`,
    largeIcon: friendImage,
    category: AndroidCategory.SOCIAL,
    data: { friendName },
  });
};

export const showPostLikedNotification = async (
  likerName: string,
  postTitle: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.POST_LIKED, {
    title: 'Post Liked',
    body: `${likerName} liked your post: "${postTitle}"`,
    category: AndroidCategory.SOCIAL,
    data: { likerName, postTitle },
  });
};

export const showPostSavedNotification = async (
  saverName: string,
  postTitle: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.POST_SAVED, {
    title: 'Post Saved',
    body: `${saverName} saved your post: "${postTitle}"`,
    category: AndroidCategory.SOCIAL,
    data: { saverName, postTitle },
  });
};

export const showPostCommentedNotification = async (
  commenterName: string,
  postTitle: string,
  commentPreview: string
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.POST_COMMENTED, {
    title: 'New Comment on Your Post',
    body: `${commenterName} commented on "${postTitle}": "${commentPreview}"`,
    category: AndroidCategory.SOCIAL,
    data: { commenterName, postTitle },
  });
};

export const showOnlineFriendsNotification = async (
  onlineFriendCount: number
): Promise<void> => {
  await showNotification(NOTIFICATION_CHANNELS.ONLINE_FRIENDS, {
    title: 'Friends Online',
    body: `${onlineFriendCount} of your friends are now online`,
    category: AndroidCategory.SOCIAL,
    data: { onlineFriendCount },
  });
};