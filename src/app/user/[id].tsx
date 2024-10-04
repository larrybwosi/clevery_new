import { Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  withSpring,
} from 'react-native-reanimated';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, HStack, Loader, Text, View, VStack } from '@/components';
import UserInfo from '@/components/profile/user-info';
import { useUser } from '@/lib';
import { Image } from 'expo-image';
import { Server, User } from '@/types';

interface Connection {
  id: string;
  platform: string;
  username: string;
  icon: keyof typeof FontAwesome5.glyphMap;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BANNER_HEIGHT = SCREEN_HEIGHT * 0.35;


const AnimatedCard: React.FC<{ children: React.ReactNode; entering?: any }> = ({ children, entering }) => (
  <Animated.View
    entering={entering || FadeIn.duration(600).springify()}
    style={{ margin: 8, padding: 16, backgroundColor: 'white', borderRadius: 8, shadowOpacity: 0.25, elevation: 4 }}
  >
    {children}
  </Animated.View>
);

const UserBanner: React.FC<{ bannerImage: string; scrollY: any }> = ({ bannerImage, scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        scale: interpolate(scrollY.value, [-BANNER_HEIGHT, 0, BANNER_HEIGHT], [2, 1, 0.75], Extrapolation.CLAMP),
      },
      {
        translateY: interpolate(scrollY.value, [0, BANNER_HEIGHT], [0, BANNER_HEIGHT / 4], Extrapolation.CLAMP),
      }
    ],
  }));

  return (
    <Animated.View style={[{ height: BANNER_HEIGHT, overflow: 'hidden' }, animatedStyle]}>
      <Image source={bannerImage} width={SCREEN_WIDTH} height={BANNER_HEIGHT} style="w-full h-full mb-6" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: BANNER_HEIGHT / 2,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      />
    </Animated.View>
  );
};


const Avatar: React.FC<{ source: string }> = ({ source }) => (
  <Image
    source={source}
    width={40}
    height={40}
    style="rounded-full border-2 border-white"
  />
);

const Tag: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <Box
    className="px-3 py-1.5 rounded-full mr-2 mb-2"
    style={{
      backgroundColor: `${color}15`,
    }}
  >
    <Text style={{ color }} className='font-rregular text-sm'>{label}</Text>
  </Box>
);


