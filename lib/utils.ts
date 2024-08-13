import { request,PERMISSIONS, requestMultiple } from "react-native-permissions";
import { Alert, Platform,Permission,PermissionsAndroid } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from "expo-web-browser";
import { format, parseISO } from "date-fns";
import * as Updates from 'expo-updates';
import React from "react";
import * as FileSystem from 'expo-file-system';

 
import { Message } from "../types";


import { Toast } from "native-base";
import { endpoint } from "./env";
import axios from "axios";


interface User{
  id:string
  name:string;
}
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
        const selectedImages = result.assets;
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
    Alert.alert('An Error Occured', 'Failed to pick images. Please try again.');
  }
};

export async function fetchUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    alert(error) 
  }
}

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
    const month = format(parseISO(message?.createdAt), 'ddd MMMM yyyy');
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

// export async function uploadImage(localUri: string): Promise<string | null> {
//   try {
//     console.log(localUri)
//     // Get the file name from the local URI
//     const fileName = localUri.split('/').pop();

//     // Create a form data object
//     const formData = new FormData();

//     // If the platform is web, we can directly add the file to formData
//     // if (Platform.OS === 'web') {
//     //   const response = await fetch(localUri);
//     //   const blob = await response.blob();
//     //   formData.append('file', blob, fileName);
//     // } else {
//       // For native platforms, we need to read the file as base64
//       const base64 = await FileSystem.readAsStringAsync(localUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
      
//       // Create a Blob from the base64 string
//       const blob = await fetch(`data:image/jpeg;base64,${base64}`).then(res => res.blob());

//       formData.append('file', blob, fileName);
//     // }

//     // Send the request to your backend
//     // const response = await fetch(`${endpoint}/upload`, {
//     //   method: 'POST',
//     //   body: formData,
//     //   headers: {
//     //     'Content-Type': 'multipart/form-data',
//     //   },
//     // });
//       console.log(formData)
//     const res = await axios.post(`${endpoint}/upload`,formData)
// console.log(res.data)
//     // if (!response.ok) {
//     //   throw new Error(`HTTP error! status: ${response.status}`);
//     // }

//     const imageUrl = ''
//     return imageUrl;
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return null;
//   }
// }


// const createFormData = (uri: string) => {
//   const fileName = uri?.split('/').pop();
//   const fileType = fileName?.split('.').pop();
//   const formData = new FormData();
//   formData.append('file', { 
//     uri, 
//     name: fileName, 
//     type: `image/${fileType}` 
//   });
  
//   return formData;
// }
export const uploadingFile= async(uri: string) => {
  var fs = require("fs");
  var options = {
    method: "POST",
    url: endpoint + "/upload",
    headers: {},
    formData: {
      file: {
        value: fs.createReadStream(uri),
        options: {
          filename: "image.jpg",
          contentType: null
        }
      }
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error(error);
  }
  
}
export async function uploadFile(fileUri: string) {
  try {
    const response = await FileSystem.uploadAsync(`${endpoint}/upload`, fileUri, {
      fieldName: 'file',
      httpMethod: 'POST',
      mimeType:'application/octet-stream',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });

    console.log(response)
    if (response.status === 200) {
      const result = JSON.parse(response.body);
      console.log('File uploaded successfully:', result.url);
      return result.url;
    } else {
      console.error('Upload failed:', response.body);
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}