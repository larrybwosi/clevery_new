import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, Dimensions, PanResponder, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const FullScreenImage = ({ uri, onClose, isOpen }) => {
  const [isVisible, setIsVisible] = useState(true);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const lastScale = useRef(1);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (event.nativeEvent.changedTouches.length === 2) {
          // Pinch to zoom
          const touchA = event.nativeEvent.changedTouches[0];
          const touchB = event.nativeEvent.changedTouches[1];
          const distance = Math.sqrt(
            Math.pow(touchA.pageX - touchB.pageX, 2) +
            Math.pow(touchA.pageY - touchB.pageY, 2)
          );
          const newScale = distance / (width / 2) * lastScale.current;
          scale.value = Math.max(1, Math.min(newScale, 3));
        } else {
          // Pan
          translateX.value = lastX.current + gestureState.dx / scale.value;
          translateY.value = lastY.current + gestureState.dy / scale.value;
        }
      },
      onPanResponderRelease: () => {
        lastScale.current = scale.value;
        lastX.current = translateX.value;
        lastY.current = translateY.value;

        if (scale.value === 1) {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          lastX.current = 0;
          lastY.current = 0;
        }
      },
    })
  ).current;

 const rStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: withSpring(translateX.value) },
      { translateY: withSpring(translateY.value) },
      { scale: withSpring(scale.value) },
    ],
  };
});

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <Modal visible={isVisible || isOpen} transparent={true}>
      <View className="flex-1 bg-black">
        <Animated.View 
          className="flex-1 justify-center items-center" 
          style={rStyle} 
          {...panResponder.panHandlers}
        >
          <Image 
            source={{ uri }} 
            className="absolute top-0 left-0 right-0 bottom-0"
            contentFit="cover"
          />
        </Animated.View>
        <TouchableOpacity 
          className="absolute top-10 right-5 bg-black/50 rounded-full p-2 z-10" 
          onPress={handleClose}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default FullScreenImage;