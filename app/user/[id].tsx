import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import { Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import {LinearGradient, Text ,View } from '@/components';
import { formatDateString, useThemeStore, useUser } from '@/lib';
import MembersList from '@/components/members-list';
import Image from '@/components/image';
import { User } from '@/types';
import Badge from '@/components/badges/user';
import { useThemeColor } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { AvatarImage } from '@/components/ui/avatar';
import UserInfo from '@/components/Profile/user-info';

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface UserBannerProps {
  bannerImage: string;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  popularity?: number | string;
}

const UserBanner: React.FC<UserBannerProps> = ({ bannerImage }) => (
  <AnimatedBox entering={FadeInDown.duration(800).springify()} >
    <Image
      source={bannerImage}
      width={350}
      height={192}
      style="w-full h-56"
    />
    <AnimatedBox
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 112
      }}
      entering={FadeIn.duration(1000)}
    />
  </AnimatedBox>
);


const StatCard: React.FC<StatCardProps> = ({ title, value, icon,popularity }) => {
  
  return (
    <LinearGradient
      className='flex-1 items-center p-1 rounded-xl shadow-md'
      colors= {['gray.400', '#3b5998', '#192f6a']}
      start= {[0, 0]}
      end= {[1, 1]}
    >
      {title === "Popularity"
      ?
      //  <Icon as={Badge} name={icon} size={6} color={colors.blue[500]} mr={4}/>
       <Badge popularity={popularity|| 1} />
      :<FontAwesome5  name={icon}  size={6} color={'blue'} />
      }
      <Text className='font-rbold text-lg'>{value}</Text>
      <Text className='font-rregular'>{title}</Text>
    </LinearGradient>
  );
};

interface UserSectionProps {
  title: string;
  content: React.ReactNode;
  icon: string;
}

const UserSection: React.FC<UserSectionProps> = ({ title, content, icon }) => (
  <AnimatedLinearGradient 
    m={4} p={4} rounded="xl" shadow={2}
    entering={FadeInRight.duration(600).delay(200).springify()}
    bg={{
      linearGradient: {
        colors: ['gray.400', '#3b5998', '#192f6a'],
        start: [0, 0],
        end: [1, 1],
      },
    }}
  >
    <HStack className='items-center mb-2' >
      <Icon as={FontAwesome5} name={icon} size={5} color="gray.600" />
      <Text className='font-rbold ml-5'>{title}</Text>
    </HStack>
    {content}
  </AnimatedLinearGradient>
);

const UserProfile: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: user, isPending: loading, isError: netError } = useUser(id as string);

  if (loading || netError) {
    return <Loader loadingText="Loading user profile..." />;
  }

  if (!user) {
    return <Text>User not found</Text>;
  }
  
  return (
    <ScrollView className='flex-1 w-full h-full'>
      <UserBanner bannerImage={user.bannerImage || ''} />
      <Box className='px-4 mt-5' >
        <UserInfo profile={user} />
      </Box>

      <AnimatedLinearGradient 
        className={`m-1 p-1 rounded-xl shadow-md`}
        entering={FadeInDown.duration(600).delay(400).springify()}
        colors= {['gray.400', '#3b5998', '#192f6a']}
        start= {[0, 0]}
        end= {[1, 1]}
      >
        <Text className='font-rbold text-lg'>About Me</Text>
        <Text className='font-rregular text-sm'>{user.bio || 'No bio available'}</Text>
      </AnimatedLinearGradient>

      <AnimatedBox 
        className={`flex-row justify-between mx1 mb-4`}
        entering={FadeInRight.duration(600).delay(300).springify()}
      >
        <StatCard title="Posts" value={user.postCount || 0} icon="pen-square" />
        <StatCard title="Friends" value={user.friends?.length || 0} icon="user-friends" />
        <StatCard title="Popularity" value={user.userScore || 0} icon="star" popularity={user.userScore || 0}/>
      </AnimatedBox>

      <UserSection 
        title="Member Since" 
        content={<Text className='font-rregular text-sm'>{formatDateString(user.createdAt)}</Text>}
        icon="calendar-alt"
      />
      
      <AnimatedLinearGradient
        className={`m-2`}
        entering={FadeInRight.duration(600).delay(600).springify()}
        entering={FadeInDown.duration(600).delay(400).springify()}
        colors={['gray.400', '#3b5998', '#192f6a']}
        start={[0, 0]}
        end={[1, 1]}
      >
        <Text className='font-rbold text-lg'>Mutual Friends</Text>
        {user.commonFriends && user.commonFriends.length > 0 ? (
          <MembersList 
            label="Mutual Friends"
            images={user.commonFriends.map(friend => friend?.image)} 
          />
        ) : (
          <Text className='text-white'>No mutual friends yet</Text>
        )}
      </AnimatedLinearGradient>

      <UserSection 
        title="Mutual Servers" 
        icon="server" 
        content={
          <VStack className='gap-3'>
            {user.commonServers?.map((server: any) => (
              <HStack key={server.id} className='items-center'>
                <AvatarImage source={{ uri: server.image }} className='mr-1' />
                <Text className='font-rregular text-sm'>{server.name}</Text>
              </HStack>
            ))}
          </VStack>
        } 
      />

      <UserSection 
        title="Connections" 
        icon="users" 
        content={
          <HStack className='flex-wrap'>
            {user.connections?.map((connection: User) => (
              // <Badge key={connection.id} colorScheme="blue" m={1}>
              //   {connection.username}
              // </Badge>
              <></>
            ))}
          </HStack>
        } 
      />

      <UserSection
        title="Achievements"
        icon="trophy"
        content={
          <VStack className="space-y-2" >
            {user?.achievements?.map((achievement:any, index:any) => (
              <HStack key={index} className='items-center' >
                <FontAwesome5 name="medal" size={4} color={"yellow"} mr={2} />
                <Text className='font-rregular text-sm'>{achievement}</Text>
              </HStack>
            ))}
          </VStack>
        }
      />
    </ScrollView>
  );
};

export default UserProfile;