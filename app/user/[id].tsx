import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { multiFormatDateString, useUser } from '@/lib';
import { Loader, UserInfo } from '@/components';
import MembersList from '@/components/members-list';
import Image from '@/components/image';

const UserBanner = ({ bannerImage }: { bannerImage: string }) => (
  <Animated.View entering={FadeInDown.duration(800).springify()}>
    <Image
      source={ bannerImage}
      style="w-full h-48 rounded-b-3xl"
      width={350}
      height={192}
    />
  </Animated.View>
);

const UserSection = ({ title, content }: { title: string; content?: any }) => (
  <Animated.View 
    className="m-4 p-4 bg-white rounded-xl shadow-md"
    entering={FadeInRight.duration(600).delay(200).springify()}
  >
    <Text className="text-lg font-semibold mb-2 text-gray-800">{title}</Text>
    {content ? (
      <Text className="text-gray-600">{content}</Text>
    ) : (
      <Text className="text-gray-400 italic">No data available</Text>
    )}
  </Animated.View>
);

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const { data: user, isPending: loading, isError: netError } = useUser(id as string);

  console.log(user)
  if (loading || netError) {
    return <Loader loadingText="Loading user profile..." />;
  }

  return (
    <ScrollView className="bg-gray-100">
      <UserBanner bannerImage={user?.bannerImage!} />
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent']}
        className="absolute top-0 left-0 right-0 h-24"
      />
      <View className="px-4 -mt-16">
        <UserInfo profile={user} />
      </View>

      <Animated.View 
        className="m-4"
        entering={FadeInDown.duration(600).delay(400).springify()}
      >
        <Text className="text-xl font-bold mb-2 text-gray-800">About Me</Text>
        <Text className="text-gray-600">{user?.bio || 'No bio available'}</Text>
      </Animated.View>

      <UserSection 
        title="Member Since" 
        content={multiFormatDateString(user?.createdAt)} 
      />
      
      <Animated.View 
        className="m-4"
        entering={FadeInRight.duration(600).delay(600).springify()}
      >
        <Text className="text-xl font-bold mb-2 text-gray-800">Mutual Friends</Text>
        {user?.commonFriends? (
          <MembersList 
            label="Mutual Friends"
            images={user.commonFriends.map(usr => usr?.image)} 
          />
        ) : (
          <Text className="text-gray-400 italic">No mutual friends yet</Text>
        )}
      </Animated.View>

      <UserSection title="Mutual Servers" />
      <UserSection title="Connections" />

      <TouchableOpacity 
        className="m-4 p-4 bg-blue-500 rounded-xl"
        onPress={() => router.push(`/conversation/${id}`)}
      >
        <Text className="text-white text-center font-semibold">Start Conversation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserProfile;