import { useState } from 'react';
import { Pressable, Text as RNText } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Text, View } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';


const SecurityTip = ({ title, content, icon }) => {
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
        <View className="flex-row items-center">
          <Feather name={icon} size={24} color="#4A90E2" className="mr-3" />
          <Text className="text-lg font-rmedium text-gray-800">{title}</Text>
        </View>
        <Animated.View style={animatedStyle}>
          <Feather name="chevron-down" size={24} color="#4A90E2" />
        </Animated.View>
      </Pressable>
      {expanded && (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut} 
          className="p-4 bg-blue-50"
        >
          <Text className="text-base font-rregular text-gray-600">{content}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const SecurityPage = () => {
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

  const securityTips = [
    {
      title: "Strengthen Your Password",
      content: "Create a unique, complex password for your Clevery account. Use a mix of uppercase and lowercase letters, numbers, and symbols. Avoid using personal information that others might guess. Consider using a password manager to generate and store secure passwords.",
      icon: "lock"
    },
    {
      title: "Enable Two-Factor Authentication",
      content: "Activate 2FA in your Clevery account settings for an extra layer of security. When enabled, you'll need to provide a second form of verification (like a code sent to your phone) in addition to your password when logging in from a new device.",
      icon: "smartphone"
    },
    {
      title: "Manage Login Sessions",
      content: "Regularly check your active login sessions in the Clevery app settings. If you see any unfamiliar devices or locations, you can log them out remotely. Always remember to log out when using Clevery on public or shared devices.",
      icon: "log-out"
    },
    {
      title: "Be Cautious with Messages",
      content: "Be wary of messages from unknown users, especially those containing links or requesting personal information. Clevery will never ask for your password via message. Report and block suspicious users immediately.",
      icon: "message-circle"
    },
    {
      title: "Control Your Privacy",
      content: "Review and adjust your privacy settings regularly. You can control who sees your posts, who can send you friend requests, and whether your profile is visible in search results. Be mindful of the information you share in your bio and posts.",
      icon: "eye-off"
    },
    {
      title: "Secure Your Connections",
      content: "Be cautious when accepting friend or connection requests. Verify the identity of users before connecting, especially if you don't know them in real life. Remember, it's okay to decline or remove connections that make you uncomfortable.",
      icon: "users"
    },
    {
      title: "Report Inappropriate Content",
      content: "If you come across posts, comments, or messages that violate Clevery's community guidelines (such as harassment, hate speech, or explicit content), use the report feature immediately. Your reports help keep Clevery safe for everyone.",
      icon: "flag"
    },
    {
      title: "Keep Your App Updated",
      content: "Regularly update your Clevery app to ensure you have the latest security features and bug fixes. Enable automatic updates in your device settings to stay protected without having to remember.",
      icon: "refresh-cw"
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Custom 
        colors={['#0891b2', '#4A90E2']}
        style={[
          { 
            backgroundColor: '#4A90E2', 
            justifyContent: 'flex-end', 
            padding: 20,
          },
          headerAnimatedStyle
        ]}
      >
        <Text className="text-4xl font-rbold text-white mb-2">Clevery Security</Text>
        <Text className="text-lg font-rregular text-white">
          Protecting your social world
        </Text>
      </Custom>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
      >
        <Animated.View entering={FadeIn.delay(200)} className="bg-yellow-100 rounded-lg p-4 mb-6">
          <RNText className="text-lg font-rmedium mb-2 ">Stay Safe on Clevery</RNText>
          <RNText className="text-base font-rregular text-yellow-700">
            Your security is our top priority. Follow these tips to keep your Clevery account and personal information safe while enjoying our platform.
          </RNText>
        </Animated.View>

        {securityTips.map((tip, index) => (
          <SecurityTip key={index} {...tip} />
        ))}

        <Animated.View entering={FadeIn.delay(400)} className="mt-6 bg-green-100 rounded-lg p-4">
          <Text className="text-lg font-rmedium mb-2 text-green-800">Need Help?</Text>
          <Text className="text-base font-rregular text-green-700">
            If you suspect any security issues or have questions about your account, please contact our Clevery support team immediately at support@clevery.com or through the in-app help center.
          </Text>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default SecurityPage;