import React, { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInUp, SlideOutDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text, View } from '@/components/themed';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  setMessage: (message: string) => void;
  username: string;
}

const PopupComponent = ({ isVisible, onClose, setMessage, username }: Props) => {
  const [editMessage, setEditMessage] = useState('');
  const scale = useSharedValue(0);

  const data = [
    { icon: 'corner-up-left', text: 'Reply' },
    { icon: 'copy', text: 'Copy Text' },
    { icon: 'map-pin', text: 'Pin Message' },
    { icon: 'link', text: 'Copy Link' },
    { icon: 'edit-3', text: 'Edit Message' },
    { icon: 'trash-2', text: 'Delete Message' },
  ];

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });

  const renderItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity className="flex-row items-center p-3 mb-2 bg-gray-800 rounded-lg">
      <Feather name={item.icon} size={24} color="#fff" />
      <Text className="ml-3 text-white font-semibold">{item.text}</Text>
    </TouchableOpacity>
  ), []);

  const renderReaction = useCallback((emoji: string) => (
    <Animated.View 
      entering={FadeIn.delay(200)}
      className="mr-2"
    >
      <TouchableOpacity 
        className="bg-gray-700 rounded-full p-2" 
        onPress={() => {
          scale.value = 1.2;
          setTimeout(() => {
            scale.value = 1;
          }, 100);
        }}
      >
        <Animated.Text style={animatedStyle} className="text-2xl">{emoji}</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  ), []);

  if (!isVisible) return null;

  const handleEdit = async () => {
    setMessage(editMessage);
    onClose();
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose} className='w-full flex-1 mb-4'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <Animated.View
          entering={SlideInUp.springify().damping(15)}
          exiting={SlideOutDown.springify().damping(15)}
          className="bg-gray-900 rounded-t-3xl overflow-hidden"
        >
          <ModalContent className="p-4">
            <ModalBody>
              <Text className="text-lg text-gray-300 mb-4">Quick Actions</Text>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.text}
              />

              <Text className="text-lg text-gray-300 my-4">React with Emoji</Text>
              <View className="flex-row flex-wrap justify-start mb-4">
                {reactions.map(renderReaction)}
              </View>

              <Text className="text-lg text-gray-300 mb-2">Edit Message</Text>
              <TextInput
                className="bg-gray-800 text-white p-3 rounded-lg mb-4"
                placeholder="Edit your message..."
                placeholderTextColor="#9CA3AF"
                value={editMessage}
                onChangeText={setEditMessage}
              />
            </ModalBody>
          </ModalContent>

          <ModalFooter>
            <Pressable
              className="bg-blue-500 py-3 px-6 rounded-lg"
              onPress={handleEdit}
            >
              <Text className="text-white font-semibold">Save Changes</Text>
            </Pressable>
          </ModalFooter>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default React.memo(PopupComponent);