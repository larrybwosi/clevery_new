import { useState, useCallback } from 'react';
import { Pressable, TextInput, FlatList, ListRenderItem } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  useDerivedValue,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  useAnimatedRef,
  SharedValue,
  FadeInUp,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, View } from '@/components/themed';
import { useProfileStore } from '@/lib';

// Custom blur component
const CustomBlurView: React.FC<{ intensity: SharedValue<number>, children: React.ReactNode }> = ({ intensity, children }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255, 255, 255, ${interpolate(intensity.value, [0, 20], [0, 0.7], Extrapolation.CLAMP)})`,
  }));

  return (
    <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// Types
interface Status {
  id: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

interface Stats {
  totalStatuses: number;
  totalLikes: number;
  totalComments: number;
  popularityScore: number;
}

const MOCK_STATS: Stats = {
  totalStatuses: 15,
  totalLikes: 230,
  totalComments: 45,
  popularityScore: 78,
};

const MOCK_STATUSES: Status[] = [
  { id: '1', content: "Just finished a great workout! 💪", likes: 24, comments: 3, createdAt: new Date() },
  { id: '2', content: "Excited for the weekend plans! 🎉", likes: 31, comments: 5, createdAt: new Date(Date.now() - 3600000) },
  { id: '3', content: "New project starting tomorrow. Wish me luck! 🍀", likes: 42, comments: 7, createdAt: new Date(Date.now() - 7200000) },
];

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const StatusPage: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>(MOCK_STATUSES);
  const [newStatus, setNewStatus] = useState('');
  const { profile } = useProfileStore();
  const scrollY = useSharedValue(0);
  const isCreatingStatus = useSharedValue(0);
  const listRef = useAnimatedRef<FlatList>();

  const headerHeight = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, 200], [300, 100], Extrapolation.CLAMP);
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: headerHeight.value,
  }));

  const gradientColors = useDerivedValue(() => [
    interpolateColor(scrollY.value, [0, 200], ['#6366F1', '#818CF8']),
    interpolateColor(scrollY.value, [0, 200], ['#818CF8', '#A5B4FC']),
  ]);

  const blurIntensity = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, 200], [0, 20], Extrapolation.CLAMP);
  });

  const createStatusStyle = useAnimatedStyle(() => ({
    height: withSpring(isCreatingStatus.value ? 200 : 60),
    opacity: withTiming(isCreatingStatus.value ? 1 : 0.8),
  }));

  const renderStatus: ListRenderItem<Status> = useCallback(({ item, index }) => (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      layout={LinearTransition.duration(500)}
      className="rounded-xl shadow-lg p-5 mb-4"
    >
      <Text className="font-rmedium text-lg mb-3 text-gray-800">{item.content}</Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Feather name="heart" size={18} color="#EF4444" />
          <Text className="ml-2 font-rregular text-sm text-gray-600">{item.likes}</Text>
          <Feather name="message-circle" size={18} color="#3B82F6" className="ml-6" />
          <Text className="ml-2 font-rregular text-sm text-gray-600">{item.comments}</Text>
        </View>
        <Text className="font-rthin text-xs text-gray-500">
          {formatTimeAgo(item.createdAt)}
        </Text>
      </View>
    </Animated.View>
  ), []);

  const createStatus = useCallback(() => {
    if (newStatus.trim()) {
      const newStatusObj: Status = {
        id: Date.now().toString(),
        content: newStatus,
        likes: 0,
        comments: 0,
        createdAt: new Date(),
      };
      setStatuses(prevStatuses => [newStatusObj, ...prevStatuses]);
      setNewStatus('');
      isCreatingStatus.value = withTiming(0);
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [newStatus, isCreatingStatus, listRef]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const tipTranslateY = useSharedValue(0);
  const renderHeader = useCallback(() => (
    <Animated.View style={headerStyle}>
      <AnimatedLinearGradient
        colors={gradientColors.value}
        style={[{ flex: 1, justifyContent: 'flex-end', padding: 20 }]}
      >
        <CustomBlurView intensity={blurIntensity}>
          <Text className="text-5xl font-rbold mb-3 shadow-sm">Your Status</Text>
          <Text className="text-xl font-rregular opacity-80">Share your thoughts!</Text>
        </CustomBlurView>
      </AnimatedLinearGradient>
    </Animated.View>
  ), [headerStyle, gradientColors, blurIntensity]);

  const renderCreateStatus = useCallback(() => (
    <Animated.View style={createStatusStyle} className="rounded-xl shadow-lg mb-6 overflow-hidden">
      <Pressable 
        onPress={() => {
          isCreatingStatus.value = withSpring(isCreatingStatus.value === 0 ? 1 : 0);
        }}
        className="flex-row items-center p-4"
      >
        <Feather name="plus-circle" size={28} color="#6366F1" />
        <Text className="ml-3 font-rmedium text-lg text-gray-800">Create new status</Text>
      </Pressable>
      {isCreatingStatus.value === 1 && (
        <View className='p-4 flex-1'>
          <TextInput
            value={newStatus}
            onChangeText={setNewStatus}
            placeholder="What's on your mind?"
            multiline
            className="px-4 py-3 font-rregular rounded-lg text-base"
            style={{ height: 80 }}
          />
          <Pressable
            onPress={createStatus}
            className="bg-indigo-600 p-4 mt-3 rounded-lg"
          >
            <Text className="font-rbold text-center text-lg">Post Status</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  ), [createStatusStyle, isCreatingStatus, newStatus, createStatus]);

  const renderStats = useCallback(() => (
    <View className="rounded-xl shadow-lg mb-6 p-5">
      <Text className="font-rbold text-xl mb-4 text-indigo-700">Your Stats</Text>
      <View className="flex-row justify-between">
        {Object.entries(MOCK_STATS).map(([key, value]) => (
          <View key={key} className="items-center">
            <Text className="font-rbold text-2xl text-indigo-600">{value}</Text>
            <Text className="font-rregular text-xs text-gray-600 mt-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  ), []);

  const renderTip = useCallback(() => (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOut}
      style={{ transform: [{ translateY: tipTranslateY }] }}
      className="bg-indigo-100 rounded-xl shadow-md p-5 mb-6"
    >
      <Text className="font-rbold text-xl mb-3 text-indigo-800">Boost Your Popularity!</Text>
      <Text className="font-rregular text-base text-indigo-700 leading-6">
        Creating engaging statuses increases your visibility and popularity on the platform. 
        Share your thoughts, experiences, or ask questions to connect with others!
      </Text>
    </Animated.View>
  ), []);

  return (
    <View className="flex-1 bg-gray-50">
      {renderHeader()}
      <Animated.FlatList
        ref={listRef}
        data={statuses}
        renderItem={renderStatus}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          <>
            {renderCreateStatus()}
            {renderStats()}
            {renderTip()}
          </>
        }
      />
    </View>
  );
};

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

export default StatusPage;