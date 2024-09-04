import { Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { Account, Appearance, FriendRequests, LogoutComponent, MenuItems, Notifications, Text, View } from '@/components';
import { useProfileStore } from '@/lib';

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
    case 'appearance':
      return <Appearance />;
    case 'notifications':
      return <Notifications />;
    case 'friend-requests':
      return <FriendRequests friendRequests={[]} />;
    case 'logout':
      return <LogoutComponent onCancel={()=>{}} onLogout={()=>{}} username={profile.username || profile.name} />;
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
