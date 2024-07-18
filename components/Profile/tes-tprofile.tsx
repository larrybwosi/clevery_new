import React, { useState, useCallback, useMemo } from 'react';
import { TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { TabView, SceneMap } from 'react-native-tab-view';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate 
} from 'react-native-reanimated';
import { Loader, MenuItems, Text, UserCard, UserInfo, View } from '@/components';
import { urlForImage, useGetUserPosts, useProfileStore } from '@/lib';
import { User } from '@/types';
import { format, parseISO } from 'date-fns';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

const HEADER_HEIGHT = 200;

const UserNavigate = (userId: string) => {
  router.navigate(`/conversation/${userId}`);
};

const Stat = ({ number, label }: { number: number; label: string }) => (
  <View className="items-center ml-4">
    <Text className="text-lg font-bold">{number}</Text>
    <Text className="text-xs text-gray-600">{label}</Text>
  </View>
);

const FriendsComponent = React.memo(({ friends }: { friends: User[] }) => {
  if (!friends || friends.length === 0) 
    return <Text className="text-base text-center m-4 text-gray-600">You have no friends yet</Text>;

  return (
    <View>
      <Text className="text-lg font-bold m-4">Your Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
          <UserCard
            key={item?._id}
            user={item}
            handleAddFriend={() => {}}
            showlastMessage={false}
            onSelectUser={() => UserNavigate(item?._id)}
            isFriend
          />
        )}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
});

const ProfileTab = React.memo(() => {
  const { profile } = useProfileStore();
  const data = useMemo(() => [{ type: 'menu' }, { type: 'friends' }], []);

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (item.type === 'menu') return <MenuItems />;
    if (item.type === 'friends') return <FriendsComponent friends={profile?.friends!} />;
    return null;
  }, [profile?.friends]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.type}
    />
  );
});

const GalleryTab = React.memo(() => (
  <View className="flex-1 justify-center items-center">
    <Text>Gallery</Text>
  </View>
));

const ProfilePage = () => {
  const { profile } = useProfileStore();
  const { data: posts } = useGetUserPosts(profile?._id);
  const [index, setIndex] = useState(0);
  const scrollY = useSharedValue(0);

  const routes = [
    { key: 'profile', title: 'Profile' },
    { key: 'gallery', title: 'Gallery' },
  ];

  const renderScene = SceneMap({
    profile: ProfileTab,
    gallery: GalleryTab,
  });

  const stats = useMemo(() => ({
    Posts: posts?.length || 0,
    Friends: profile?.friends?.length || 0,
  }), [posts, profile]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [HEADER_HEIGHT, StatusBar.currentHeight || 0],
      'clamp'
    );

    return {
      height: headerHeight,
    };
  });

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  if (!profile) return <Loader loadingText='Loading Profile' />;

  return (
    <View className="flex-1 bg-gray-100">
      <Animated.View className="absolute top-0 left-0 right-0 overflow-hidden z-10" style={headerAnimatedStyle}>
        <Image
          source={{ uri: profile.bannerImage ? urlForImage(profile.bannerImage).width(350).url() : '' }}
          className="w-full h-full"
          placeholder={require('@/assets/images/placeholder.png')}
          transition={1000}
        />
        <TouchableOpacity 
          className="absolute top-10 right-5 bg-black/50 rounded-full p-2"
          onPress={() => router.navigate("/editprofile")}
        >
          <Feather name='edit' size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
      >
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <UserInfo profile={profile} />
          <View className="flex-row">
            <Stat number={stats.Posts} label="Posts" />
            <Stat number={stats.Friends} label="Friends" />
          </View>
        </View>

        <View className="p-4 bg-white mt-2">
          <Text className="text-base font-bold mb-2">About Me:</Text>
          <Text className="text-sm text-gray-700 mb-2">{profile?.bio}</Text>
          <Text className="text-xs text-gray-600">
            Member Since: {profile?._createdAt && format(parseISO(profile?._createdAt as string), 'dd MMM yyyy')}
          </Text>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: 350 }}
          renderTabBar={props => (
            <View className="flex-row bg-white">
              {props.navigationState.routes.map((route, i) => (
                <TouchableOpacity
                  key={route.key}
                  className={`flex-1 py-3 ${i === props.navigationState.index ? 'border-b-2 border-blue-500' : ''}`}
                  onPress={() => props.jumpTo(route.key)}
                >
                  <Text className={`text-center ${i === props.navigationState.index ? 'text-blue-500 font-bold' : 'text-gray-600'}`}>
                    {route.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default ProfilePage;