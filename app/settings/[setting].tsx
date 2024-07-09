import { TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { Account, Appearance, FriendRequests, MenuItems, Notifications, Text, View } from '@/components';

const Settings = () => {
  const { setting } = useLocalSearchParams();
  const header = getHeaderText(setting as string);

  return (
    <View className="flex-1 mt-7.5">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text className="font-rmedium text-xl ml-[20%]">{header}</Text>
      </View>
      {renderContent(setting)}
    </View>
  );
};

const renderContent = (setting: string | any) => {
  switch (setting) {
    case 'account':
      return <Account />;
    case 'appearance':
      return <Appearance />;
    case 'notifications':
      return <Notifications />;
    case 'friend-requests':
      return <FriendRequests friendRequests={[]} />;
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
