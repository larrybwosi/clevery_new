import { useState, useRef, useEffect } from 'react';
import { Pressable, Dimensions, Image, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, interpolate, useAnimatedScrollHandler } from 'react-native-reanimated';
import { Text, View } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const Custom = Animated.createAnimatedComponent(LinearGradient);

const { width: screenWidth } = Dimensions.get('window');

  const carouselItems = [
    { 
      title: "Connect Globally", 
      description: "Meet people from all around the world", 
      image: "https://picsum.photos/seed/clevery1/800/400" 
    },
    { 
      title: "Share Your Moments", 
      description: "Capture and share your life's highlights", 
      image: "https://picsum.photos/seed/clevery2/800/400" 
    },
    { 
      title: "Discover Trends", 
      description: "Stay up-to-date with the latest trends", 
      image: "https://picsum.photos/seed/clevery3/800/400" 
    },
  ];
const FeatureSection = ({ title, content, icon }) => {
  return (
    <Animated.View entering={FadeInDown.delay(300).duration(500)} className="mb-6 rounded-lg shadow-md p-2">
      <View className="flex-row items-center mb-2">
        <Feather name={icon} size={24} color="#4A90E2" className="mr-3" />
        <Text className="text-lg font-rmedium">{title}</Text>
      </View>
      <Text className="text-base font-rregular text-gray-600">{content}</Text>
    </Animated.View>
  );
};

const CarouselItem = ({ item }) => {
  return (
    <View className="bg-white rounded-lg overflow-hidden" style={{ width: screenWidth - 80, marginHorizontal: 10 }}>
      <Image source={{ uri: item.image }} className="w-full h-40" />
      <View className="p-4">
        <Text className="text-lg font-rmedium mb-2">{item.title}</Text>
        <Text className="text-base font-rregular text-gray-600">{item.description}</Text>
      </View>
    </View>
  );
};

const WelcomePage = () => {
  const theme = useTheme();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const checkboxScale = useSharedValue(1);
  const scrollY = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);


  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndex === carouselItems.length - 1) {
        flatListRef.current.scrollToIndex({ index: 0, animated: true });
      } else {
        flatListRef.current.scrollToIndex({ index: activeIndex + 1, animated: true });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);


  const Carousel = ({ data }) => {

  const renderDotIndicator = () => {
    return (
      <View className="flex-row justify-center mt-2">
        {data.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? 'bg-cyan-600' : 'bg-gray-300'}`}
          />
        ))}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => <CarouselItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToInterval={screenWidth - 60}
        snapToAlignment="center"
        decelerationRate="fast"
      />
      {renderDotIndicator()}
    </View>
  );
};
  const features = [
    {
      title: "Connect & Socialize",
      content: "Build your network, find friends with similar interests, and stay connected with the people who matter most to you.",
      icon: "users"
    },
    {
      title: "Popularity Battles",
      content: "Participate in fun, friendly competitions to see who can gain the most likes, shares, or followers in a given time period.",
      icon: "trending-up"
    },
    {
      title: "Achievements & Badges",
      content: "Complete challenges and earn unique badges to showcase your accomplishments and stand out in the community.",
      icon: "award"
    },
    {
      title: "Direct Messaging",
      content: "Chat privately with friends, share moments, and build deeper connections through our secure messaging system.",
      icon: "message-square"
    },
    {
      title: "Create & Share Posts",
      content: "Express yourself through text, images, and videos. Share your thoughts, experiences, and creativity with the world.",
      icon: "edit-3"
    },
    {
      title: "Channels & Servers",
      content: "Join interest-based channels or create your own. Hang out with friends in server channels for group discussions and activities.",
      icon: "hash"
    }
  ];


  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale.value }],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0]);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -50]);
    return { opacity, transform: [{ translateY }] };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onCheckboxPress = () => {
    setTermsAccepted(!termsAccepted);
    // checkboxScale.value = withSpring(termsAccepted ? 1 : 0.9);
  };

  return (
    <View className="flex-1 mt-7" style={{ backgroundColor: theme.colors.background }}>
      <Animated.View style={headerAnimatedStyle} className="absolute top-0 left-0 right-0 z-10 p-5 bg-cyan-600">
        <Text className="text-4xl font-rbold text-white">Welcome to Clevery</Text>
        <Text className="text-xl font-rmedium text-white">Your new social playground awaits!</Text>
      </Animated.View>

      <Animated.ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingTop: 120, paddingBottom: 40, paddingHorizontal: 20 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View entering={FadeIn.delay(400).duration(500)} className="rounded-lg p-4 mb-8">
          <Text className="text-lg font-rmedium mb-2">Dive into a World of Connections</Text>
          <Text className="text-base font-rregular text-gray-600">
            Clevery is more than just a social media app - it's a vibrant community where you can express yourself, compete in fun challenges, and forge meaningful connections. Get ready to explore, create, and connect like never before!
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(600).duration(500)} className="mb-8">
          <Text className="text-2xl font-rbold mb-4">Discover Clevery</Text>
          <Carousel data={carouselItems} />
        </Animated.View>

        <Text className="text-2xl font-rbold mb-4">Key Features</Text>
        {features.map((feature, index) => (
          <FeatureSection key={index} {...feature} />
        ))}

        <Animated.View entering={FadeIn.delay(800).duration(500)} className="mt-8 bg-cyan-600 rounded-lg p-4">
          <Text className="text-lg font-rmedium mb-2 text-white">Ready to Join the Fun?</Text>
          <Text className="text-base font-rregular mb-4 text-white">
            Customize your profile or jump right in. Your Clevery adventure begins now!
          </Text>

          <View className="flex-row items-center mb-4 z-10 bg-cyan-600">
            <AnimatedPressable
              onPress={onCheckboxPress}
              style={buttonAnimatedStyle}
              className="mr-2"
            >
              <Feather 
                name={termsAccepted ? "check-square" : "square"} 
                size={24} 
                color="#FFFFFF" 
              />
            </AnimatedPressable>
            <Text className="text-base font-rregular text-white">
              I accept the <Text className="text-blue-300 underline" onPress={() => {}}>Terms of Service</Text>
            </Text>
          </View>

          <View className="flex-row justify-between bg-cyan-600">
            <Pressable
              onPress={() => router.navigate('/sign-up')}
              disabled={!termsAccepted}
              className={`bg-blue-500 py-3 z-20 bottom-0 px-6 rounded-full ${!termsAccepted ? 'opacity-50' : ''}`}
            >
              <Text className="font-rbold text-white">Start Exploring</Text>
            </Pressable>
            <Pressable
              onPress={() => router.navigate('/editprofile')}
              disabled={!termsAccepted}
              className={`bg-gray-700 py-3 z-20 bottom-0 px-6 rounded-full ${!termsAccepted ? 'opacity-50' : ''}`}
            >
              <Text className="font-rbold ">Customize Profile</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default WelcomePage;