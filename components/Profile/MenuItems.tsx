import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '../Themed';
import { router } from 'expo-router';
import { memo } from 'react';

interface MenuItemProps {
  iconName: any;
  label: string;
  route: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ iconName, label, route }) => {
  return (
    <TouchableOpacity className='flex-row items-center my-[2.5px] justify-between ml-3 '
      onPress={() => onButtonPress(route)}>
      <View
       className='items-center flex-row gap-2'>
        <Feather name={iconName} size={20} color="gray" />
        <Text className='font-rregular text-[16px] ml-2.5'
        >{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
 
const onButtonPress = (route: string) => {
  router.push(`/settings/${route}`);
};

const MenuItems: React.FC = () => {
  return (
    <View className='rounded-[10px] p-[1px] m-1 gap-[5px] '>
      <MenuItem iconName="user" label="Account" route="account" />
      <MenuItem iconName="moon" label="Appearance" route="appearance" />
      <MenuItem iconName="bell" label="Notification preferences" route="notifications" />
      <MenuItem iconName="smartphone" label="Devices" route="devices" />
      <MenuItem iconName="users" label="Friend requests" route="friend-requests" />
      <MenuItem iconName="log-out" label="Logout" route="logout" />
    </View>
  );
};

export default memo(MenuItems);