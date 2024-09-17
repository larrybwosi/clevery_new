import { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Text, Button, View } from '@/components';
import Animated, {
  FadeIn, 
  FadeOut 
} from 'react-native-reanimated';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal'; 
import { Image } from 'expo-image';

// Mock data for linked devices
const initialDevices = [
  { id: '1', name: 'iPhone 12', type: 'mobile', lastActive: '2 hours ago' },
  { id: '2', name: 'MacBook Pro', type: 'desktop', lastActive: 'Active now' },
  { id: '3', name: 'iPad Air', type: 'tablet', lastActive: '3 days ago' },
];

const DeviceItem = ({ device, onRemove }) => {
  const theme = useTheme();
  
  const getDeviceIcon = (type):any => {
    switch (type) {
      case 'mobile': return 'smartphone';
      case 'desktop': return 'monitor';
      case 'tablet': return 'tablet';
      default: return 'device-unknown';
    }
  };

  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut}
      className="flex-row items-center justify-between py-4 border-b border-gray-200"
    >
      <View className="flex-row items-center">
        <Feather name={getDeviceIcon(device.type)} size={24} color={theme.colors.text} />
        <View className="ml-4">
          <Text className="text-base font-medium">{device.name}</Text>
          <Text className="text-sm text-gray-500">{device.lastActive}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemove(device.id)} className="p-1">
        <Feather name="x-circle" size={24} color={'red'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const DevicesPage = () => {
  const [devices, setDevices] = useState(initialDevices);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const theme = useTheme();

  const removeDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const linkNewDevice = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const addNewDevice = () => {
    const newDevice = {
      id: `${devices.length + 1}`,
      name: `New Device ${devices.length + 1}`,
      type: 'mobile',
      lastActive: 'Just now'
    };
    setDevices([...devices, newDevice]);
    closeModal();
  };

  return (
    <>
      <ScrollView className="flex-1 p-5" style={{ backgroundColor: theme.colors.background }}>
        <Text className="text-3xl font-rbold mb-5">Devices</Text>
        
        <View className="flex-row bg-blue-100 rounded-lg p-4 mb-5">
          <Feather name="info" size={24} color={theme.colors.primary} className="mr-3" />
          <Text className="flex-1 text-sm font-rregular">
            These are devices you're currently logged into. You can see when they were last active and remove access if you don't recognize a device.
          </Text>
        </View>

        <Button
          onPress={linkNewDevice}
          className="flex-row items-center justify-center bg-transparent border border-blue-500 rounded-full py-2 mb-5"
        >
          <Feather name="plus-circle" size={20} color={theme.colors.primary} />
          <Text className="ml-2 text-blue-500 text-base font-semibold">Link New Device</Text>
        </Button>

        <View className="mb-5">
          <Text className="text-xl font-rmedium mb-3">Current Devices</Text>
          {devices.map(device => (
            <DeviceItem key={device.id} device={device} onRemove={removeDevice} />
          ))}
        </View>

        <View className="bg-yellow-100 rounded-lg p-4">
          <Text className="text-xl font-semibold mb-3">Security Tips</Text>
          <Text className="text-sm mb-1 font-rregular">• Use two-factor authentication for added security.</Text>
          <Text className="text-sm mb-1 font-rregular">• Regularly review your linked devices and remove any you no longer use.</Text>
          <Text className="text-sm font-rregular">• Never share your account credentials with anyone.</Text>
        </View>
      </ScrollView>

      <Modal isOpen={isModalVisible} onClose={closeModal} className=''>
        <ModalContent className={'bg-white rounded-3xl'} style={{ backgroundColor: theme.colors.background }}>
          <ModalHeader>
            <Text className="text-xl font-rbold">Link New Device</Text>
            <ModalCloseButton onPress={closeModal} />
          </ModalHeader>
          <ModalBody>
            <Text className="text-base mb-4">Scan this QR code with your new device to link it to your account:</Text>
            <View className="items-center justify-center">
              <Image
                source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://clevery.vercel.app/' }}
                style={{ width: 200, height: 200 }}
              />
            </View>
          </ModalBody>
          <ModalFooter>
            <Button onPress={addNewDevice} className="bg-blue-500 px-4 py-2 rounded-full">
              <Text className="text-white font-rmedium">Link Device</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DevicesPage;