// import { Alert, CloseIcon, HStack, IconButton, Text, Toast, VStack, useToast } from "native-base";

import { Text } from "./Themed";
import { Alert } from "./ui/alert";
import { HStack } from "./ui/hstack";
import { CloseIcon } from "./ui/icon";
import { useToast } from "./ui/toast";
// import { Toast } from "./ui/toast";
import { VStack } from "./ui/vstack";

interface ToastProps {
  id: string;
  title: string;
  description: string;
  status?: 'info' | 'warning' | 'success' | 'error';
  variant?: "solid" | "outline";
  isClosable?: boolean;
}

export const showToastAlert = ({id,title,status,description}:ToastProps) => {
  const toast = useToast()
  return (
    toast.show({
      render: () => (
        <ToastAlert
          id={id}
          title={title}
          description={description}
          status={status}
        />
      ),
    })
  )
};
const ToastAlert: React.FC<ToastProps> = ({
  id,
  title,
  description,
  status = 'info',
  variant = 'solid',
  isClosable = true,
  ...rest
}) => {
  const toast = useToast()

  const handleClose = () => {
    toast.close(id);
  };

  return (
    <Alert
      className="w-100 items-center flex-row"
      status={status}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text 
              fontSize="md" 
              fontWeight="medium" 
              flexShrink={1} 
              color={variant === "solid" ? "lightText" : "darkText"}
            >
              {title}
            </Text>
          </HStack>
          {isClosable && (
            <IconButton
              variant="unstyled" 
              icon={<CloseIcon size="3" />} 
              _icon={{
                color: variant === "solid" ? "lightText" : "darkText"
              }} 
              onPress={handleClose} 
            />
          )}
        </HStack>
        <Text
          px="6" 
          color={variant === "solid" ? "lightText" : "darkText"}
        >
          {description}
        </Text>
      </VStack>
    </Alert>
  );
};

export default ToastAlert;