export const MemberSinceSection: React.FC<{ date: string }> = ({ date }) => (
  <UserSection title="Member Since" icon="calendar-alt" accentColor="#8B5CF6">
    <HStack className="items-center space-x-3">
      <Box className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#8B5CF615' }}>
        <Text className="text-2xl" style={{ color: '#8B5CF6' }}>{new Date(date).getDate()}</Text>
      </Box>
      <VStack>
        <Text className=" font-semibold text-gray-800 font-rregular text-sm">
          {new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <Text className="text-sm text-gray-500 font-rregular">
          {`${Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 365))} years of awesome`}
        </Text>
      </VStack>
    </HStack>
  </UserSection>
);


export const MutualFriendsSection: React.FC<{ friends: User[] }> = ({ friends }) => (
  <UserSection title="Mutual Friends" icon="users" accentColor="#EC4899" isExpandable>
    <HStack className="items-center mb-4 space-x-2">
      {friends.map(friend => <Avatar key={friend.id} source={friend.image} />)}
      <Text className="text-gray-600 font-rregular">{friends.length} mutual friend{friends.length !== 1 ? 's' : ''}</Text>
    </HStack>
    {friends.map(friend => (
      <HStack key={friend.id} className="items-center space-x-3">
        <Avatar source={friend.image} />
        <Text className="flex-1 text-gray-800 font-rregular">{friend.username}</Text>
        <Pressable className="bg-pink-100 rounded-full p-2">
          <FontAwesome5 name="user" size={14} color="#EC4899" />
        </Pressable>
      </HStack>
    ))}
  </UserSection>
);

export const MutualServersSection: React.FC<{ servers: Server[] }> = ({ servers }) => (
  <UserSection title="Mutual Servers" icon="server" accentColor="#10B981">
    {servers.map(server => (
      <Pressable key={server.id} className='space-y-2 mb-3'>
        <HStack className="items-center space-x-4">
          <Image source={{ uri: server.image }} style={{ width: 48, height: 48, borderRadius: 12 }} />
          <VStack className="flex-1">
            <Text className="font-rbold ml-3 text-gray-800">{server.name}</Text>
            <Text className="text-sm text-gray-500 font-rregular ml-3">{server.memberCount} members</Text>
          </VStack>
          <Box className="p-2 rounded-full" style={{ backgroundColor: '#10B98110' }}>
            <FontAwesome5 name="chevron-right" size={14} color="#10B981" />
          </Box>
        </HStack>
      </Pressable>
    ))}
  </UserSection>
);


export const ConnectionsSection: React.FC<{ connections: Connection[] }> = ({ connections }) => (
  <UserSection title="Connections" icon="link" accentColor="#3B82F6">
    {connections.map(connection => (
      <HStack key={connection.id} className="items-center justify-between space-x-3">
        <Box className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#3B82F610' }}>
          <FontAwesome5 name={connection.icon} size={16} color="#3B82F6" />
        </Box>
        <VStack>
          <Text className="font-medium text-gray-800">{connection.platform}</Text>
          <Text className="text-sm text-gray-500">{connection.username}</Text>
        </VStack>
        <Pressable className="bg-blue-100 rounded-full p-2">
          <FontAwesome5 name="external-link-alt" size={14} color="#3B82F6" />
        </Pressable>
      </HStack>
    ))}
  </UserSection>
);

const hobbyToIcon = (hobby: string): keyof typeof FontAwesome5.glyphMap => {
  const hobbyIcons: Record<string, keyof typeof FontAwesome5.glyphMap> = {
    'reading': 'book',
    'gaming': 'gamepad',
    'cooking': 'utensils',
    'traveling': 'plane',
    'photography': 'camera',
    'music': 'music',
    'sports': 'futbol',
    'art': 'palette',
    'dancing': 'music', // Reusing music for dancing
    'hiking': 'hiking',
    'yoga': 'medkit',   // Yoga doesn't have a specific icon in FontAwesome, medkit works as a symbolic representation
    'coding': 'code',   // Coding has a specific icon
  };

  return hobbyIcons[hobby.toLowerCase()] || 'star';
};

export const HobbiesSection: React.FC<{ hobbies: string[] }> = ({ hobbies }) => (
  <UserSection title="Hobbies" icon="heart" accentColor="#F43F5E">
    <HStack className="flex-wrap -m-1">
      {hobbies.map((hobby, index) => (
        <Animated.View key={hobby} entering={FadeInRight.delay(index * 100)} className="m-1">
          <HStack className="items-center px-4 py-2 rounded-full space-x-2" style={{ backgroundColor: '#F43F5E10' }}>
            <FontAwesome5 name={hobbyToIcon(hobby)} size={14} color="#F43F5E" />
            <Text className='text-[#F43F5E] mx-2 font-rregular text-sm'>{hobby}</Text>
          </HStack>
        </Animated.View>
      ))}
    </HStack>
  </UserSection>
);


const StatCard: React.FC<{ title: string; value: number | string; icon: string }> = ({ title, value, icon }) => (
  <AnimatedCard>
    <FontAwesome5 name={icon} size={24} color="#4A5568" />
    <Text className="font-bold text-lg mt-2">{value}</Text>
    <Text className="text-sm text-gray-600">{title}</Text>
  </AnimatedCard>
);
interface UserSectionProps {
  title: string;
  icon: keyof typeof FontAwesome5.glyphMap;
  children: React.ReactNode;
  accentColor?: string;
  isExpandable?: boolean;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


const UserSection: React.FC<UserSectionProps> = ({
  title,
  icon,
  children,
  accentColor = '#3B82F6',
  isExpandable = false,
  onPress,
}) => {
  const baseAccentColor = `${accentColor}10`;
  const gradientColors = [baseAccentColor, `${accentColor}05`, 'transparent'];

  return (
    <AnimatedPressable
      onPress={onPress}
      entering={FadeInRight.duration(600).springify()}
    >
      <Animated.View
        entering={FadeIn.duration(400)}
        className="mb-6 overflow-hidden"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 20,
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4"
        >
          <HStack className="items-center justify-between">
            <HStack className="items-center space-x-3">
              <Box
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderRadius: 15,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: `${accentColor}30`,
                }}
              >
                <FontAwesome5 name={icon} size={20} color={accentColor} />
              </Box>
              <Text 
                className="text-xl font-rbold ml-4"
                style={{ color: accentColor }}
              >
                {title}
              </Text>
            </HStack>

            {isExpandable && (
              <Box
                style={{
                  backgroundColor: baseAccentColor,
                  borderRadius: 12,
                  padding: 8,
                }}
              >
                <FontAwesome5 
                  name="chevron-right" 
                  size={16} 
                  color={accentColor}
                />
              </Box>
            )}
          </HStack>
        </LinearGradient>
        <View className="p-4">
          {children}
        </View>
      </Animated.View>
    </AnimatedPressable>
  );
};


