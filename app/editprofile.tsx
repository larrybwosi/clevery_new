import React, { useState } from 'react';
import { Avatar, Box, Button, Flex, FormControl, Heading, Icon, Input, Link, ScrollView, Text, TextArea } from 'native-base';
import { FontAwesome6 } from '@expo/vector-icons';

const UserProfileEdit = () => {
  const [profile, setProfile] = useState({
    username: 'johndoe',
    name: 'John Doe',
    bio: 'Software Engineer',
  });

  const [connections, setConnections] = useState({
    github: 'johndoe',
    instagram: 'johndoe',
    twitter: 'johndoe',
    discord: 'johndoe#1234',
  });

  const handleSubmit = () => {
    console.log({ ...profile, ...connections });
  };

  return (
    <ScrollView p={1} pt={10}>
      <Flex direction="row" alignItems="center" mb={6}>
        <Avatar size="xl" source={{ uri: 'https://via.placeholder.com/150' }} />
        <Heading ml={4} size="xl">
          Edit Profile
        </Heading>
      </Flex>

      {Object.entries(profile).map(([key, value]) => (
        <FormControl mb={4} key={key}>
          <FormControl.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</FormControl.Label>
          <Input value={value} onChangeText={(text) => setProfile({ ...profile, [key]: text })} />
        </FormControl>
      ))}

      <Heading size="md" mb={2}>
        Social Links
      </Heading>

      {['github', 'instagram', 'twitter', 'discord'].map((platform) => (
        <Flex direction="row" alignItems="center" mb={2} key={platform}>
          <Icon
            as={{
              github: FontAwesome6,
              instagram: FontAwesome6,
              twitter: FontAwesome6,
              discord: FontAwesome6,
            }[platform]}
            name={platform}
            size={6}
            color="gray.500"
          />
          <Input
            ml={2}
            value={connections[platform]}
            onChangeText={(text) => setConnections({ ...connections, [platform]: text })}
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} username`}
          />
        </Flex>
      ))}
      
      <Button colorScheme="blue" onPress={handleSubmit}>
        Save Changes
      </Button>
    </ScrollView>
  );
};

export default UserProfileEdit;
