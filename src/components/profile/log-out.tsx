import { useState } from 'react';
import { Pressable, ScrollView, View as RNView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Text, View } from '@/components/themed';
import { useThemeStore } from '@/lib';

const LogoutOption = ({ title, description, icon, onPress, isSelected }) => {
  const scale = useSharedValue(1);
  const Custom = Animated.createAnimatedComponent(View);
  const {mode} =useThemeStore();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Custom 
      entering={SlideInRight} 
      exiting={SlideOutLeft}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`flex-row items-center p-4 mb-4 rounded-lg ${
          isSelected ? mode === 'dark' ? 'bg-blue-500': 'bg-blue-100' : mode === 'dark' ? 'bg-zinc-500' : 'bg-zinc-200'
        }`}
      >
        <RNView className="mr-4 p-1">
          <Feather name={icon} size={24} color={mode ==='light'?"#4A90E2":'white'} />
        </RNView>
        <RNView className="flex-1">
          <Text className="text-lg font-rmedium text-gray-800">{title}</Text>
          <Text className="text-sm font-rregular text-gray-600">{description}</Text>
        </RNView>
        {isSelected && (
          <Feather name="check-circle" size={24} color={mode ==='light'?"#4A90E2":'white'} />
        )}
      </Pressable>
    </Custom>
  );
};

const LogoutPage = () => {
  const theme = useTheme();
  const [logoutOption, setLogoutOption] = useState('current');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const Custom = Animated.createAnimatedComponent(View);

  const handleLogout = () => {
    // Implement logout logic here
    console.log(`Logging out of ${logoutOption === 'all' ? 'all devices' : 'current device'}`);
    // After logout, navigate to login screen
    // navigation.navigate('Login');
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Custom entering={FadeIn.delay(300)} className="mb-6">
        <Text className="text-3xl font-rbold text-gray-800 mb-2">Ready to take a break?</Text>
        <Text className="text-base font-rregular text-gray-600">
          We'll miss you! Remember, you can always just close the app instead of logging out to stay connected.
        </Text>
      </Custom>

      <Custom entering={FadeIn.delay(600)} className="bg-yellow-100 rounded-lg p-4 mb-6">
        <Text className="text-lg font-rmedium mb-2 text-yellow-800">Quick Tip</Text>
        <Text className="text-base font-rregular text-yellow-700">
          Staying logged in keeps you connected with friends and ensures you don't miss any important updates or messages.
        </Text>
      </Custom>

      <Text className="text-xl font-rmedium text-gray-800 mb-4">Logout Options</Text>

      <LogoutOption
        title="Logout from this device"
        description="You'll remain logged in on other devices"
        icon="smartphone"
        onPress={() => setLogoutOption('current')}
        isSelected={logoutOption === 'current'}
      />

      <LogoutOption
        title="Logout from all devices"
        description="You'll be logged out everywhere you're using Clevery"
        icon="globe"
        onPress={() => setLogoutOption('all')}
        isSelected={logoutOption === 'all'}
      />

      <Custom entering={FadeIn.delay(900)} className="mt-6">
        <Pressable
          onPress={() => setShowConfirmation(true)}
          className="bg-red-500 rounded-lg py-3 px-6"
        >
          <Text className="text-lg font-rmedium text-white text-center">Logout</Text>
        </Pressable>
      </Custom>

      {showConfirmation && (
        <Custom 
          entering={FadeIn} 
          exiting={FadeOut}
          className="mt-6 bg-white rounded-lg p-4 shadow-lg"
        >
          <Text className="text-lg font-rmedium text-gray-800 mb-2">Are you sure?</Text>
          <Text className="text-base font-rregular text-gray-600 mb-4">
            You'll miss out on updates from your friends and communities. Why not take a short break instead?
          </Text>
          <View className="flex-row justify-between">
            <Pressable
              onPress={() => setShowConfirmation(false)}
              className="bg-blue-500 rounded-lg py-2 px-4"
            >
              <Text className="text-base font-rmedium text-white">Stay Connected</Text>
            </Pressable>
            <Pressable
              onPress={handleLogout}
              className="bg-gray-300 rounded-lg py-2 px-4"
            >
              <Text className="text-base font-rmedium text-gray-700">Logout Anyway</Text>
            </Pressable>
          </View>
        </Custom>
      )}

      <Custom entering={FadeIn.delay(1200)} className="mt-6 bg-green-100 rounded-lg p-4">
        <Text className="text-lg font-rmedium mb-2 text-green-800">Stay in the loop!</Text>
        <Text className="text-base font-rregular text-green-700">
          Remember, logging out means you might miss important notifications, messages from friends, or exciting updates. Consider just closing the app if you need a short break.
        </Text>
      </Custom>
    </ScrollView>
  );
};

export default LogoutPage;