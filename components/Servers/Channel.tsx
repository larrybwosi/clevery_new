import { useState } from 'react';
import { Box, VStack, Input, InputField, Text, Button, ButtonText, Icon, Toast, useToast } from '@gluestack-ui/themed';
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
    <Box p="$4" bg="$white" >
      <VStack gap="$4">
        <Text fontSize="$2xl" fontWeight="$bold">Create channel</Text>
        <Text fontSize="$md" color="$gray500">Create your own channel from below.</Text>

        <Input>
          <InputField
            placeholder="Channel name"
            value={channelName}
            onChangeText={setChannelName}
          />
        </Input>

        <Text fontSize="$md" fontWeight="$bold">Categories</Text>
        <Box flexDirection="row" justifyContent="space-between">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "solid" : "outline"}
              onPress={() => setSelectedCategory(category.name)}
            >
              <VStack>
                <Ionicons name={category.icon} size="md" />
                <Text fontSize="$xs">{category.name}</Text>
              </VStack>
            </Button>
          ))}
        </Box>

        <Text fontSize="$md" fontWeight="$bold">Description</Text>
        <Input>
          <InputField
            placeholder="Write here ..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </Input>

        <Box
          bg={{
            linearGradient: {
              colors: ['$lightBlue300', '$violet800'],
              start: [0, 0],
              end: [1, 0],
            },
          }}
        >
          <ButtonText>Confirm and create</ButtonText>
        </Box>
      </VStack>
    </Box>
  );
};

export default CreateChannelComponent;