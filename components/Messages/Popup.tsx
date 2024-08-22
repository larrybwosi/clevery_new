import { useCallback } from 'react';
import { FlatList, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
// import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Box, LinearGradient, Text, View } from '@/components';
import { Pressable } from '../ui/pressable';

const PopupComponent = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  const data = [
    { icon: 'corner-up-left', text: 'Reply' },
    { icon: 'copy', text: 'Copy Text' },
    { icon: 'map-pin', text: 'Pin Message' },
    { icon: 'link', text: 'Copy Link' },
  ];

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  // const renderItem = useCallback(({ item, index }: { item: any; index: number }) => (
  //   <Animated.View entering={FadeIn.delay(index * 100).springify()}>
  //     <Pressable className='flex-row items-center py-1'>
  //       <LinearGradient
  //         colors= {['#3498db', '#2980b9']}
  //         start= {[0, 0]}
  //         end= {[1, 1]}
  //         className="w-12 h-12 rounded-full justify-center items-center mr-3"
  //       >
  //         <Feather name={item.icon} size={20} color="#FFFFFF" />
  //       </LinearGradient>
  //       <Text className='text-white text-lg font-rmedium'>
  //         {item.text}
  //       </Text>
  //     </Pressable>
  //   </Animated.View>
  // ), []);

  // const renderReaction = useCallback((emoji: string, index: number) => (
  //   <Animated.View key={emoji} entering={FadeIn.delay(index * 50).springify()}>
  //     <Pressable className=" bg-[gba(255, 255, 255, 0.2)] rounded-full items-center justify-center w-8 h-8 mr-2">
  //       <Text className="text-white text-xl">{emoji}</Text>
  //     </Pressable>
  //   </Animated.View>
  // ), []);

  if (!isVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      {/* <Animated.View 
        entering={SlideInDown.springify()}
        exiting={SlideOutDown.springify()}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
        }}
      >
        <TouchableWithoutFeedback>
          <LinearGradient 
            colors= {['rgba(52, 152, 219, 0.95)', 'rgba(41, 128, 185, 0.95)']}
            start= {[0, 0]}
            end= {[1, 1]}
            className="rounded-3xl p-3"
          >
            <View className='flex-row justify-around border-b-2 border-b-[rgba(255, 255, 255, 0.1)] pb-3 mb-3'>
              {reactions.map(renderReaction)}
            </View>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.text}
              ItemSeparatorComponent={() => <Box className="full h-[1px] bg-[rgba(255, 255, 255, 0.1)]"/>}
              scrollEnabled={false}
            />
          </LinearGradient>
        </TouchableWithoutFeedback>
      </Animated.View> */}
    </TouchableWithoutFeedback>
  );
};

export default PopupComponent;