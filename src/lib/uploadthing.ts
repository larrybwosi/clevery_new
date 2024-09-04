import { generateReactNativeHelpers } from "@uploadthing/expo";
import { endpoint } from "./env";
export const { useImageUploader, useDocumentUploader } =
  generateReactNativeHelpers<any>({
    /**
     * Your server url.
     * @default process.env.EXPO_PUBLIC_SERVER_URL
     * @remarks In dev we will also try to use Expo.debuggerHost
     */
    url: `${endpoint}/uploadthing`,
  });

//   const { openDocumentPicker, isUploading } = useDocumentUploader("document", {
//     /**
//      * Any props here are forwarded to the underlying `useUploadThing` hook.
//      * Refer to the React API reference for more info.
//      */
//     onClientUploadComplete: () => Alert.alert("Upload Completed"),
//     onUploadError: (error) => Alert.alert("Upload Error", error.message),
//   });

//   export const uploadDocument =()=>{
//     openDocumentPicker({
//       // input, // Matches the input schema from the FileRouter endpoint
//       onInsufficientPermissions: () => {
//         Alert.alert(
//           "No Permissions",
//           "You need to grant permission to your Photos to use this",
//           [
//             { text: "Dismiss" },
//             { text: "Open Settings", onPress: openSettings },
//           ],
//         );
//       },
// });
//   }