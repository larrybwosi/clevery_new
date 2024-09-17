import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Text, View } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);
  const rotateValue = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
    rotateValue.value = withSpring(expanded ? 0 : 1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value * 180}deg` }],
  }));

  return (
    <Animated.View 
      entering={FadeIn.delay(300)} 
      className="mb-4 rounded-lg shadow-lg overflow-hidden"
    >
      <Pressable onPress={toggleExpand} className="flex-row items-center justify-between p-4">
        <Text className="text-lg font-rmedium text-gray-800 flex-1 mr-2">{question}</Text>
        <Animated.View style={animatedStyle}>
          <Feather name="chevron-down" size={24} color="#6366F1" />
        </Animated.View>
      </Pressable>
      {expanded && (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut} 
          className="p-4 bg-indigo-50"
        >
          <Text className="text-base font-rregular text-gray-600">{answer}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const ContactButton = ({ icon, title, subtitle, onPress }) => (
  <Pressable 
    onPress={onPress}
    className="flex-row items-center rounded-lg shadow-md p-4 mb-4"
  >
    <View className="bg-indigo-100 rounded-full p-3 mr-4">
      <Feather name={icon} size={24} color="#6366F1" />
    </View>
    <View className="flex-1">
      <Text className="text-lg font-rmedium text-gray-800">{title}</Text>
      <Text className="text-sm font-rregular text-gray-600">{subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={24} color="#6366F1" />
  </Pressable>
);

const HelpSupportPage = () => {
  const theme = useTheme();
  const scrollY = useSharedValue(0);
  const Custom = Animated.createAnimatedComponent(LinearGradient);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [200, 100],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity: interpolate(scrollY.value, [0, 100], [1, 0.8], Extrapolation.CLAMP),
    };
  });

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login screen and tap on 'Forgot Password'. Follow the instructions sent to your email to create a new password."
    },
    {
      question: "Can I change my username?",
      answer: "Yes, you can change your username once every 30 days. Go to Settings > Account > Username to make the change."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "To report content, tap the three dots (...) next to the post or comment and select 'Report'. Choose the reason for reporting and submit."
    },
    // Add more FAQ items as needed
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Custom 
        colors={['#6366F1', '#818CF8']}
        style={[
          { 
            justifyContent: 'flex-end', 
            padding: 20,
          },
          headerAnimatedStyle
        ]}
      >
        <Text className="text-4xl font-rbold text-white mb-2">Help & Support</Text>
        <Text className="text-lg font-rregular text-white">
          We're here to help you
        </Text>
      </Custom>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
      >
        <Animated.View entering={FadeIn.delay(200)} className="mb-6">
          <View className="flex-row items-center bg-white rounded-lg shadow-md p-2">
            <Feather name="search" size={24} color="#6366F1" className="mr-2" />
            <TextInput 
              placeholder="Search for help..."
              className="flex-1 text-base font-rregular text-gray-700"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(300)} className="mb-6">
          <Text className="text-2xl font-rbold text-gray-800 mb-4">Contact Us</Text>
          <ContactButton 
            icon="mail" 
            title="Email Support" 
            subtitle="Get help via email"
            onPress={() => {/* Handle email support */}}
          />
          <ContactButton 
            icon="message-circle" 
            title="Live Chat" 
            subtitle="Chat with a support agent"
            onPress={() => {/* Handle live chat */}}
          />
          <ContactButton 
            icon="phone" 
            title="Phone Support" 
            subtitle="Call us for immediate help"
            onPress={() => {/* Handle phone support */}}
          />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400)}>
          <Text className="text-2xl font-rbold text-gray-800 mb-4">Frequently Asked Questions</Text>
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </Animated.View>

        <Animated.View entering={FadeIn.delay(500)} className="mt-6 bg-indigo-100 rounded-lg p-4">
          <Text className="text-lg font-rmedium mb-2 text-indigo-800">Still need help?</Text>
          <Text className="text-base font-rregular text-indigo-700">
            If you couldn't find the answer you were looking for, please don't hesitate to contact our support team. We're always here to help!
          </Text>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default HelpSupportPage;