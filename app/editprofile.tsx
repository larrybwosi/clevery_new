import { useState } from 'react';
import { 
  Avatar, Box, Button, Flex, FormControl, Heading, Icon, Input, 
  ScrollView, Text, VStack, Pressable, HStack
} from 'native-base';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import { showToastMessage, useProfileStore, useUpdateCurrentUser } from '@/lib';
import { router } from 'expo-router';
import { uploadFile,  } from '@/lib/utils';

const UserProfileEdit = () => {
  const { profile:userinfo,setProfile:updateProfileLocaly } = useProfileStore();
  const [profile, setProfile] = useState({
    username: userinfo.username,
    name: userinfo.name,
    bio: userinfo.bio,
    email: userinfo.email,
    location: userinfo.country,
  });

  const [connections, setConnections] = useState({
    github: userinfo.connections?.github,
    instagram: userinfo.connections?.instagram,
    twitter: userinfo.connections?.twitter,
    discord: userinfo.connections?.discord,
    linkedin: userinfo.connections?.linkedin,
  });

  const {
    mutateAsync:updateProfile,
    isPending,
    error
  } = useUpdateCurrentUser()
  const [avatarUri, setAvatarUri] = useState(userinfo.image?userinfo.image:'https://via.placeholder.com/150');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async() => {
    // setIsLoading(true);
    
    try {
      // setIsLoading(true);
      
      const res = await uploadFile(avatarUri)
      console.log(res)
      // setAvatarUri(res?.url)
      return
      const updated = {id:userinfo.id, ...profile, ...connections,image:res }

      const response = await updateProfile(updated)
      updateProfileLocaly(response)
      showToastMessage("Profile Updated");
      router.replace("/profile")
      setIsLoading(false)
    } catch (error:any) {
      console.log(error)
      setIsLoading(false)
    }
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
    <ScrollView bg="gray.100"  pt={"20"} pb="16">

      <VStack space={4} mt="-50px" px={4} pb={6} pt="16">
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
                  value={value!} 
                  onChangeText={(text) => setProfile({ ...profile, [key]: text })}
                  variant="filled"
                  bg="gray.100"
                  autoCapitalize='none'
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
          mb={"16"}
        >
          Save Changes
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default UserProfileEdit;