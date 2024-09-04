import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '../constants';
import { useThemeStore } from '@/lib';
import { useColorScheme } from 'nativewind';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {

  const { mode: theme } = useThemeStore();
  const defaultMode = useColorScheme()

  const lightmode = () => {
    if (theme === 'default') return defaultMode;
    return theme;
  }

  const colorFromProps = props[lightmode()!];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[lightmode()!][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, className, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText className={className} style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, className, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView className={className} style={[{ backgroundColor }, style]} {...otherProps} />;
}
