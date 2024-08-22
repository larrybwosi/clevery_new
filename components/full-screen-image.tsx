import { Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Modal, ModalBody, ModalCloseButton, ModalContent } from './ui/modal';
import { Pressable } from 'react-native';

const { width, height } = Dimensions.get('window');

interface FullScreenImageProps {
  isOpen: boolean;
  onClose: () => void;
  imageUri: string;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ isOpen, onClose, imageUri }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className='bg-gray-700 size-full'>
      <ModalContent className={`max-w-[400px] w-[${width}px] h-[${height}px]`} >
        <ModalCloseButton />
        <ModalBody>
          <Pressable onPress={onClose}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%' }}
            />
          </Pressable>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullScreenImage;