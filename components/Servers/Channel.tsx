import { useState } from 'react';
import { Box, VStack, Input, InputField, Text, Button, ButtonText, Icon, Toast, useToast, LinearGradient } from '@/components';
import { Ionicons } from '@expo/vector-icons';

const CreateChannelComponent = () => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const toast = useToast();

  const categories = [
    { name: 'Movie', icon: 'videocam' },
    { name: 'Game', icon: 'game-controller' },
    { name: 'Sanp', icon: 'camera' },
    { name: 'Travel', icon: 'briefcase' },
  ];

  const handleCreateChannel = () => {
    // Implement channel creation logic here
    // If there's an error, show the toast notification
    toast.show({
      render: () => (
        <Toast>
          <Text>Error creating channel</Text>
          <Text>Please try again later.</Text>
        </Toast>
      ),
    });
  };

  return (
    <Box className='flex-1 p-6 bg-white' >
      <VStack  className='space-y-4'>
        <Text className='font-rbold text-2xl'>Create channel</Text>
        <Text className='font-rmedium text-base' >Create your own channel from below.</Text>

        <Input>
          <InputField
            placeholder="Channel name"
            value={channelName}
            onChangeText={setChannelName}
          />
        </Input>

        <Text className='font-rmedium '>Categories</Text>
        <Box className='space-y-2 flex-row justify-between' >
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "solid" : "outline"}
              onPress={() => setSelectedCategory(category.name)}
            >
              <VStack>
                <Ionicons name={category.icon} size={24} color="black" />
                <Text className='font-rmedium'>{category.name}</Text>
              </VStack>
            </Button>
          ))}
        </Box>

        <Text className='font-rmedium'>Description</Text>
        <Input>
          <InputField
            placeholder="Write here ..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </Input>

        <LinearGradient
          colors={['$lightBlue300', '$violet800']} 
          start={[0, 0]}
          end={[1, 0]}
        >
          <ButtonText>Confirm and create</ButtonText>
        </LinearGradient>
      </VStack>
    </Box>
  );
};

export default CreateChannelComponent;