import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { TouchableOpacity, FlatList, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Text } from '@/components/Themed';

const PopupComponent = () => {
  const data = [
    { icon: 'corner-up-left', text: 'Reply' },
    { icon: 'copy', text: 'Copy Text' },
    { icon: 'map-pin', text: 'Pin Message' },
    { icon: 'link', text: 'Copy Link' },
  ];

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
      <TouchableOpacity className="flex-row items-center py-4">
        <LinearGradient
          colors={['#3498db', '#2980b9']}
          className="rounded-lg p-3 mr-4"
        >
          <Feather name={item.icon} size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text className="text-white text-lg font-medium">{item.text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderReaction = (emoji: string, index: number) => (
    <Animated.View key={emoji} entering={FadeInUp.delay(index * 50).springify()}>
      <TouchableOpacity className="bg-white bg-opacity-20 rounded-full p-3 mx-1">
        <Text className="text-2xl">{emoji}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Animated.View 
      entering={FadeInUp.springify()}
      exiting={FadeOutDown.springify()}
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-3xl shadow-lg"
    >
      <LinearGradient
        colors={['rgba(52, 152, 219, 0.1)', 'rgba(41, 128, 185, 0.1)']}
        className="p-6"
      >
        <View className="flex-row justify-around mb-6 pb-6 border-b border-white border-opacity-10">
          {reactions.map(renderReaction)}
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.text}
          ItemSeparatorComponent={() => <View className="h-px bg-white bg-opacity-10" />}
          scrollEnabled={false}
        />
      </LinearGradient>
    </Animated.View>
  );
};

export default PopupComponent;