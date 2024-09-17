import { useCallback } from 'react';
import { ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { HStack, Text, View } from '@/components';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const mockUserActivity = {
  posts: [
    {
      id: '1',
      title: 'My Journey to a Healthier Lifestyle',
      content: 'After years of unhealthy eating, I decided to make a change. Here are the steps I took to improve my diet and fitness routine.',
      createdAt: '2024-09-10T12:00:00Z',
      author: 'Sarah Williams',
      tags: ['Health', 'Fitness', 'Lifestyle'],
      commentsCount: 12,
      likesCount: 45,
    },
    {
      id: '2',
      title: 'Traveling Through Italy: A Food Lover’s Dream',
      content: 'I just returned from a month in Italy, and the food was incredible! Here are my top recommendations for anyone planning a trip.',
      createdAt: '2024-09-09T15:30:00Z',
      author: 'Michael Johnson',
      tags: ['Travel', 'Food', 'Italy'],
      commentsCount: 8,
      likesCount: 30,
    },
    {
      id: '3',
      title: 'How Gardening Changed My Life',
      content: 'Starting a garden has been therapeutic for me. Here’s how it has helped my mental health and provided fresh produce for my family.',
      createdAt: '2024-09-08T09:00:00Z',
      author: 'Emily Davis',
      tags: ['Gardening', 'Mental Health', 'Sustainability'],
      commentsCount: 5,
      likesCount: 20,
    },
  ],
  comments: [
    {
      id: '1',
      content: 'This is so inspiring! I’ve been wanting to start my own garden.',
      createdAt: '2024-09-11T09:15:00Z',
      postId: '3',
      author: 'Laura Green',
    },
    {
      id: '2',
      content: 'I loved Italy! Did you try the gelato? It’s the best!',
      createdAt: '2024-09-10T18:45:00Z',
      postId: '2',
      author: 'David Brown',
    },
    {
      id: '3',
      content: 'Great tips! I need to work on my fitness too.',
      createdAt: '2024-09-08T14:20:00Z',
      postId: '1',
      author: 'Jessica White',
    },
  ],
  likes: [
    {
      id: '1',
      targetType: 'post',
      targetId: '1',
      createdAt: '2024-09-11T10:00:00Z',
      userId:'user1', // ID of the user who liked
    },
    {
      id:'2', 
       targetType:'comment', 
       targetId:'2', 
       createdAt:'2024-09-10T14;20Z', 
       userId:'user2' // ID of the user who liked
     },
   ],
  saves:[
     { 
       id:'1', 
       targetType:'post', 
       targetId:'2', 
       createdAt:'2024-09-09T11;30Z', 
       userId:'user3' // ID of the user who saved
     },
   ],
   bookmarks:[
     { 
       id:'1', 
       targetType:'post', 
       targetId:'3', 
       createdAt:'2024-09-08T16;00Z', 
       userId:'user4' // ID of the user who bookmarked
     },
   ],
   serverMemberships:[
     { 
       id:'1', 
       serverId:'wellness-community', 
       role:'member', 
       joinedAt:'2024-09-01T10;00Z' 
     },
     { 
       id:'2', 
       serverId:'foodies-unite', 
       role:'admin', 
       joinedAt:'2024-08-15T14;30Z' 
     },
     { 
       id:'3', 
       serverId:'travel-buddies', 
       role:'moderator', 
       joinedAt:'2024-07-20T12;45Z' 
     }
   ],
};

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

  return (
    <HStack className="rounded-xl p-4 shadow-md items-center">
      <View className="mr-4 p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <AnimatedIcon name={icon} size={24} color={color} />
      </View>
      <View>
        <Text className="text-lg font-rbold" style={{ color }}>{count}</Text>
        <Text className="text-sm font-rregular" style={{ color: theme.colors.text }}>{title}</Text>
      </View>
    </HStack>
  );
};

const ActivityTimeline = ({ data }) => {
  const theme = useTheme();

  return (
    <View className="mt-6">
      {data.map((item, index) => (
        <View key={item.id} className="flex-row">
          <View className="items-center mr-4">
            <View className="w-3 h-3 rounded-full bg-blue-500" />
            {index < data.length - 1 && <View className="w-0.5 h-16 bg-blue-200" />}
          </View>
          <View className="flex-1 pb-6">
            <Text className="text-lg font-rmedium">{item.title}</Text>
            <Text className="text-sm text-gray-500">{item.content}</Text>
            <Text className="text-xs text-gray-400 mt-1">{new Date(item.date).toLocaleString()}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const ActivityChart = () => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    // <LineChart
    //   data={data}
    //   width={screenWidth - 40}
    //   height={220}
    //   chartConfig={chartConfig}
    //   bezier
    //   style={{
    //     marginVertical: 8,
    //     borderRadius: 16
    //   }}
    // />
    <></>
  );
};

const ActivityPage = () => {
  const theme = useTheme();

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        className="p-5 pt-12 rounded-b-3xl"
      >
        <Text className="text-3xl font-rbold mb-2 text-white">Activity Overview</Text>
        <Text className="text-base font-rregular mb-5 text-white opacity-80">
          Here's a summary of your recent platform activity
        </Text>
        
        <View className="flex-row justify-between mb-5">
          <ActivityCard icon="file-text" title="Posts" count={mockUserActivity.posts.length} color="#FF6B6B" />
          <ActivityCard icon="message-square" title="Comments" count={mockUserActivity.comments.length} color="#4ECDC4" />
        </View>
        
        <View className="flex-row justify-between">
          <ActivityCard icon="heart" title="Likes" count={mockUserActivity.likes.length} color="#FF69B4" />
          <ActivityCard icon="bookmark" title="Saves" count={mockUserActivity.saves.length} color="#FFA500" />
        </View>
      </LinearGradient>

      <View className="p-5">
        <Text className="text-2xl font-rbold mb-4">Activity Stats</Text>
        <ActivityChart />

        <Text className="text-2xl font-rbold mt-6 mb-4">Recent Activity</Text>
        <ActivityTimeline 
          data={[
            ...mockUserActivity.posts.map(post => ({
              id: post.id,
              title: 'Created a Post',
              content: post.title,
              date: post.createdAt
            })),
            ...mockUserActivity.comments.map(comment => ({
              id: comment.id,
              title: 'Left a Comment',
              content: comment.content,
              date: comment.createdAt
            }))
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)}
        />

        <Text className="text-2xl font-rbold mt-6 mb-4">Server Memberships</Text>
        {mockUserActivity.serverMemberships.map(membership => (
          <View key={membership.id} className="bg-white rounded-xl p-4 shadow-md mb-3">
            <Text className="text-lg font-rmedium">{`Server: ${membership.serverId}`}</Text>
            <Text className="text-sm text-gray-500">{`Role: ${membership.role}`}</Text>
            <Text className="text-xs text-gray-400 mt-1">
              {`Joined: ${new Date(membership.joinedAt).toLocaleDateString()}`}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ActivityPage;