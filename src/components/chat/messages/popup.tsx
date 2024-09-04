import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from '@/components/themed';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';

interface Props { 
  isVisible: boolean; 
  onClose: () => void, 
  setMessage:any,
  username:string
}

const PopupComponent = ({ isVisible, onClose, setMessage, username }:Props ) => {
  const [editMessage, setEditMessage] = useState('');
  const data = [
    { icon: 'corner-up-left', text: 'Reply' },
    { icon: 'copy', text: 'Copy Text' },
    { icon: 'map-pin', text: 'Pin Message' },
    { icon: 'link', text: 'Copy Link' },
  ];

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const renderItem = useCallback(({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeIn.delay(index * 100).springify()}>
      <Pressable className='flex-row items-center py-1'>
        <LinearGradient
          colors= {['#3498db', '#2980b9']}
          start= {[0, 0]}
          end= {[1, 1]}
          className="w-12 h-12 rounded-full justify-center items-center mr-3"
        >
          <Feather name={item.icon} size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text className='text-white text-lg font-rmedium'>
          {item.text}
        </Text>
      </Pressable>
    </Animated.View>
  ), []);

  const renderReaction = useCallback((emoji: string, index: number) => (
    <Animated.View key={emoji} entering={FadeIn.delay(index * 50).springify()}>
      <Pressable className=" bg-[gba(255, 255, 255, 0.2)] rounded-full items-center justify-center w-8 h-8 mr-2">
        <Text className="text-white text-xl">{emoji}</Text>
      </Pressable>
    </Animated.View>
  ), []);

  if (!isVisible) return null;
  const handleEdit=async()=>{

  }

  return (
    <Modal isOpen={isVisible} onClose={onClose} size="full" className='border-gray-50'>
      <View className='flex-1 ' />
      <ModalContent className=" m-0 rounded-t-[20px] bg-gray-50 shadow-md mb-3 ">
        <ModalHeader>
          <Text className="font-rbold text-lg">Reactions</Text>
          <ModalCloseButton>
            <AntDesign name="close" size={24} color="#666" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className="max-h-[70%]">
          <FlatList
            data={reactions}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </ModalBody>
        <ModalFooter>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
            className="w-full"
          >
            <View className="flex-row items-center mt-2.5">
              <TextInput
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
                value={editMessage}
                onChangeText={setEditMessage}
                placeholder={ `Reply to ${username}...`}
              />
              <TouchableOpacity onPress={handleEdit} >
                <FontAwesome6 name={"paper-plane"} size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PopupComponent;