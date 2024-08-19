import { useState } from 'react';
import { FlatList, TouchableOpacity, Animated } from 'react-native';
import { Text, View } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Switch } from '@gluestack-ui/themed';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  content: string;
  time: string;
  read: boolean;
}

interface NotificationChannel {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
}

const notificationData: Notification[] = [
  { id: '1', type: 'like', content: 'John Doe liked your post', time: '2m ago', read: false },
  { id: '2', type: 'comment', content: 'Alice left a comment on your photo', time: '15m ago', read: false },
  { id: '3', type: 'follow', content: 'Bob started following you', time: '1h ago', read: true },
  { id: '4', type: 'message', content: 'You have a new message from Sarah', time: '3h ago', read: true },
  // Add more notifications as needed
];

const initialChannels: NotificationChannel[] = [
  { id: 'like', name: 'Likes', enabled: true, icon: 'heart' },
  { id: 'comment', name: 'Comments', enabled: true, icon: 'chatbubble' },
  { id: 'follow', name: 'Follows', enabled: true, icon: 'person-add' },
  { id: 'message', name: 'Messages', enabled: true, icon: 'mail' },
];

const NotificationItem: React.FC<{ item: Notification; onPress: () => void }> = ({ item, onPress }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return 'heart';
      case 'comment': return 'chatbubble';
      case 'follow': return 'person-add';
      case 'message': return 'mail';
      default: return 'notifications';
    }
  };

  return (
    <Animated.View className="mb-3 rounded-xl  shadow-md" style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={handlePress} className="flex-row items-center p-3">
        <LinearGradient
          colors={item.read ? ['#e0e0e0', '#f5f5f5'] : ['#4c669f', '#3b5998']}
          className="w-12 h-12 rounded-full justify-center items-center mr-3"
        >
          <Ionicons name={getIcon(item.type)} size={24} color={item.read ? '#666' : '#fff'} />
        </LinearGradient>
        <View className="flex-1">
          <Text className={`text-base mb-1 ${!item.read ? 'font-bold' : ''}`}>{item.content}</Text>
          <Text className="text-xs text-gray-500">{item.time}</Text>
        </View>
        {!item.read && <View className="w-2.5 h-2.5 rounded-full bg-green-500 ml-2" />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChannelToggle: React.FC<{ 
  channel: NotificationChannel; 
  onToggle: (id: string, enabled: boolean) => void 
}> = ({ channel, onToggle }) => {
  return (
    <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
      <View className="flex-row items-center">
        <Ionicons name={channel.icon as any} size={24} color="#4c669f" className="mr-3" />
        <Text className="text-base">{channel.name}</Text>
      </View>
      <Switch
        value={channel.enabled}
        onValueChange={(enabled) => onToggle(channel.id, enabled)}
        trackColor={{ false: "#767577", true: "#4c669f" }}
        thumbColor={channel.enabled ? "#f4f3f4" : "#f4f3f4"}
      />
    </View>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationData);
  const [channels, setChannels] = useState(initialChannels);
  const [showSettings, setShowSettings] = useState(false);

  const handleNotificationPress = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleChannelToggle = (id: string, enabled: boolean) => {
    setChannels(channels.map(channel => 
      channel.id === id ? { ...channel, enabled } : channel
    ));
  };

  const filteredNotifications = notifications.filter(notif => 
    channels.find(channel => channel.id === notif.type)?.enabled
  );

  return (
    <View className="flex-1 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-rregular">Your Notifications</Text>
        <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
          <Ionicons name={showSettings ? "close" : "settings-outline"} size={24} color="#4c669f" />
        </TouchableOpacity>
      </View>

      {showSettings ? (
        <ScrollView>
          <Text className="text-xl font-bold mb-4">Notification Settings</Text>
          {channels.map(channel => (
            <ChannelToggle 
              key={channel.id} 
              channel={channel} 
              onToggle={handleChannelToggle} 
            />
          ))}
        </ScrollView>
      ) : (
        <>
          {filteredNotifications.length > 0 ? (
            <FlatList
              data={filteredNotifications}
              renderItem={({ item }) => (
                <NotificationItem item={item} onPress={() => handleNotificationPress(item.id)} />
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={{paddingBottom:16}}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Ionicons name="notifications-off-outline" size={64} color="#888" />
              <Text className="text-lg text-gray-500 mt-4">No notifications yet</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default Notifications;