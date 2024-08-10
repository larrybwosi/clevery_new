import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoutComponentProps {
  onLogout: () => void;
  onCancel: () => void;
  username: string;
}

const LogoutComponent: React.FC<LogoutComponentProps> = ({ onLogout, onCancel, username }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleLogoutPress = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    } else {
      onLogout();
    }
  };

  return (
    <LinearGradient
      colors={['#4b6cb7', '#182848']}
      className="flex-1 justify-center items-center p-6"
    >
      <View className="bg-white bg-opacity-95 rounded-3xl p-8 w-full max-w-md shadow-lg">
        <LottieView
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: 128, height: 128, alignSelf: 'center' }}
        />
        <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
          Farewell, {username}?
        </Text>
        <Text className="text-lg text-gray-600 mt-2 text-center">
          We'd hate to see you go. Are you sure?
        </Text>
        
        <View className="mt-8 space-y-4">
          <BenefitItem icon="star" text="Exclusive content awaits you" />
          <BenefitItem icon="notifications" text="Stay in the loop with latest updates" />
          <BenefitItem icon="people" text="Keep in touch with your network" />
        </View>
        
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="mt-8">
          <TouchableOpacity
            onPress={handleLogoutPress}
            className={`py-3 px-6 rounded-full ${
              showConfirmation ? 'bg-red-500' : 'bg-blue-600'
            }`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {showConfirmation ? 'Confirm Logout' : 'Log Out'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity onPress={onCancel} className="mt-4">
          <Text className="text-blue-600 text-center text-lg font-semibold">
            Stay Connected
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const BenefitItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View className="flex-row items-center space-x-3">
    <View className="bg-blue-100 p-2 rounded-full">
      <Ionicons name={icon as any} size={20} color="#3b82f6" />
    </View>
    <Text className="text-gray-700 text-base flex-1">{text}</Text>
  </View>
);

export default LogoutComponent;