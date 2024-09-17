import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeOut, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { Text, View } from '@/components';

const PrivacySection = ({ title, content, icon }) => {
  const [expanded, setExpanded] = useState(false);
  const rotateValue = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded(!expanded);
    rotateValue.value = withSpring(expanded ? 0 : 1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value * 180}deg` }],
    };
  });

  return (
    <View className="mb-4 rounded-lg shadow-md overflow-hidden">
      <Pressable onPress={toggleExpand} className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
          <Feather name={icon} size={24} color="#4A90E2" className="mr-3" />
          <Text className="text-lg font-rmedium">{title}</Text>
        </View>
        <Animated.View style={animatedStyle}>
          <Feather name="chevron-down" size={24} color="#4A90E2" />
        </Animated.View>
      </Pressable>
      <Animated.View entering={FadeIn} exiting={FadeOut} className="p-4">
        <Text className="text-base font-rregular">{content}</Text>
      </Animated.View>
    </View>
  );
};

const PrivacyPage = () => {
  const theme = useTheme();

  const privacySections = [
    {
      title: "Data Collection",
      content: "We collect minimal personal data necessary for app functionality. This includes your email address, usage statistics, and app preferences. We do not sell your data to third parties.",
      icon: "database"
    },
    {
      title: "Data Usage",
      content: "Your data is used to improve app performance, personalize your experience, and provide customer support. We analyze aggregated, anonymized data to understand user behavior and improve our services.",
      icon: "activity"
    },
    {
      title: "Data Protection",
      content: "We employ industry-standard encryption and security measures to protect your data. Our servers are regularly audited and updated to ensure the highest level of security.",
      icon: "shield"
    },
    {
      title: "Third-Party Services",
      content: "We use select third-party services for analytics and crash reporting. These services are bound by strict confidentiality agreements and adhere to GDPR and CCPA regulations.",
      icon: "users"
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal data. You can also opt-out of certain data collection practices. Contact our support team for assistance with these requests.",
      icon: "user-check"
    },
    {
      title: "Policy Updates",
      content: "We may update this privacy policy from time to time. We will notify you of any significant changes via email or through the app. We encourage you to review this policy periodically.",
      icon: "refresh-cw"
    }
  ];

  return (
    <ScrollView 
      className="flex-1 p-5" 
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Animated.View entering={FadeIn} className="mb-6">
        <Text className="text-3xl font-rbold mb-2">Privacy Policy</Text>
        <Text className="text-base font-rregular text-gray-600">
          Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
        </Text>
      </Animated.View>

      <View className="bg-blue-100 rounded-lg p-4 mb-6">
        <Text className="text-lg font-rmedium mb-2">Our Commitment</Text>
        <Text className="text-base font-rregular">
          We are committed to protecting your privacy and ensuring the security of your personal information. We adhere to strict ethical standards and comply with data protection regulations.
        </Text>
      </View>

      {privacySections.map((section, index) => (
        <PrivacySection key={index} {...section} />
      ))}

      <View className="mt-6 bg-green-100 rounded-lg p-4">
        <Text className="text-lg font-rmedium mb-2">Questions or Concerns?</Text>
        <Text className="text-base font-rregular">
          If you have any questions about our privacy practices or would like to exercise your data rights, please contact our Data Protection Officer at support@clevery.com.
        </Text>
      </View>
    </ScrollView>
  );
};

export default PrivacyPage;