import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Clevery',
  slug: 'clevery',
  version: '2.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'clevery',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#1f2023',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    googleServicesFile: './google-services.json',
    package: 'com.clevery.app',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-secure-store',
      {
        faceIDPermission: "Allow Clevery to access your face ID  biometric data",
      },
    ],
    [
      'expo-notifications',
      {
        sounds: ['./assets/Sounds/notification.wav'],
      },
    ],
    '@stream-io/video-react-native-sdk',
    [
      '@config-plugins/react-native-webrtc',
      {
        cameraPermission: 'Allow Clevery to access your camera',
        microphonePermission: 'Allow Clevery to access your microphone',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 24,
          compileSdkVersion: 34,
          targetSdkVersion: 33,
          // extraMavenRepos: ['../../node_modules/@notifee/react-native/android/libs']
        },
      },
    ],
  ],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '3df3e8bc-4bda-4ac6-bfbe-a38f7122ff3a',
    },
  },
  owner: 'larrydean',
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/3df3e8bc-4bda-4ac6-bfbe-a38f7122ff3a',
  },
});
