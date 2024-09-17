import { useState, useRef } from 'react';
import { Pressable, FlatList, Dimensions } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { HStack, Loader, MenuItems, Text, UserInfo, View } from '@/components';
import { formatDateString, useProfileStore } from '@/lib';
import Image from '@/components/image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { profile } = useProfileStore();
  const scrollY = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef(null);

  if (!profile) return <Loader loadingText='Loading Profile'/>;

  const stats = {
    Posts: 0,
    Friends: profile?.friends?.length || 0,
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const horizontalScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [250, 100],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity: interpolate(scrollY.value, [0, 100], [1, 0.8], Extrapolation.CLAMP),
    };
  });
  
  const renderItem = ({ item }) => {
    if (item.type === 'menu') return <MenuItems />;
    if (item.type === 'friends') return <FriendsComponent friends={profile.friends} />;
    return null;
  };

  const renderTab = (tabIndex) => {
    if (tabIndex === 0) {
      return (
        <FlatList
          data={[{ type: 'menu' }, { type: 'friends' }]}
          renderItem={renderItem}
          keyExtractor={item => item.type}
        />
      );
    } else {
      return <Text>Gallery</Text>;
    }
  };

  return (
    <View className='flex-1'>
      <Animated.View style={[headerAnimatedStyle, { overflow: 'hidden' }]}>
        <Image 
          source={ profile.bannerImage ? profile.bannerImage : '' } 
          height={250}
          width={350}
          style='w-full justify-end items-center h-full' 
        />
      </Animated.View>
      
      <Pressable 
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 20,
          padding: 8,
        }} 
        onPress={() => router.push("/editprofile")}
      >
        <Feather name='edit' size={24} color="white" />
      </Pressable>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className='flex-row justify-between'>
          <UserInfo profile={profile} />
          <View className='flex-row justify-between items-center gap-1 mr-4 mt-3'>
            {Object.entries(stats).map(([label, number]) => (
              <View key={label} className='flex-col items-center mt-3'>
                <Text className='font-pregular text-[15px]'>{number}</Text>
                <Text className='font-rregular text-[10px] p-1 rounded-[9px]'>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='mx-2.5'>
          <Text className='font-rmedium mt-3.5'>
            About Me : 
            <Text className='font-pmedium mt-2.5 text-xs ml-3'>
              {profile.bio}
            </Text>
          </Text>
          <Text className='font-rmedium mt-3.5'>
            Member Since : {' '}
            <Text className='font-pregular mt-2.5 text-xs ml-3'>
              {profile.createdAt && formatDateString(profile.createdAt)}
            </Text>
          </Text>
        </View>

        <View className='flex-row justify-between items-center p-5 me-12 ms-12'>
          {['Profile', 'Gallery'].map((tab, index) => (
            <Pressable 
              key={tab}
              onPress={() => {
                setActiveTab(index);
                scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
              }}
              className={`flex flex-row gap-2.5 ${activeTab === index ? 'bg-light px-[5px] py-1 rounded-[5px] h-7' : ''}`}
            >
              <Text className={`font-rmedium tex-sm ${activeTab === index ? 'text-white mr-2' : ''}`}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={horizontalScrollHandler}
          scrollEventThrottle={16}
        >
          <View style={{ width: SCREEN_WIDTH }}>{renderTab(0)}</View>
          <View style={{ width: SCREEN_WIDTH }}>{renderTab(1)}</View>
        </Animated.ScrollView>
      </Animated.ScrollView>
    </View>
  );
};

const FriendsComponent = ({friends}) => {
  if(!friends || friends.length === 0) return <Text>You have no friends yet</Text>;

  return (
    <View>
      <Text className='font-rmedium p-2.5'>Your Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <HStack className='flex flex-row items-center px-4xs py-1 space-x-1'>
            <View className='mr-2.5'>
              <Image 
                source={ item.image?item.image:"https://via.placeholder.com/150" } 
                style='w-12.5 h-12.5 rounded-[25px]' 
                height={50}
                width={50}
              />
            </View>
            <HStack space='sm' className='flex-1'>
              <View className='flex-1'>
                <Text className='font-rmedium mt-1.5 text-sm'>{item.name}</Text>
                <Text className='text-gray-400 text-xs font-rthin' >@{item.username || item.name}</Text>
              </View>
              <Text className='font-rthin text-[10px] '>Friends since {item.createdAt && formatDateString(item.createdAt)}</Text>
            </HStack>
          </HStack>
        )}
      />
    </View>
  );
};

export default ProfilePage;