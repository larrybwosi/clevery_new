import { Text, View } from 'react-native';
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { AntDesign } from '@expo/vector-icons';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  onConfirm, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  const getAlertColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="m-4">
        <AlertDialogCloseButton className="absolute right-4 top-4">
          <AntDesign name='close' className="h-6 w-6 text-gray-500" />
        </AlertDialogCloseButton>
        <AlertDialogHeader>
          <View className={`rounded-full p-3 ${getAlertColor()}`}>
            <AntDesign name='exclamationcircle' className="h-6 w-6" />
          </View>
          <Text className="text-xl font-bold mt-4">{title}</Text>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text className="text-gray-600 mt-2">{description}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onPress={onClose} variant="outline" className="mr-3">
            <ButtonText>
              {cancelText}
            </ButtonText>
          </Button>
          <Button 
            onPress={() => {
              onConfirm();
              onClose();
            }} 
            variant="solid"
            className={type === 'danger' ? 'bg-red-600' : ''}
          >
            <ButtonText>
              {confirmText}
            </ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;