import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { multiFormatDateString, useUser } from '@/lib';
import { Loader, UserInfo } from '@/components';
import MembersList from '@/components/members-list';
import Image from '@/components/image';
import { Server, User } from '@/types';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const UserBanner = ({ bannerImage }: { bannerImage: string }) => (
  <Animated.View entering={FadeInDown.duration(800).springify()} className="relative">
    <Image
      source={bannerImage}
      width={350}
      height={192}
      style="w-full h-56 rounded-b-3xl"
    />
    <AnimatedLinearGradient
      colors={['rgba(0,0,0,0.6)', 'transparent']}
      className="absolute top-0 left-0 right-0 h-28"
      entering={FadeIn.duration(1000)}
    />
  </Animated.View>
);
interface Content {
  id: string;
  name: string;
  image: string;
}[];

const UserSection = ({ title, content, icon }: { title: string; content: Content; icon: string }) => (
  <Animated.View 
    className="m-4 p-4 bg-white rounded-xl shadow-md"
    entering={FadeInRight.duration(600).delay(200).springify()}
  >
    <View className="flex-row items-center mb-2">
      <FontAwesome5 name={icon} size={20} color="#4A5568" />
      <Text className="text-lg font-bold ml-2 text-gray-700">{title}</Text>
    </View>
    {/* {content ? (
      <View className="flex-row flex-wrap">
        {content?.map((item) => (
          <View key={item.id} className="mr-2 mb-2">
            <Image 
              source={ item.image! } height={50} width={50} style="w-12 h-12 rounded-full" />
          </View>
        ))}
      </View>
    ) : (
      <Text className="text-base italic text-gray-400">No data available</Text>
    )} */}
  </Animated.View>
);

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm flex-1 mr-2 items-center">
    <FontAwesome5 name={icon} size={24} color="#4299E1" />
    <Text className="text-lg font-bold mt-2 text-gray-700">{value}</Text>
    <Text className="text-sm text-gray-500">{title}</Text>
  </View>
);

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const { data: user, isPending: loading, isError: netError } = useUser(id as string);

  if (loading || netError) {
    return <Loader loadingText="Loading user profile..." />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <UserBanner bannerImage={user?.bannerImage || ''} />
      <View className="px-4 -mt-16">
        <UserInfo profile={user} />
      </View>

      <Animated.View 
        className="m-4 p-4 bg-white rounded-xl shadow-md"
        entering={FadeInDown.duration(600).delay(400).springify()}
      >
        <Text className="text-xl font-bold mb-2 text-gray-700">About Me</Text>
        <Text className="text-base text-gray-600">{user?.bio || 'No bio available'}</Text>
      </Animated.View>

      <Animated.View 
        className="flex-row justify-between mx-4 mb-4"
        entering={FadeInRight.duration(600).delay(300).springify()}
      >
        <StatCard title="Posts" value={user?.posts || 0} icon="pen-square" />
        <StatCard title="Popularity" value={user?.userScore || 0} icon="star" />
        {/* <StatCard title="Friends" value={user?.friends?.length || 0} icon="user-friends" /> */}
      </Animated.View>

      <UserSection 
        title="Member Since" 
        content={multiFormatDateString(user?.createdAt)}
        icon="calendar-alt"
      />
      
      <Animated.View 
        className="m-4"
        entering={FadeInRight.duration(600).delay(600).springify()}
      >
        <Text className="text-xl font-bold mb-2 text-gray-700">Mutual Friends</Text>
        {user?.commonFriends ? (
          <MembersList 
            label="Mutual Friends"
            images={user.commonFriends.map(usr => usr?.image)} 
          />
        ) : (
          <Text className="text-base italic text-gray-400">No mutual friends yet</Text>
        )}
      </Animated.View>

      <UserSection title="Mutual Servers" icon="server" content={user?.commonServers} />
      <UserSection title="Connections" icon="users" content={user?.connections} />

      <TouchableOpacity 
        className="flex-row items-center justify-center m-4 p-4 bg-blue-500 rounded-xl shadow-md"
        onPress={() => router.push(`/conversation/${id}`)}
      >
        <Text className="text-lg font-bold text-white mr-2">
          {user?.isFriend ? 'Message' : 'Add Friend'}
        </Text>
        <Ionicons name={user?.isFriend ? "chatbubble-outline" : "person-add-outline"} size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserProfile;