import { Platform } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from "expo-web-browser";
import React from "react";

import { Message } from "../types";

import { endpoint } from "./env";
import { useCustomToast } from "@/components";
export const showToastMessage = (message: string) => {
  const showToast  = useCustomToast();
  showToast({
    title: 'Success!',
    description: 'Your action was completed successfully.',
    action: 'success',
    variant: 'solid',
    duration: 3000,
    placement: 'top',
  });
};
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} at ${time}`;
}

export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList?.includes(userId);
};

export const chooseImage = async () => {
  const selectImages = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        multiple: true,
      });
      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        return selectedImages as [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  return selectImages();

};

export const selectImage = async () => {
  try {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      quality: 0.8,
    });

    if (pickerResult.canceled) { 
      return;
    }

    const selectedAssets = pickerResult.assets;
    const selectedImages = selectedAssets.map((asset) => asset.uri);
    return selectedImages;
  } catch (error) {
    showToastMessage('Failed to pick images. Please try again.');
  }
};


// export const displayNotification = async (notification: any) => {
//   const settings = await notifee.requestPermission();
//   const channelId = await notifee.createChannel({
//     id: 'default',
//     name: 'Default Channel',
//   });

//   if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
//     console.log('User denied permissions request');
//     return;
//   } else if (settings.authorizationStatus === AuthorizationStatus.PROVISIONAL) {
//     console.log('User provisionally granted permissions request');
//     return;
//   } else if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
//     console.log('User granted permissions request');
//     notifee.displayNotification({
//       title: notification.title,
//       body: notification.body,
//       android: {
//         channelId,
//         sound:'../assets/Sounds/notification.mp3',
//       },
//     });
//   }
// };


export const sortMessages = (messages: Message[]) => {
  if (!messages?.length) return [];

  const sortedMessages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const result: any[] = [];

  let prevTimestamp: number | null = null;
  let prevHour: number | null = null;
  let prevMonth: number | null = null;
  let prevYear: number | null = null;
  let currentGroup: Message[] = [];

  const addSeparatorAndGroup = (type: string, timestamp: string) => {
    if (currentGroup.length) {
      result.push({
        id: `separator-${new Date(timestamp).getTime()}`,
        timestamp,
        isSeparator: true,
        type,
        text: formatSeparatorText(timestamp),
      });
      result.push(...currentGroup);
      currentGroup = [];
    }
  };

  for (const message of sortedMessages) {
    const messageDate = new Date(message.createdAt);
    const messageTimestamp = messageDate.getTime();
    const messageHour = messageDate.getHours();
    const messageMonth = messageDate.getMonth();
    const messageYear = messageDate.getFullYear();

    if (prevTimestamp === null || messageTimestamp - prevTimestamp > 5 * 60 * 1000) {
      addSeparatorAndGroup('group', message.createdAt);
    } else if (prevHour === null || messageHour !== prevHour) {
      addSeparatorAndGroup('hour', message.createdAt);
    } else if (prevMonth === null || messageMonth !== prevMonth || messageYear !== prevYear) {
      addSeparatorAndGroup('month', message.createdAt);
    }

    currentGroup.push(message);

    prevTimestamp = messageTimestamp;
    prevHour = messageHour;
    prevMonth = messageMonth;
    prevYear = messageYear;
  }

  // Add the last group
  addSeparatorAndGroup('group', sortedMessages[sortedMessages.length - 1].createdAt);

  return result;
};

const formatSeparatorText = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute(s) ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour(s) ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day(s) ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week(s) ago`;
  if (diffInSeconds < 31536000) return MONTH_NAMES[date.getMonth()];
  return `${Math.floor(diffInSeconds / 31536000)} year(s) ago`;
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function parseIncomingMessage(messageObj:any) {
  // Remove the "data" property from the object
  const { data, ...restOfMessageObj } = messageObj;

  // Parse the "data" value into a JavaScript object if it's a string representation of one
  const dataObj = typeof data === 'string' ? JSON.parse(data) : data;

  // Return the modified object with the "data" property removed and its value parsed
  return { ...restOfMessageObj, data: dataObj };
}

/**
 * Given an image URL, returns an optimized image URL
 */
export async function getOptimizedImageUrl(imageUrl: string) {
  const response = await fetch(`${endpoint}/optimize?url=${encodeURIComponent(imageUrl)}`);
  const { optimizedImage } = await response.json();
  return optimizedImage;
}
