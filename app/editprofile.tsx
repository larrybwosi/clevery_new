import { useCallback, useState } from 'react';
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Icon,
  Input,
  InputField,
  InputIcon,
  VStack,
  HStack,
  Pressable,
} from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';
import { FontAwesome6, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { showToastMessage, useProfileStore, useUpdateCurrentUser } from '@/lib';
import { router } from 'expo-router';
import { selectImage, uploadFile } from '@/lib/utils';
import { Animated } from 'react-native';
import { Text } from '@/components';

const UserProfileEdit = () => {
  const { profile: userinfo, setProfile: updateProfileLocaly } = useProfileStore();
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
    mutateAsync: updateProfile,
    isPending,
    error
  } = useUpdateCurrentUser()
  const [avatarUri, setAvatarUri] = useState(userinfo.image ? userinfo.image : 'https://via.placeholder.com/150');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const res = await uploadFile(avatarUri)
      const updated = { id: userinfo.id, ...profile, ...connections, image: res }

      const response = await updateProfile(updated)
      updateProfileLocaly(response)
      showToastMessage("Profile Updated");
      router.replace("/profile")
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  };

  const chooseFile = useCallback(async () => {
    const file = await selectImage();
    if (file) {
      setAvatarUri(file[0]);
    }
  }, []);

  return (
    <ScrollView style={{ paddingTop: 80, paddingBottom: 64 }}>
      <VStack space="md" style={{ marginTop: -50, paddingHorizontal: 16, paddingBottom: 24, paddingTop: 64 }}>
        <Animated.View>
          <Pressable onPress={chooseFile}>
            <Avatar size="2xl" source={{ uri: avatarUri }} borderWidth={4} borderColor="white">
              <AvatarBadge bg="$green500">
                <MaterialIcons name="edit" color="white" size={20}/>
              </AvatarBadge>
            </Avatar>
          </Pressable>
        </Animated.View>

        <Box bg="$white" borderRadius="$xl" shadowColor="$black" shadowOpacity={0.1} shadowRadius={3} shadowOffset={{ width: 0, height: 2 }} p="$5">
          <VStack space="md">
            {Object.entries(profile).map(([key, value]) => (
              <FormControl key={key}>
                <FormControlLabel>
                  <FormControlLabelText className='text-gray-700 font-rregular text-xs'>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input
                  variant="outline"
                  bg="$gray100"
                >
                  <InputField
                    value={value!}
                    onChangeText={(text) => setProfile({ ...profile, [key]: text })}
                    autoCapitalize='none'
                  />
                  <InputIcon>
                    <MaterialIcons
                      name={key === 'bio' ? 'description' : key === 'email' ? 'email' : key === 'location' ? 'location-on' : 'person'}
                      size={20}
                      color="gray"
                    />
                  </InputIcon>
                </Input>
              </FormControl>
            ))}
          </VStack>
        </Box>

        <Box bg="$white" borderRadius="$xl" shadowColor="$black" shadowOpacity={0.1} shadowRadius={3} shadowOffset={{ width: 0, height: 2 }} p="$5">
          <Text className='mb-4 font-rbold text-lg text-gray-700'>
            Social Links
          </Text>
          <VStack space="md">
            {Object.entries(connections).map(([platform, value]) => (
              <HStack key={platform} space="sm" alignItems="center">
                <Box bg="$gray100" p="$2" borderRadius="$full">
                  <FontAwesome6
                    name={platform}
                    size="md"
                    color="$gray500"
                  />
                </Box>
                <Input flex={1} variant="underlined">
                  <InputField
                    value={value}
                    onChangeText={(text) => setConnections({ ...connections, [platform]: text })}
                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} username`}
                  />
                </Input>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Button
          onPress={handleSubmit}
          isDisabled={isLoading}
          borderRadius="$full"
          bg="$blue500"
          shadowColor="$black"
          shadowOpacity={0.1}
          shadowRadius={2}
          shadowOffset={{ width: 0, height: 1 }}
          mb="$16"
        >
          <ButtonText>{isLoading ? "Saving..." : "Save Changes"}</ButtonText>
          <Ionicons  name="save-outline" size={20} color="white" />
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default UserProfileEdit;