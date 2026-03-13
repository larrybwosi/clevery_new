import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Clevery',
  slug: 'clevery',
  version: '3.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'com.clevery.app',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#1f2023',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.clevery.app',
    infoPlist: {
      NSCameraUsageDescription: 'Camera is used for video calls.',
      NSMicrophoneUsageDescription: 'Microphone is used for audio and video calls.',
    },
  },
  android: {
    googleServicesFile: './google-services.json',
    package: 'com.clevery.app',
    allowBackup: true,
    adaptiveIcon: {
      foregroundImage: './src/assets/images/icon.png',
      backgroundColor: '#ffffff',
    },
    versionCode: 1,
    permissions: ['CAMERA', 'RECORD_AUDIO', 'MODIFY_AUDIO_SETTINGS'],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/images/icon.png',
  },
  plugins: [
    '@stream-io/video-react-native-sdk',
    'expo-router',
    'expo-font',
    "@react-native-google-signin/google-signin",
    [
      "expo-notifications",
      {
        icon: './src/assets/images/icon.png',
        color: "#ffffff",
        sounds: ["./src/assets/sounds/notification.wav"]
      }
    ]
  ],
  extra: {
    router: {
      origin: "https://clevery-api.vercel.app/api",
    },
    eas: {
      projectId: '3df3e8bc-4bda-4ac6-bfbe-a38f7122ff3a',
    },
  },
  owner: 'larrydean',
  runtimeVersion: {
    policy: 'appVersion',
  },
};

export default config;
// eas build -p android --profile preview
