import { useState } from 'react';
import { TextInput, Alert, Switch, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Modal, ModalContent, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Text,View } from '@/components/themed';
import { Button } from '@/components/ui/button';
import { endpoint } from '@/lib';

const FeedbackPage = () => {
  const theme = useTheme();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [developerNote, setDeveloperNote] = useState('');
  const [willContribute, setWillContribute] = useState(false);

  const buttonScale = useSharedValue(1);
  const starScales = [useSharedValue(1), useSharedValue(1), useSharedValue(1), useSharedValue(1), useSharedValue(1)];
  const scrollY = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100], [1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollY.value, [0, 100], [0, -50], Extrapolation.CLAMP) },
    ],
  }));

  const handleRating = (value) => {
    setRating(value);
    starScales.forEach((scale, index) => {
      scale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
    });
  };

  const handleSubmit = async () => {
    if (rating === 0 && !isDeveloper) {
      Alert.alert('Oops!', 'Please select a rating before submitting.');
      return;
    }
    setIsModalVisible(true);
    
    await fetch(`${endpoint}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        rating, 
        comment: feedback,
        isDeveloper,
        developerNote,
        willContribute
      }),
    });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setRating(0);
    setFeedback('');
    setIsDeveloper(false);
    setDeveloperNote('');
    setWillContribute(false);
  };

  return (
    <Animated.ScrollView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      <Animated.View style={headerStyle} className="p-5">
        <Text className="text-3xl font-rbold mb-5">We Value Your Feedback!</Text>
      </Animated.View>

      <Animated.View entering={FadeIn} exiting={FadeOut} className="p-5">
        <View className="bg-blue-100 rounded-lg p-4 mb-5">
          <Text className="text-lg font-rmedium mb-2">Help Us Improve</Text>
          <Text className="text-base font-rregular">
            Your feedback is crucial in shaping the future of our app. Take a moment to share your thoughts and help us create an even better experience for you!
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-rmedium mb-3">How would you rate your experience?</Text>
          <View className="flex-row justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                onPress={() => handleRating(value)}
              >
                <Animated.View style={useAnimatedStyle(() => ({
                  transform: [{ scale: starScales[value - 1].value }],
                }))}>
                  <Feather 
                    name={rating >= value ? 'star' : 'star'} 
                    size={32} 
                    color={rating >= value ? theme.colors.primary : 'gray'} 
                  />
                </Animated.View>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-rmedium mb-3">Tell us more (optional)</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
            className="border border-gray-300 rounded-lg p-3 text-base"
            textAlignVertical="top"
            style={{ color: theme.colors.text }}
          />
        </View>

        <View className="mb-6">
          <Text className="text-xl font-rmedium mb-3">Are you a developer?</Text>
          <View className="flex-row items-center">
            <Switch
              value={isDeveloper}
              onValueChange={setIsDeveloper}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
            <Text className="ml-2 font-rregular text-sm">Yes, I'm a developer</Text>
          </View>
        </View>

        {isDeveloper && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="mb-6">
            <Text className="text-xl font-rmedium mb-3">Developer Feedback</Text>
            <TextInput
              multiline
              numberOfLines={4}
              value={developerNote}
              onChangeText={setDeveloperNote}
              placeholder="Share your technical feedback or suggestions..."
              className="border border-gray-300 rounded-lg p-3 text-base mb-3"
              textAlignVertical="top"
              style={{ color: theme.colors.text }}
            />
            <View className="flex-row items-center">
              <Switch
                value={willContribute}
                onValueChange={setWillContribute}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
              <Text className="ml-2 font-rregular text-sm">I'm interested in contributing to the project</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View style={animatedButtonStyle}>
          <Button
            onPress={handleSubmit}
            className="bg-blue-500 rounded-lg"
          >
            <Text className="text-white text-lg font-rbold text-center">Submit Feedback</Text>
          </Button>
        </Animated.View>

        <View className="mt-6 bg-green-100 rounded-lg p-4">
          <Text className="text-lg font-rmedium mb-2">Did You Know?</Text>
          <Text className="text-base font-rregular">
            Your feedback directly influences our development priorities. Many of our recent features were inspired by user suggestions just like yours!
          </Text>
        </View>
      </Animated.View>

      <Modal isOpen={isModalVisible} onClose={closeModal}>
        <ModalContent className={'bg-white rounded-3xl'} style={{ backgroundColor: theme.colors.background }}>
          <ModalBody>
            <Animated.View entering={FadeIn}>
              <Feather name="check-circle" size={64} color="green" style={{ alignSelf: 'center', marginBottom: 20 }} />
              <Text className="text-2xl font-rbold text-center mb-4">Thank You!</Text>
              <Text className="text-lg font-rregular text-center mb-6">
                Your feedback has been successfully submitted. We appreciate your input and will use it to improve our app.
              </Text>
            </Animated.View>
          </ModalBody>
          <ModalFooter>
            <Button onPress={closeModal} className="bg-blue-500 px-4 py-2 rounded-full w-full">
              <Text className="text-white font-rmedium text-center">Close</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Animated.ScrollView>
  );
};

export default FeedbackPage;