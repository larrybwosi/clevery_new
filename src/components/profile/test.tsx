import { useState, useRef } from 'react';
import { ScrollView, Pressable, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { Text, View, FormControl, FormControlLabel, FormControlLabelText } from '@/components';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(Feather);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const { width: screenWidth } = Dimensions.get('window');

const features = [
  {
    title: "Connect & Socialize",
    content: "Build your network and find friends with similar interests.",
    icon: "users"
  },
  {
    title: "Share Your Moments",
    content: "Express yourself through posts, images, and videos.",
    icon: "camera"
  },
  {
    title: "Discover Trends",
    content: "Stay up-to-date with the latest community trends.",
    icon: "trending-up"
  },
];

const hobbies = [
  'Reading', 'Gaming', 'Cooking', 'Traveling', 'Photography', 'Music',
  'Sports', 'Art', 'Dancing', 'Hiking', 'Yoga', 'Coding'
];

const FeatureSection = ({ title, content, icon, index }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(index, [0, 2], [1, 0.5]),
    transform: [
      { translateX: interpolate(index, [0, 2], [0, 50]) },
      { scale: interpolate(index, [0, 2], [1, 0.9]) }
    ],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(300 * index).duration(500)} style={animatedStyle} className="mb-6 rounded-lg shadow-md p-4 ">
      <View className="flex-row items-center mb-2">
        <Feather name={icon} size={24} color="#4A90E2" className="mr-3" />
        <Text className="text-lg font-rmedium">{title}</Text>
      </View>
      <Text className="text-base font-rregular text-gray-600">{content}</Text>
    </Animated.View>
  );
};

const Welcome = () => {
  const theme = useTheme();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    hobbies: [],
    profileImage: null,
  });

  const scrollY = useSharedValue(0);
  const checkboxScale = useSharedValue(1);
  const scrollViewRef = useRef(null);

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
    checkboxScale.value = withSpring(termsAccepted ? 1 : 0.9);
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleHobbyToggle = (hobby) => {
    setProfile(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile(prev => ({ ...prev, profileImage: result.assets[0].uri }));
    }
  };

  return (
    <Animated.View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Animated.View style={headerAnimatedStyle} className="absolute top-0 left-0 right-0 z-10 p-5 bg-cyan-600">
        <Text className="text-4xl font-rbold text-white">Welcome to Clevery</Text>
        <Text className="text-xl font-rmedium text-white">Your social playground awaits!</Text>
      </Animated.View>

      <AnimatedScrollView 
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingTop: 120, paddingBottom: 40, paddingHorizontal: 20 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View entering={FadeIn.delay(400).duration(500)} className="rounded-lg p-4 mb-8 ">
          <Text className="text-lg font-rmedium mb-2">Dive into Connections</Text>
          <Text className="text-base font-rregular text-gray-600">
            Clevery is your vibrant community to express, compete, and connect. Ready to explore?
          </Text>
        </Animated.View>

        <Text className="text-2xl font-rbold mb-4">Key Features</Text>
        {features.map((feature, index) => (
          <FeatureSection key={index} {...feature} index={index} />
        ))}

        <Animated.View entering={FadeIn.delay(800).duration(500)} className="mt-8  rounded-lg p-4">
          <Text className="text-2xl font-rbold mb-4">Create Your Profile</Text>

          <TouchableOpacity onPress={pickImage} className="mb-6 items-center">
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} className="w-32 h-32 rounded-full" />
            ) : (
              <AnimatedIcon
                name="user-plus"
                size={64}
                color={theme.colors.primary}
              />
            )}
            <Text className="mt-2 text-base font-rmedium text-blue-500">
              {profile.profileImage ? 'Change Picture' : 'Add Picture'}
            </Text>
          </TouchableOpacity>

          <FormControl className="mb-4">
            <FormControlLabel>
              <FormControlLabelText>Your name</FormControlLabelText>
            </FormControlLabel>
            <TextInput
              value={profile.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your name"
              className="border border-gray-300 rounded-lg p-3 text-base"
              style={{ color: theme.colors.text }}
            />
          </FormControl>

          <FormControl className="mb-4">
            <FormControlLabel>
              <FormControlLabelText>Username</FormControlLabelText>
            </FormControlLabel>
            <TextInput
              value={profile.username}
              onChangeText={(text) => handleInputChange('username', text)}
              placeholder="Choose a unique username"
              className="border border-gray-300 rounded-lg p-3 text-base"
              style={{ color: theme.colors.text }}
            />
          </FormControl>

          <FormControl className="mb-4">
            <FormControlLabel>
              <FormControlLabelText>Your location</FormControlLabelText>
            </FormControlLabel>
            <TextInput
              value={profile.location}
              onChangeText={(text) => handleInputChange('location', text)}
              placeholder="Where are you based?"
              className="border border-gray-300 rounded-lg p-3 text-base"
              style={{ color: theme.colors.text }}
            />
          </FormControl>

          <FormControl className="mb-6">
            <FormControlLabel>
              <FormControlLabelText>Select your hobbies</FormControlLabelText>
            </FormControlLabel>
            <View className="flex-row flex-wrap">
              {hobbies.map((hobby) => (
                <TouchableOpacity
                  key={hobby}
                  onPress={() => handleHobbyToggle(hobby)}
                  className={`m-1 p-2 rounded-full ${
                    profile.hobbies.includes(hobby) ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                >
                  <Text className={`font-rmedium ${
                    profile.hobbies.includes(hobby) ? 'text-white' : 'text-gray-700'
                  }`}>
                    {hobby}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </FormControl>

          <FormControl className="mb-6">
            <FormControlLabel>
              <FormControlLabelText>About you</FormControlLabelText>
            </FormControlLabel>
            <TextInput
              multiline
              numberOfLines={4}
              value={profile.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              placeholder="Share a brief bio..."
              className="border border-gray-300 rounded-lg p-3 text-base"
              textAlignVertical="top"
              style={{ color: theme.colors.text }}
            />
          </FormControl>

          <View className="flex-row items-center mb-4">
            <AnimatedPressable
              onPress={onCheckboxPress}
              style={useAnimatedStyle(() => ({
                transform: [{ scale: checkboxScale.value }],
              }))}
              className="mr-2"
            >
              <Feather 
                name={termsAccepted ? "check-square" : "square"} 
                size={24} 
                color={theme.colors.primary}
              />
            </AnimatedPressable>
            <Text className="text-base font-rregular">
              I accept the <Text className="text-blue-500 underline" onPress={() => {}}>Terms of Service</Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              console.log('Profile created:', profile);
              router.navigate('/main-app');
            }}
            disabled={!termsAccepted}
            className={`bg-blue-500 rounded-lg p-4 items-center ${!termsAccepted ? 'opacity-50' : ''}`}
          >
            <Text className="text-white text-lg font-rbold">Start My Clevery Journey</Text>
          </TouchableOpacity>
        </Animated.View>
      </AnimatedScrollView>
    </Animated.View>
  );
};

// export default Welcome;