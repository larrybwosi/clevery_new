import { memo, useCallback } from 'react';
// import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { TouchableOpacity, View, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import { useThemeStore } from '@/lib/zustand/store';
import { Text } from '@/components/themed';
import { showToastMessage } from '@/lib';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const ThemeDescription = {
  light: 'Light backgrounds, dark text. Easy to read and reduces eye strain.',
  dark: 'Dark backgrounds, light text. Ideal for low-light environments.',
  default: 'Automatically adjusts based on system settings.',
};

const Appearance = () => {
  const { mode, setMode } = useThemeStore();

  const toggleTheme = useCallback((newMode: 'light' | 'dark' | 'default') => {
    setMode(newMode);
  }, [setMode]);

  const MenuItem = memo(({ iconName, label, description }: { iconName: any; label: string; description: string }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: withTiming(mode === label.toLowerCase() ? 1 : 0.6, { duration: 300 }),
    }));

    return (
      <Animated.View className="mb-4 rounded-lg overflow-hidden bg-white/10" style={animatedStyle}>
        <View className="p-4">
          <View className="flex-row items-center mb-1">
            <Feather name={iconName} size={24} color="gray" />
            <Text className="text-lg font-rmedium ml-2 ">{label}</Text>
          </View>
          <Text className="text-xs font-rregular opacity-70">{description}</Text>
        </View>
      </Animated.View>
    );
  });

  const ColorOption = memo(({ color }: { color: string }) => {
    const accentColor = mode === 'light' ? 'black' : mode === 'dark' ? 'white' : 'black';
    return (
      <View
        className="w-10 h-10 rounded-full justify-center items-center"
        style={{ backgroundColor: color }}
      >
        {accentColor === color && (
          <TouchableOpacity 
            onPress={() => showToastMessage("This feature will be available soon")}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  });

  return (
    <ScrollView className="flex-1 p-5">
      <Text className="text-2xl font-rbold mb-5">Appearance</Text>

      <View className="mb-5">
        {Object.entries(ThemeDescription).map(([theme, description]) => (
          <MenuItem
            key={theme}
            iconName={theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'smartphone'}
            label={theme.charAt(0).toUpperCase() + theme.slice(1)}
            description={description}
          />
        ))}
      </View>

      <Text className="text-lg font-rbold mt-5 mb-2">Theme Selection</Text>
      <View className="flex-row justify-between">
        {['default', 'light', 'dark'].map((theme) => (
          <TouchableOpacity
            key={theme}
            className="flex-row items-center"
            onPress={() => toggleTheme(theme as 'light' | 'dark' | 'default')}
          >
            <View className={`h-5 w-5 rounded-full border-2 border-blue-500 items-center justify-center ${mode === theme ? 'bg-blue-500' : ''}`}>
              {mode === theme && <View className="h-2.5 w-2.5 rounded-full bg-white" />}
            </View>
            <Text className="text-sm ml-2 font-rregular">{theme}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-lg font-rbold mt-5 mb-2">Accent Color</Text>
      <View className="flex-row justify-between mt-2">
        {['#007AFF', '#FF3B30', '#4CD964', '#FF9500', '#5856D6'].map((color) => (
          <View key={color} className="w-10 h-10 rounded-full border-2 border-blue-500 items-center justify-center">
            <ColorOption key={color} color={color} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default memo(Appearance);