import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from './Themed';

const Loader = ({ 
  loadingText = 'Loading...',
  subText = "We're preparing something amazing for you"
}) => {
  return (
    <View className="flex-1 justify-center items-center ">
      <View className="rounded-2xl shadow-md p-8 items-center max-w-sm w-full">
        <View className="w-20 h-20 mb-6">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
          {loadingText}
        </Text>
        
        <Text className="text-gray-600 text-center mb-4">
          {subText}
        </Text>
        
        <View className="flex-row items-center justify-center">
          <Ionicons name="time-outline" size={18} color="#6B7280" />
          <Text className="text-gray-500 ml-2">
            Just a moment...
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Loader;