import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useRef } from 'react';

const Loader = ({ loadingText = 'Loading...' }) => {
  const animation = useRef<LottieView>(null);

  return (
    <View className='flex-1 justify-center items-center bg-[rgba(0,0,0,0.1)]'>
      <LinearGradient
        colors={['#4A00E0', '#8E2DE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='w-[300px] h-[300px] rounded-5 justify-center items-center shadow-[0_0_10px_0_rgba(0,0,0,0.5)] '
      >
        <LottieView
          source={require('@/assets/animations/elegant-loading.json')}
          ref={animation}
          autoPlay
          loop
          style={{ width: 180, height: 180 }}
        />
        <Text className='text-[#FFFFFF] font-pmedium text-[24px]'>{loadingText}</Text>
        <Text className='text-[rgba(255, 255, 255, 0.8)] font-pmedium text-[16px] px-5 text-center mt-2.5'>
          We're crafting an exceptional experience for you
        </Text>
      </LinearGradient>
    </View>
  );
};


export default Loader;