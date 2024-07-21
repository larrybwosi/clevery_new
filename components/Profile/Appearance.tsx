import React, { memo, useCallback } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { useThemeStore } from '@/lib/zustand/store';
import { BlurView } from 'expo-blur';
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

  const MenuItem = memo(({ iconName, label, description }: { iconName: string; label: string; description: string }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: withTiming(mode === label.toLowerCase() ? 1 : 0.6, { duration: 300 }),
    }));

    return (
      <Animated.View style={[styles.menuItem, animatedStyle]}>
        <BlurView intensity={80} tint={mode} style={styles.blurView}>
          <View style={styles.iconLabelContainer}>
            <Feather name={iconName} size={24} color="white" />
            <Text style={styles.label}>{label}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </BlurView>
      </Animated.View>
    );
  });

  const ColorOption = memo(({ color }:{color: string}) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: color }]}
    >
      {accentColor === color && (
        <Ionicons name="checkmark-circle" size={20} color="white" />
      )}
    </TouchableOpacity>
  ));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Appearance</Text>
      
      <View style={styles.themeContainer}>
        {Object.entries(ThemeDescription).map(([theme, description]) => (
          <MenuItem
            key={theme}
            iconName={theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'smartphone'}
            label={theme.charAt(0).toUpperCase() + theme.slice(1)}
            description={description}
          />
        ))}
      </View>

      <Text style={styles.subtitle}>Theme Selection</Text>
      <View style={styles.themeSelectionContainer}>
        {['default', 'light', 'dark'].map((theme) => (
          <TouchableOpacity
            key={theme}
            style={styles.themeOption}
            onPress={() => toggleTheme(theme as 'light' | 'dark' | 'default')}
          >
            <View style={[styles.radioButton, mode === theme && styles.radioButtonSelected]}>
              {mode === theme && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={styles.themeOptionText}>{theme}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Accent Color</Text>
      <View style={styles.colorOptionsContainer}>
        {['#007AFF', '#FF3B30', '#4CD964', '#FF9500', '#5856D6'].map((color) => (
          <ColorOption key={color} color={color} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  themeContainer: {
    marginBottom: 20,
  },
  menuItem: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  blurView: {
    padding: 15,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  themeSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  themeOptionText: {
    fontSize: 16,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(Appearance);