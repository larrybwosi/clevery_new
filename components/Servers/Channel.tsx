import React, { useState } from 'react';
import { Box, VStack, Input, Text, Button, Icon, useToast } from 'native-base';
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
      title: "Error creating channel",
      description: "Please try again later.",
    });
  };

  return (
    <Box p={4} bg="white" safeArea>
      <VStack space={4}>
        <Text fontSize="2xl" fontWeight="bold">Create channel</Text>
        <Text fontSize="md" color="gray.500">Create your own channel from below.</Text>

        <Input
          placeholder="Channel name"
          value={channelName}
          onChangeText={setChannelName}
        />

        <Text fontSize="md" fontWeight="bold">Categories</Text>
        <Box flexDirection="row" justifyContent="space-between">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "solid" : "outline"}
              onPress={() => setSelectedCategory(category.name)}
            >
              <VStack>
                <Icon as={Ionicons} name={category.icon} size="md" />
                <Text fontSize="xs">{category.name}</Text>
              </VStack>
            </Button>
          ))}
        </Box>

        <Text fontSize="md" fontWeight="bold">Description</Text>
        <Input
          placeholder="Write here ..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Box
          // onPress={handleCreateChannel}
          bg={{
            linearGradient: {
              colors: ['lightBlue.300', 'violet.800'],
              start: [0, 0],
              end: [1, 0],
            },
          }}
        >
          Confirm and create
        </Box>
      </VStack>
    </Box>
  );
};

export default CreateChannelComponent;