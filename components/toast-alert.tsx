import { Alert, CloseIcon, HStack, IconButton, Text, Toast, VStack, useToast } from "native-base";

interface ToastProps {
  id: string;
  title: string;
  description: string;
  status?: 'info' | 'warning' | 'success' | 'error';
  variant?: 'solid' | 'subtle' | 'left-accent' | 'top-accent' | 'outline';
  isClosable?: boolean;
}

export const showToastMessage = ({id,title,status,description}:ToastProps) => {
  return (
    Toast.show({
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
  const toast = useToast();

  const handleClose = () => {
    toast.close(id);
  };

  return (
    <Alert 
      maxWidth="100%" 
      alignSelf="center" 
      flexDirection="row" 
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