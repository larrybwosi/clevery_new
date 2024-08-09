import { Spinner } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Text, View } from './Themed';

const Loader = ({ loadingText = 'Loading...' }) => (
  <View className="flex-1 justify-center items-center">
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      className="w-64 h-64 rounded-3xl justify-center items-center shadow-lg"
    >
      <LottieView
        source={require('../assets/animations/loading.json')}
        autoPlay
        loop
        style={{ width: 120, height: 120 }}
      />
      <Spinner size="lg" color="white" />
      <Text className="mt-4 text-lg font-semibold text-white">
        {loadingText}
      </Text>
      <Text className="mt-2 text-sm text-gray-200 text-center px-4 font-rmedium">
        We're preparing something amazing for you!
      </Text>
    </LinearGradient>
  </View>
);

export default Loader;