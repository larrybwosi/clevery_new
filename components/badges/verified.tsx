import React from 'react';
import { Feather } from '@expo/vector-icons';
import { View } from '../Themed';

interface VerifiedIconProps {
  size?: number;
  color?: string;
}

const VerifiedIcon: React.FC<VerifiedIconProps> = ({ size = 16, color = 'white' }) => {
  return (
    <View className="relative inline-flex items-center justify-center rounded-full bg-blue-500 p-1">
      <View className="absolute -top-1 -right-1 -bottom-1 -left-1 rounded-full bg-blue-500 shadow-lg"></View>
      <Feather name="check" size={size} color={color} className="z-10" />
    </View>
  );
};

export default VerifiedIcon;