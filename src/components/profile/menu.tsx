import { Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';

import { Text, View } from '../themed';
import { memo } from 'react';

interface MenuItemProps {
  iconName: keyof typeof Feather.glyphMap;
  label: string;
  route: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ iconName, label, route }) => {
  return (
    <Pressable className='flex-row items-center my-[4px] justify-between ml-3 '
      onPress={() => onButtonPress(route)}>
      <View
        className='items-center flex-row gap-2'
      >
        <Feather name={iconName} size={24} color="gray" />
        <Text className='font-rregular text-base ml-3 text-gray-400'
        >{label}</Text>
      </View>
    </Pressable>
  );
};

const onButtonPress = (route: string) => {
  router.push(`/settings/${route}`);
};

const MenuItems: React.FC = () => {
  return (
    <View className='rounded-[10px] p-[1px] m-1 gap-3 mt-4 '>
      <Text className='font-rbold text-md ml-2'>Profile Settings</Text>
      <MenuItem iconName="user" label="Account" route="account" />
      <MenuItem iconName="activity" label="Activity" route="activity" />
      <MenuItem iconName="moon" label="Appearance" route="appearance" />
      <MenuItem iconName="bell" label="Notification preferences" route="notifications" />
      <MenuItem iconName="smartphone" label="Devices" route="devices" />
      <MenuItem iconName="users" label="Friend requests" route="friend-requests" />
      <MenuItem iconName="lock" label="Privacy Settings" route="privacy" />
      <MenuItem iconName="shield" label="Security" route="security" />
      <MenuItem iconName="help-circle" label="Help & Support" route="help" />
      <MenuItem iconName="credit-card" label="Payment Methods" route="payments" />
      <MenuItem iconName="file-text" label="Terms of Service" route="terms" />
      <MenuItem iconName="info" label="About Us" route="about" />
      <MenuItem iconName="star" label="Feedback" route="feedback" />
      <MenuItem iconName="log-out" label="Logout" route="logout" />
    </View>
  );
};

export default memo(MenuItems);