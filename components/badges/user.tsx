import { Box, Icon } from "native-base";
import { Text } from "../Themed";
import { StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useEffect } from "react";

interface BadgeProps {
  text: string;
  colors: string[];
  icon?: string;
  animation?: any;
  elite?: boolean;
}

const BadgeBase: React.FC<BadgeProps> = ({ text, colors, icon, animation, elite }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Box
        bg={{
          linearGradient: {
            colors: colors,
            start: [0, 0],
            end: [1, 1],
          },
        }}
        style={[styles.badge, elite && styles.eliteBadge]}
        px={2}
        py={1}
        rounded="full"
      >
        {icon && <Icon as={Ionicons} name={icon} size="sm" color="white" mr={1} />}
        <Text style={[styles.text, elite && styles.eliteText]}>{text}</Text>
        {animation && (
          <Box style={styles.animationContainer}>
            <LottieView
              source={animation}
              autoPlay
              loop
              style={styles.animation}
              hardwareAccelerationAndroid
              duration={500}
            />
          </Box>
        )}
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eliteBadge: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  eliteText: {
    color: '#FFD700',
  },
  animationContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 30,
    height: 30,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export const Badge = BadgeBase;

// Free User Badges
export const NewcomerBadge = () => (
  <Badge text="Newcomer" colors={['#4CAF50', '#45B649']} icon="leaf-outline" />
);

export const ExplorerBadge = () => (
  <Badge text="Explorer" colors={['#3498db', '#2980b9']} icon="compass-outline" />
);

export const ContributorBadge = () => (
  <Badge 
    text="Contributor" 
    colors={['#e67e22', '#d35400']} 
    icon="trophy-outline"
    animation={require('@/assets/animations/circle.json')}
  />
);

// Elite User Badges
export const VIPBadge = () => (
  <Badge 
    text="VIP" 
    colors={['#8e44ad', '#9b59b6']} 
    icon="diamond-outline" 
    elite={true}
  />
);

export const MasterBadge = () => (
  <Badge 
    text="Master" 
    colors={['#c0392b', '#e74c3c']} 
    icon="flame-outline" 
    elite={true}
    animation={require('@/assets/animations/fire.json')}
  />
);

export const LegendBadge = () => (
  <Badge 
    text="Legend" 
    colors={['#1abc9c', '#16a085']} 
    icon="star-outline" 
    elite={true}
    animation={require('@/assets/animations/star.json')}
  />
);