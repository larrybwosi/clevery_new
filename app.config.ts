import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Clevery',
  slug: 'clevery',
  version: '2.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'com.clevery.app',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#1f2023',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.clevery.app',
  },
  android: {
    googleServicesFile: './google-services.json',
    package: 'com.clevery.app',
    allowBackup: true,
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#ffffff',
    },
    versionCode: 1, 
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/icon.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    // [
    //   "expo-av",
    //   {
    //     "microphonePermission": "Allow Clevery to access your microphone."
    //   }
    // ],
    [
      'expo-notifications',
      {
        sounds: ['./assets/Sounds/notification.wav'],
      },
    ]
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
    policy: 'sdkVersion', 
  },
});

// eas build -p android --profile preview