import { request,PERMISSIONS, requestMultiple } from "react-native-permissions";
import { Platform } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from "expo-web-browser";
import React from "react";

import { Message } from "../types";

import { endpoint } from "./env";
import { Toast } from "@/components";

export const showToastMessage = (message:string) => {
  Toast.show({
    id:message,
    title:message,
    placement:"top"
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

export const sortMessages=({messages}:{messages:Message[]})=>{
  if(!messages) return []
  const sortedMessages = messages?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())!;
  const messagesByMonth: { [month: string]: any } = sortedMessages?.reduce((acc: any, message) => {
    const month = formatDateString(message?.createdAt);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(message);
    return acc;
  }, {});

  const messagesWithSeparators = () => {
    return Object?.entries(messagesByMonth)?.flatMap(([month, messages]) => {
      const monthSeparator = {
        id: `month-${month}`,
        timestamp: messages[0]?.createdAt,
        isSeparator: true,
      };
      return [monthSeparator, ...messages];
    });
  }
  return messagesWithSeparators()
}

export function parseIncomingMessage(messageObj:any) {
  // Remove the "data" property from the object
  const { data, ...restOfMessageObj } = messageObj;

  // Parse the "data" value into a JavaScript object if it's a string representation of one
  const dataObj = typeof data === 'string' ? JSON.parse(data) : data;

  // Return the modified object with the "data" property removed and its value parsed
  return { ...restOfMessageObj, data: dataObj };
}
export const requestAndUpdatePermissions = async () => {
  if (Platform.OS === 'ios') {
    // Request camera and mic permissions on iOS
    const results = await requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
    ]);
  } else if (Platform.OS === 'android') {
    // Request camera, mic, bluetooth and notification permissions on Android
    await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    const results = await requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ]);
  }
};

export async function uploadFile(file: string) {
  const token = `skvnw3I2ESwFWn6wPrPOxarSGbdpitgEcgDs0KC44Bmq7H713C8ix2XubQej6vJ8lnecCMktXgxMn4x2BNZ1sgT2YLWtu3Pu8vRbqwH0uaQPtbD4C1XTW1R9oURJgQmfMICesX1C14rkDcPd8BBp3ePSrbzB0MkWBianw94KIOuMqtQSXivG`
  try {
    const res = await fetch(file);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append('file', blob);
    const response = await fetch(`https://mqczcmfz.api.sanity.io/v2021-06-07/assets/images/production`,{
      method:"POST",
      headers: {
      'Authorization':`Bearer ${token}`
      },
      body: blob
    })
    const data = await response.json()
    return  data.document.url
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Given an image URL, returns an optimized image URL
 */
export async function getOptimizedImageUrl(imageUrl: string) {
  const response = await fetch(`${endpoint}/optimize?url=${encodeURIComponent(imageUrl)}`);
  const { optimizedImage } = await response.json();
  return optimizedImage;
}