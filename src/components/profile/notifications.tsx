import { useState } from 'react';
import { ScrollView, TouchableOpacity, Switch } from 'react-native';
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
import { Image } from 'expo-image';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'friend_request',
    content: 'Emma Thompson sent you a friend request',
    time: '2 hours ago',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    type: 'like',
    content: 'Michael Chen liked your post',
    time: '4 hours ago',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '3',
    type: 'comment',
    content: 'Sophia Rodriguez commented on your photo',
    time: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];

// Mock data for notification channels
const mockChannels = [
  { id: '1', name: 'Friend Requests', enabled: true },
  { id: '2', name: 'Likes', enabled: true },
  { id: '3', name: 'Comments', enabled: true },
  { id: '4', name: 'Messages', enabled: true },
  { id: '5', name: 'Event Invites', enabled: false },
];

const NotificationItem = ({ notification }) => {
  const scale = useSharedValue(1);
  const Custom = Animated.createAnimatedComponent(View);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View 
      entering={SlideInRight} 
      exiting={SlideOutLeft}
      style={animatedStyle}
      className="rounded-lg shadow-sm mb-4 p-4"
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: notification.avatar }} 
          className="w-12 h-12 rounded-full mr-4" 
        />
        <View className="flex-1">
          <Text className="text-base font-rmedium text-gray-800">{notification.content}</Text>
          <Text className="text-sm font-rregular text-gray-500 mt-1">{notification.time}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const ChannelToggle = ({ channel, onToggle }) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
      <Text className="text-base font-rmedium text-gray-800">{channel.name}</Text>
      <Switch
        value={channel.enabled}
        onValueChange={() => onToggle(channel.id)}
        trackColor={{ false: "#767577", true: "#4A90E2" }}
        thumbColor={channel.enabled ? "#f4f3f4" : "#f4f3f4"}
      />
    </View>
  );
};

const NotificationsPage = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [channels, setChannels] = useState(mockChannels);
  const [showSettings, setShowSettings] = useState(false);

  const handleChannelToggle = (channelId) => {
    setChannels(channels.map(channel => 
      channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel
    ));
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Animated.View entering={FadeIn.delay(300)} className="mb-6">
        <Text className="text-3xl font-rbold text-gray-800 mb-2">Notifications</Text>
        <Text className="text-base font-rregular text-gray-600">
          Stay updated with your Clevery network
        </Text>
      </Animated.View>

      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-rmedium text-gray-800">Recent</Text>
        <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
          <Feather name={showSettings ? "x" : "settings"} size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {!showSettings && (
        <Animated.View entering={FadeIn}>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </Animated.View>
      )}

      {showSettings && (
        <Animated.View entering={FadeIn}>
          <Text className="text-lg font-rmedium text-gray-800 mb-4">Notification Settings</Text>
          {channels.map((channel) => (
            <ChannelToggle key={channel.id} channel={channel} onToggle={handleChannelToggle} />
          ))}
          <View className="mt-6 bg-blue-50 rounded-lg p-4">
            <Text className="text-lg font-rmedium mb-2 text-blue-800">About Notifications</Text>
            <Text className="text-base font-rregular text-blue-700">
              Clevery sends notifications to keep you informed about activity in your network. You can customize which types of notifications you receive using the toggles above.
            </Text>
          </View>
        </Animated.View>
      )}

      <Animated.View entering={FadeIn.delay(600)} className="mt-6 bg-green-100 rounded-lg p-4">
        <Text className="text-lg font-rmedium mb-2 text-green-800">Pro Tip!</Text>
        <Text className="text-base font-rregular text-green-700">
          Customize your notification settings to ensure you never miss important updates while avoiding notification overload. Find the perfect balance for your Clevery experience!
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default NotificationsPage;