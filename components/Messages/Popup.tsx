import { useState, useCallback } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Box, FlatList, Text, View, Pressable } from '@gluestack-ui/themed';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const PopupComponent = ({ isVisible, onClose }) => {
  const data = [
    { icon: 'corner-up-left', text: 'Reply' },
    { icon: 'copy', text: 'Copy Text' },
    { icon: 'map-pin', text: 'Pin Message' },
    { icon: 'link', text: 'Copy Link' },
  ];

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const renderItem = useCallback(({ item, index }) => (
    <Animated.View entering={FadeIn.delay(index * 100).springify()}>
      <Pressable flexDirection="row" alignItems="center" py={4}>
        <Box
          bg={{
            linearGradient: {
              colors: ['#3498db', '#2980b9'],
              start: [0, 0],
              end: [1, 1],
            },
          }}
          rounded="lg"
          p={3}
          mr={4}
        >
          <Feather name={item.icon} size={20} color="#FFFFFF" />
        </Box>
        <Text color="white" fontSize="lg" fontWeight="medium">
          {item.text}
        </Text>
      </Pressable>
    </Animated.View>
  ), []);

  const renderReaction = useCallback((emoji, index) => (
    <Animated.View key={emoji} entering={FadeIn.delay(index * 50).springify()}>
      <Pressable bg="rgba(255, 255, 255, 0.2)" rounded="full" p={3} mx={1}>
        <Text fontSize="2xl">{emoji}</Text>
      </Pressable>
    </Animated.View>
  ), []);

  if (!isVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View 
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
          <Box
            bg={{
              linearGradient: {
                colors: ['rgba(52, 152, 219, 0.95)', 'rgba(41, 128, 185, 0.95)'],
                start: [0, 0],
                end: [1, 1],
              },
            }}
            rounded="3xl"
            roundedBottom={0}
            p={6}
          >
            <View flexDirection="row" justifyContent="space-around" mb={6} pb={6} borderBottomWidth={1} borderBottomColor="rgba(255, 255, 255, 0.1)">
              {reactions.map(renderReaction)}
            </View>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.text}
              ItemSeparatorComponent={() => <Box h="1px" bg="rgba(255, 255, 255, 0.1)" />}
              scrollEnabled={false}
            />
          </Box>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default PopupComponent;