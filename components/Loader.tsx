import { Ionicons } from '@expo/vector-icons';
import { Text, View } from './Themed';
import LottieView from 'lottie-react-native';

const Loader = ({ 
  loadingText = 'Loading...',
  subText = "We're preparing something amazing for you"
}) => {
  return (
    <View className="flex-1 justify-center items-center ">
      <View className="rounded-2xl shadow-md p-8 items-center max-w-sm w-full">
        <View className="w-36 h-36 mb-6">
          <LottieView
            source={require('@/assets/animations/loader.json')}
            autoPlay
            loop
            style={{
              width: '100%',
              height: '100%',
            }}
            hardwareAccelerationAndroid
            speed={0.7}
          />
        </View>
        
        <Text className="text-2xl font-bold text-gray-600 text-center mb-2">
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