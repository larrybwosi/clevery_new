import React, { useCallback, useRef } from 'react';
import { ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { formatDateString, useCurrentUserWithActivity } from '@/lib';
import { HStack, Loader, Text, View } from '@/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedIcon = ({ name, size, color }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = useCallback(() => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
  }, []);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <Feather name={name} size={size} color={color} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ActivityCard = ({ icon, title, count, color }) => {
  const theme = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withSpring(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <HStack className="rounded-xl p-4 shadow-md items-center bg-white">
        <View className="mr-4 p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <AnimatedIcon name={icon} size={24} color={color} />
        </View>
        <View>
          <Text className="text-lg font-rbold" style={{ color }}>{count}</Text>
          <Text className="text-sm font-rregular" style={{ color: theme.colors.text }}>{title}</Text>
        </View>
      </HStack>
    </Animated.View>
  );
};

const ActivityTimeline = ({ data }) => {

  return (
    <View className="mt-6">
      {data.map((item, index) => (
        <Animated.View key={item.id} entering={FadeIn.delay(index * 100)} exiting={FadeOut}>
          <View className="flex-row">
            <View className="items-center mr-4">
              <View className="w-3 h-3 rounded-full bg-blue-500" />
              {index < data.length - 1 && <View className="w-0.5 h-16 bg-blue-200" />}
            </View>
            <View className="flex-1 pb-6">
              <Text className="text-lg font-rbold">{item.title}</Text>
              <Text className="text-sm font-rregular text-gray-500">{item.content}</Text>
              <Text className="text-xs text-gray-400 mt-1">{formatDateString(item.createdAt)}</Text>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const ActivityChart = ({ data }) => {
  const theme = useTheme();

   const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const chartData = [
    {
      name: 'Posts',
      population: data.contentCreation.posts.length,
      color: '#FF6B6B',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Comments',
      population: data.contentCreation.comments.length,
      color: '#854d0e',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Likes',
      population: data.engagement.interactions.likes.length,
      color: '#FF69B4',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Saves',
      population: data.engagement.interactions.saves.length,
      color: '#FFA500',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Friends',
      population: data.networkGrowth.socialNetwork.friends,
      color: '#6A5ACD',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Visitors',
      population: data.networkGrowth.socialNetwork.visitors,
      color: '#06b6d4',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];
  return (
    <Animated.View entering={FadeIn.duration(1000)}>
      <PieChart
        data={chartData}
        width={SCREEN_WIDTH - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </Animated.View>
  );
};
const AnimatedHeader = ({ scrollY }) => {

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -50],
            Extrapolation.CLAMP
          )
        }
      ]
    };
  });

  return (
    <Animated.View style={[headerStyle, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }]}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        className="p-5 pt-12"
      >
        <Animated.Text className="text-3xl font-rbold mb-2 text-white">Activity Overview</Animated.Text>
        <Animated.Text className="text-base font-rregular mb-5 text-white opacity-80">
          Here's a summary of your recent platform activity
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

const ActivityPage = () => {
  const theme = useTheme();
  const scrollY = useSharedValue(0);

  const {
    data: activity,
    refetch: refetchActivity,
    isLoading: isLoadingActivity
  } = useCurrentUserWithActivity();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (isLoadingActivity) return<Loader loadingText="We're loading your activity"/>

  if (!activity) {
    return (
      <View className="flex-1 justify-center items-center">
        <Feather name="alert-circle" size={64} color={theme.colors.text} />
        <Text className="mt-4 text-lg font-rmedium">No activity data available</Text>
      </View>
    );
  }
//@ts-ignore
  const { userInfo, contentCreation, engagement, communityInvolvement, networkGrowth, communication, userFeedback } = activity;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <AnimatedHeader scrollY={scrollY} />
      <Animated.ScrollView
        className="flex-1"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={{ height: 200 }} /> 
        <View className="p-5">
          <View className="flex-row justify-between mb-5">
            <ActivityCard icon="file-text" title="Posts" count={contentCreation.posts.length} color="#FF6B6B" />
            <ActivityCard icon="message-square" title="Comments" count={contentCreation.comments.length} color="#4ECDC4" />
          </View>
          
          <View className="flex-row justify-between">
            <ActivityCard icon="heart" title="Likes" count={engagement.interactions.likes.length} color="#FF69B4" />
            <ActivityCard icon="bookmark" title="Saves" count={engagement.interactions.saves.length} color="#FFA500" />
          </View>

          <Animated.View entering={FadeIn.duration(1000).delay(300)}>
            <Text className="text-3xl font-rbold mt-8 mb-4">Your Stats</Text>
            <Text className="text-base font-rregular mt-2 mb-4">{userInfo.summary}</Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(600)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Activity Stats</Text>
            <ActivityChart data={activity} />
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(900)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Recent Activity</Text>
            <ActivityTimeline 
              data={[
                ...contentCreation.posts.map(post => ({
                  id: post.id,
                  title: 'Created a Post',
                  content: post.title,
                  createdAt: post.createdAt
                })),
                ...contentCreation.comments.map(comment => ({
                  id: comment.id,
                  title: 'Left a Comment',
                  content: comment.content,
                  createdAt: comment.createdAt
                }))
              ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)}
            />
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(1200)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Server Memberships</Text>
            {communityInvolvement.serverActivity.memberships.map((membership, index) => (
              <Animated.View
                key={membership.id}
                entering={FadeIn.duration(500).delay(index * 100)}
                className="rounded-xl p-4 shadow-md mb-3"
              >
                <Text className="text-base font-rbold">{`Server: ${membership.serverName}`}</Text>
                <Text className="text-sm text-gray-500">{`Role: ${membership.role}`}</Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {`Joined: ${formatDateString(membership.joinedAt)}`}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(1500)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Network Growth</Text>
            <View className="bg-white rounded-xl p-4 shadow-md mb-3">
              <Text className="text-lg font-rmedium">Friends: {networkGrowth.socialNetwork.friends}</Text>
              <Text className="text-lg font-rmedium">Profile Visitors: {networkGrowth.socialNetwork.visitors}</Text>
              <Text className="text-lg font-rmedium">Invites Sent: {networkGrowth.socialNetwork.invites.length}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(1800)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">Communication</Text>
            <View className="bg-white rounded-xl p-4 shadow-md mb-3">
              <Text className="text-lg font-rmedium">
                Initiated Conversations: {communication.messaging.initiatedConversations}
              </Text>
              <Text className="text-lg font-rmedium">Recent Conversations: {communication.messaging.recentConversations.length}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(1000).delay(2100)}>
            <Text className="text-2xl font-rbold mt-8 mb-4">User Feedback</Text>
            <View className="bg-white rounded-xl p-4 shadow-md mb-3">
              <Text className="text-lg font-rmedium">Notifications: {userFeedback.notifications.length}</Text>
              <Text className="text-lg font-rmedium">Feedbacks Provided: {userFeedback.feedbacks.length}</Text>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ActivityPage;