const UserProfile: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user, isPending: loading, isError: netError } = useUser(id as string);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, BANNER_HEIGHT / 2], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: withSpring(
          interpolate(scrollY.value, [0, BANNER_HEIGHT / 2], [-60, 0], Extrapolation.CLAMP)
        )
      }
    ],
  }));

  if (loading || netError) {
    return <Loader loadingText="Loading user profile..." />;
  }

  if (!user) {
    return <Text>User not found</Text>;
  }
   const mockData = {
    hobbies: ['Gaming', 'Reading', 'Music', 'Photography', 'Travel'],
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Sticky Header */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, zIndex: 100 }, headerStyle]}>
        <HStack className="justify-between items-center px-4 h-full bg-white/70 backdrop-blur-lg">
          <Text className="font-bold text-lg">{user.username}</Text>
          <Pressable>
            <Feather name="more-vertical" size={24} color="#4A5568" />
          </Pressable>
        </HStack>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 40 }}>
        <UserBanner bannerImage={user.bannerImage || ''} scrollY={scrollY} />

        {/* Profile and Info */}
        <AnimatedCard entering={FadeInDown.duration(800).springify()} >
          <UserInfo profile={user} />
        </AnimatedCard>

        <AnimatedCard>
          <Text className="font-bold text-lg mb-2">About Me</Text>
          <Text className="text-sm text-gray-700">{user.bio || 'No bio available'}</Text>
        </AnimatedCard>

        {/* Statistics and Sections */}
        <HStack className="justify-between mx-2 mb-4">
          <StatCard title="Posts" value={user.postCount || 0} icon="pen-square" />
          <StatCard title="Friends" value={user.friends?.length || 0} icon="user-friends" />
          <StatCard title="Popularity" value={`${user.userScore || 0}%`} icon="star" />
        </HStack>

        <MemberSinceSection date={user?.createdAt} />
        <MutualFriendsSection friends={user?.commonFriends || []} />
        <MutualServersSection servers={user?.commonServers || []} />
        <ConnectionsSection connections={user?.connections || []} />
        <HobbiesSection hobbies={user?.hobbies || []} />

        <UserSection 
        title="Achievements" 
        icon="trophy"
        accentColor="#F59E0B" // Yellow accent
      >
        {/* <HStack className="items-center justify-between">
          <HStack className="items-center">
            <Box
              style={{
                backgroundColor: '#F59E0B20',
                borderRadius: 12,
                padding: 8,
                marginRight: 12,
              }}
            >
              <FontAwesome5 name="medal" size={16} color="#F59E0B" />
            </Box>
            <Text className="text-gray-700">Early Adopter</Text>
          </HStack>
          <Text className="text-sm text-gray-500">Sep 2023</Text>
        </HStack> */}
        <Text>No archivements yet</Text>
      </UserSection>
      </Animated.ScrollView>
    </View>
  );
};

export default UserProfile;
