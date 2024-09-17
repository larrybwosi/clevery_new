import { Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { Account, Appearance, FriendRequests, LogoutComponent, MenuItems, Notifications, Text, View } from '@/components';
import { useProfileStore } from '@/lib';
import DevicesPage from '@/components/profile/devices';
import FeedbackPage from '@/components/profile/feedback';
import PrivacyPage from '@/components/profile/privacy';
import TermsOfServicePage from '@/components/profile/terms';
import SecurityPage from '@/components/profile/security';
import HelpSupportPage from '@/components/profile/about';
import ActivityPage from '@/components/profile/activity';

const Settings = () => {
  const { setting } = useLocalSearchParams();
  const header = getHeaderText(setting as string);

  return (
    <View className="flex-1 mt-7.5">
      <View className="flex-row items-center">
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="gray" />
        </Pressable>
        <Text className="font-rmedium text-xl ml-[20%]">{header}</Text>
      </View>
      {renderContent(setting)}
    </View>
  );
};

const renderContent = (setting: string | any) => {
  const { profile } = useProfileStore();
  switch (setting) {
    case 'account':
      return <Account />;
    case 'activity':
      return <ActivityPage />;
    case 'appearance':
      return <Appearance />;
    case 'notifications':
      return <Notifications />;
    case 'devices':
      return <DevicesPage />;
    case 'feedback':
      return <FeedbackPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'terms':
      return <TermsOfServicePage />;
    case 'friend-requests':
      return <FriendRequests />;
    case 'security':
      return <SecurityPage />;
    case 'help':
      return <HelpSupportPage />;
    case 'logout':
      return <LogoutComponent />;
    default:
      return <MenuItems />;
  }
};

const getHeaderText = (setting: string): string => ({
  account: 'Account',
  appearance: 'Appearance',
  notifications: 'Notifications',
  'friend-requests': 'Friend Requests',
  devices: 'Devices',
  logout: 'Logout',
}[setting] || '');

export default Settings;
