import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { FlatList, Dimensions, TouchableOpacity,} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  withTiming,
  useAnimatedRef,
  scrollTo,
} from 'react-native-reanimated';

import { Loader, MenuItems, Text, UserInfo, View } from '@/components';
import { formatDateString, useProfileStore } from '@/lib';
import Image from '@/components/image';
import {  Image as RNImage  } from 'expo-image';
import item from '@/components/chat/messages/item';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { profile } = useProfileStore();
  const scrollY = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();
  const [showVisitors, setShowVisitors] = useState(false);
  
  if (!profile) return <Loader loadingText='Loading Profile'/>;

  const stats = useMemo(() => ({
    Posts: 0,
    Friends: profile?.friends?.length || 0,
    Visitors: profile?.visitors?.length || 0,
  }), [profile]);

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
      [0, 175],
      [250, 175],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity: interpolate(scrollY.value, [0, 100], [1, 0.8], Extrapolation.CLAMP),
    };
  });

  const userInfoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -50],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'menu') return <MenuItems />;
    if (item.type === 'friends') return <FriendsComponent friends={profile.friends} />;
    if (item.type === 'hobbies') return <HobbiesComponent hobbies={profile.hobbies} />;
    return null;
  }, [profile]);

  const renderTab = useCallback((tabIndex) => {
    if (tabIndex === 0) {
      return (
        <FlatList
          data={[{ type: 'hobbies' }, { type: 'menu' }, { type: 'friends' }]}
          renderItem={renderItem}
          keyExtractor={item => item.type}
        />
      );
    } else {
      return <Text className="p-4 text-center">Gallery content goes here</Text>;
    }
  }, [renderItem]);

  const toggleVisitors = useCallback(() => {
    setShowVisitors((prev) => !prev);
  }, []);
  

  return (
    <View className="flex-1 bg-gray-100">
      <Animated.View style={[headerAnimatedStyle, { overflow: 'hidden' }]}>
        <Image
          source={profile.bannerImage ? profile.bannerImage : 'https://via.placeholder.com/350x250'} 
          // height={250}
          // width={350}
          style="w-full justify-end items-center h-full" 
          // style={{alignItems:'center',width:350, }} 
        />
      </Animated.View>
      
      <TouchableOpacity 
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
      </TouchableOpacity>

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
      >
        <Animated.View style={userInfoAnimatedStyle} className="rounded-t-3xl -mt-6 pt-4 px-4">
          <View className="flex-row justify-between items-start">
            <UserInfo profile={profile} />
            <View className="flex-row justify-between items-center gap-3 mr-4 mt-3">
              {Object.entries(stats).map(([label, number]) => (
                <TouchableOpacity 
                  key={label} 
                  className="flex-col items-center bg-gray-500 p-2 rounded-lg"
                  onPress={label === 'Visitors' ? toggleVisitors : undefined}
                >
                  <Text className="font-rbold text-lg">{number}</Text>
                  <Text className="font-rmedium text-xs text-gray-800">{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mt-4">
            <Text className="font-rmedium text-base">About Me:</Text>
            <Text className="text-sm text-gray-600 mt-1">{profile.bio}</Text>
          </View>

          <Text className="font-rmedium text-base mt-4">
            Member Since: {' '}
            <Text className="text-sm text-gray-600">
              {profile.createdAt && formatDateString(profile.createdAt)}
            </Text>
          </Text>
        </Animated.View>

        <View className="flex-row justify-around bg-white py-4 mt-2">
          {['Profile', 'Gallery'].map((tab, index) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => {
                setActiveTab(index);
                scrollTo(scrollViewRef, index * SCREEN_WIDTH, 0, true);
              }}
              className={`px-6 py-2 rounded-full ${activeTab === index ? 'bg-blue-500' : 'bg-gray-200'}`}
            >
              <Animated.Text className={`font-rmedium ${activeTab === index ? 'text-gray-300' : 'text-gray-700'}`}>{tab}</Animated.Text>
            </TouchableOpacity>
          ))}
        </View>

        <Animated.ScrollView
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

      <VisitorsModal visitors={profile.visitors} isVisible={showVisitors} onClose={toggleVisitors} />
    </View>
  );
};

const FriendsComponent = React.memo(({friends}:any) => {
  if(!friends || friends.length === 0) return <Text className="p-4 text-center">You have no friends yet</Text>;

  return (
    <View className="mt-2 p-4 rounded-lg">
      <Text className="font-rmedium text-lg mb-4">Your Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center mb-4">
            <RNImage 
              source={{uri:item.image ? item.image : "https://via.placeholder.com/50"}}
              style={{width:48,height:48, borderRadius:24, marginRight:1, borderColor:'gray', borderWidth:1, marginLeft:2}}
              height={48}
              width={48}
            />
            <View className="flex-1">
              <Text className="font-rmedium">{item.name}</Text>
              <Text className="text-gray-600 text-xs font-rregular">@{item.username || item.name}</Text>
            </View>
            <Text className="text-xs text-gray-500">Friends since {item.createdAt && formatDateString(item.createdAt)}</Text>
          </View>
        )}
      />
    </View>
  );
});

const HobbiesComponent = React.memo(({ hobbies }:any) => {
  return (
    <View className=" mt-2 p-4 rounded-lg">
      <Text className="font-rmedium text-lg mb-4">Hobbies</Text>
      <View className="flex-row flex-wrap">
        {hobbies.map((hobby, index) => (
          <Animated.View
            key={hobby}
            className={`m-1 p-2 bg-gray-500 rounded-full z-10 shadow-sm `}
          >
            <Text className={`font-rmedium`}>
              {hobby}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
});

const VisitorsModal = memo(({ visitors, isVisible, onClose }:any) => {
  const translateY = useSharedValue(300);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0);
    } else {
      translateY.value = withTiming(300);
    }
  }, [isVisible]);

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black bg-opacity-50 justify-end">
      <Animated.View style={modalStyle} className="rounded-t-3xl p-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-rbold text-xl">Recent Visitors</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color='gray' />
          </TouchableOpacity>
        </View>
        <FlatList
          data={visitors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row items-center mb-4">
              <Image 
                source={ item.image ? item.image : "https://via.placeholder.com/40" } 
                style="w-10 h-10 rounded-full mr-3" 
                height={40}
                width={40}
              />
              <View>
                <Text className="font-rmedium text-sm">{item.name}</Text>
                <Text className="text-gray-600 text-xs">Visited on {formatDateString(item.visitDate)}</Text>
              </View>
            </View>
          )}
        />
      </Animated.View>
    </View>
  );
});

export default ProfilePage;