import { useState } from 'react';
import { TouchableOpacity, ImageBackground } from 'react-native';
import { 
  Avatar, Box, Button, Flex, FormControl, Heading, Icon, Input, 
  ScrollView, Text, VStack, useToast, Pressable, HStack
} from 'native-base';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import { showToastMessage } from '@/lib';

const UserProfileEdit = () => {
  const [profile, setProfile] = useState({
    username: 'johndoe',
    name: 'John Doe',
    bio: 'Software Engineer',
    email: 'johndoe@example.com',
    location: 'New York, USA',
  });

  const [connections, setConnections] = useState({
    github: 'johndoe',
    instagram: 'johndoe',
    twitter: 'johndoe',
    discord: 'johndoe#1234',
    linkedin: 'johndoe',
  });

  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/150');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulating an API call
    setTimeout(() => {
      setIsLoading(false);
      showToastMessage("Profile Updated");
    }, 2000);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView bg="gray.100">
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
        style={{ height: 200, justifyContent: 'flex-end', alignItems: 'center' }}
      >
        <Box bg="rgba(0,0,0,0.5)" w="100%" p={4}>
          <Heading color="white" size="xl" textAlign="center">
            Edit Profile
          </Heading>
        </Box>
      </ImageBackground>

      <VStack space={4} mt="-50px" px={4} pb={6}>
        <Animatable.View animation="bounceIn" duration={1500}>
          <Pressable onPress={pickImage}>
            <Avatar 
              size="2xl" 
              source={{ uri: avatarUri }}
              borderWidth={4}
              borderColor="white"
            >
              <Avatar.Badge bg="green.500">
                <Icon as={MaterialIcons} name="edit" color="white" size="sm" />
              </Avatar.Badge>
            </Avatar>
          </Pressable>
        </Animatable.View>

        <Box bg="white" rounded="xl" shadow={3} p={5}>
          <VStack space={4}>
            {Object.entries(profile).map(([key, value]) => (
              <FormControl key={key}>
                <FormControl.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</FormControl.Label>
                <Input 
                  value={value} 
                  onChangeText={(text) => setProfile({ ...profile, [key]: text })}
                  variant="filled"
                  bg="gray.100"
                  InputLeftElement={
                    <Icon 
                      as={<MaterialIcons name={key === 'bio' ? 'description' : key === 'email' ? 'email' : key === 'location' ? 'location-on' : 'person'} />}
                      size={5}
                      ml={2}
                      color="gray.400"
                    />
                  }
                />
              </FormControl>
            ))}
          </VStack>
        </Box>

        <Box bg="white" rounded="xl" shadow={3} p={5}>
          <Heading size="md" mb={4}>
            Social Links
          </Heading>
          <VStack space={4}>
            {Object.entries(connections).map(([platform, value]) => (
              <HStack key={platform} space={3} alignItems="center">
                <Box bg="gray.100" p={2} rounded="full">
                  <Icon
                    as={FontAwesome5}
                    name={platform}
                    size={5}
                    color="gray.500"
                  />
                </Box>
                <Input
                  flex={1}
                  value={value}
                  onChangeText={(text) => setConnections({ ...connections, [platform]: text })}
                  placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} username`}
                  variant="underlined"
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <Button 
          colorScheme="blue" 
          onPress={handleSubmit}
          isLoading={isLoading}
          isLoadingText="Saving..."
          endIcon={<Icon as={Ionicons} name="save-outline" size="sm" />}
          rounded="full"
          shadow={2}
        >
          Save Changes
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default UserProfileEdit;