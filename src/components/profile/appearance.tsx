import { memo, useCallback } from 'react';
import { TouchableOpacity, View, ScrollView, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons, Feather } from '@expo/vector-icons';

import { useThemeStore } from '@/lib/zustand/store';
import { Text } from '@/components/themed';
import { showToastMessage } from '@/lib';

const ThemeDescription = {
  light: 'Light backgrounds, dark text. Easy to read and reduces eye strain in bright environments.',
  dark: 'Dark backgrounds, light text. Ideal for low-light environments and helps conserve battery life on OLED screens.',
  default: 'Automatically adjusts based on your system settings, ensuring a consistent experience across your devices.',
};

const Appearance = () => {
  const { mode, setMode } = useThemeStore();

  const CustomText = Animated.createAnimatedComponent(Text);
  const toggleTheme = (newMode: 'light' | 'dark' | 'default') => {
    setMode(newMode);
  };

  const MenuItem = memo(({ iconName, label, description }: { iconName: any; label: string; description: string }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: withTiming(mode === label.toLowerCase() ? 1 : 0.6, { duration: 300 }),
      transform: [{ scale: withTiming(mode === label.toLowerCase() ? 1.05 : 1, { duration: 300 }) }],
    }));

    return (
      <Animated.View
        className="mb-4 rounded-lg overflow-hidden bg-white/10"
        style={animatedStyle}
      >
        <Pressable
          className="p-4"
        >
          <View className="flex-row items-center mb-1">
            <Feather name={iconName} size={24} color="gray" />
            <Text className="text-lg font-rmedium ml-2">{label}</Text>
          </View>
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <Text className="text-sm font-rregular opacity-70 mt-2">{description}</Text>
            </Animated.View>
        </Pressable>
      </Animated.View>
    );
  });

  const ColorOption = memo(({ color }: { color: string }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(mode === 'light' ? 1.1 : 1, { duration: 300 }) }],
    }));

    return (
      <Animated.View
        className="w-10 h-10 rounded-full justify-center items-center"
        style={[{ backgroundColor: color }, animatedStyle]}
      >
        <TouchableOpacity onPress={() => showToastMessage("Accent color feature coming soon!")}>
          <Ionicons name="color-palette" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  });

  return (
    <ScrollView className="flex-1 p-5">
      <CustomText 
        className="text-3xl font-rbold mb-5"
        entering={FadeIn.duration(500).delay(200)}
      >
        Appearance
      </CustomText>

      <Animated.View 
        className="flex-row rounded-lg p-4 mb-6"
        entering={FadeIn.duration(500).delay(400)}
      >
        <Text className="text-sm font-rregular text-blue-800">
          Customize your app's look and feel. Choose a theme that suits your style and enhances your viewing experience.
        </Text>
      </Animated.View>

      <Animated.View 
        className="mb-5"
        entering={FadeIn.duration(500).delay(600)}
      >
        {Object.entries(ThemeDescription).map(([theme, description], index) => (
          <Animated.View key={theme} entering={FadeIn.duration(300).delay(index * 100)}>
            <MenuItem
              iconName={theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'smartphone'}
              label={theme.charAt(0).toUpperCase() + theme.slice(1)}
              description={description}
            />
          </Animated.View>
        ))}
      </Animated.View>

      <CustomText 
        className="text-xl font-rbold mt-5 mb-4"
        entering={FadeIn.duration(500).delay(800)}
      >
        Theme Selection
      </CustomText>
      <Animated.View 
        className="flex-row justify-between rounded-lg p-4"
        entering={FadeIn.duration(500).delay(1000)}
      >
        {['default', 'light', 'dark'].map((theme, index) => (
          <Animated.View key={theme} entering={FadeIn.duration(300).delay(1200 + index * 100)}>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => toggleTheme(theme as 'light' | 'dark' | 'default')}
            >
              <View className={`h-6 w-6 rounded-full border-2 border-blue-500 items-center justify-center ${mode === theme ? 'bg-blue-500' : ''}`}>
                {mode === theme && <View className="h-3 w-3 rounded-full bg-white" />}
              </View>
              <Text className="text-base ml-2 font-rmedium">{theme.charAt(0).toUpperCase() + theme.slice(1)}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>

      <CustomText 
        className="text-xl font-rbold mt-8 mb-4"
        entering={FadeIn.duration(500).delay(1500)}
      >
        Accent Color
      </CustomText>
      <Animated.View 
        className="flex-row justify-between mt-2 rounded-lg p-4"
        entering={FadeIn.duration(500).delay(1700)}
      >
        {['#007AFF', '#FF3B30', '#4CD964', '#FF9500', '#5856D6'].map((color, index) => (
          <Animated.View 
            key={color} 
            className="items-center justify-center"
            entering={FadeIn.duration(300).delay(1900 + index * 100)}
          >
            <ColorOption color={color} />
            <Text className="text-xs mt-1 font-rregular">{color}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      <CustomText 
        className="text-sm font-rregular text-gray-500 mt-6 mb-10"
        entering={FadeIn.duration(500).delay(2400)}
      >
        Tip: You can quickly switch between light and dark modes by long-pressing the app icon on your profile page.
      </CustomText>
    </ScrollView>
  );
};

export default memo(Appearance);