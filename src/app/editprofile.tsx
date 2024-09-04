import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import {
  Avatar,
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  InputIcon,
  VStack,
  HStack,
  AvatarImage,
  View,
  Loader,
} from '@/components';
import { FontAwesome6, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { showToastMessage, useProfileStore, useUpdateCurrentUser } from '@/lib';
import { router } from 'expo-router';
import { useImageUploader } from '@/lib/uploadthing';
import * as Linking from 'expo-linking';

const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedBox = Animated.createAnimatedComponent(Box);

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
    x: userinfo.connections?.twitter,
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

  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    //@ts-ignore
    onClientUploadComplete: (file) => setAvatarUri(file?.serverData?.url),
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const updated = { id: userinfo.id, ...profile, ...connections, image: avatarUri }
      const response = await updateProfile(updated)
      updateProfileLocaly(response)
      showToastMessage("Profile Updated");
      router.replace("/profile")
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  // Animations
  const avatarScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const formOpacity = useSharedValue(0);

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: avatarScale.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
      backgroundColor: interpolateColor(
        buttonScale.value,
        [1, 1.1],
        ['#007aff', 'black']
      ),
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formOpacity.value * 50 }],
      padding: formOpacity.value * 20,
    };
  });

  useEffect(() => {
    avatarScale.value = withSpring(1.1, { damping: 2, stiffness: 80 });
    formOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const chooseFile = useCallback(async () => {
    const file = await openImagePicker({
      // input: , // Matches the input schema from the FileRouter endpoint
      source: "library", // or "camera"
      onInsufficientPermissions: () => {
        Alert.alert(
          "No Permissions",
          "You need to grant permission to your Photos to use this",
          [
            { text: "Dismiss" },
            { text: "Open Settings", onPress: async()=> await Linking.openSettings() },
          ],
        );
      },
    });
    console.log(file);
    // if (file) {
    //   setNewMessage((prev) => ({ ...prev, file:file[0] }));
    // }
  }, []);

  if (isUploading) {
    <Loader />
  }
  return (
    <ScrollView className=''>
      <VStack space="xl" style={{ padding: 20, paddingTop: 60 }}>
        <Animated.View style={avatarAnimatedStyle}>
          <Pressable 
            onPress={() => {
              avatarScale.value = withSpring(1.2, {}, () => {
                avatarScale.value = withSpring(1.1);
              });
              openImagePicker({
                source: "library",
                onInsufficientPermissions: () => {
                  Alert.alert(
                    "No Permissions",
                    "You need to grant permission to your Photos to use this",
                    [{ text: "Dismiss" }],
                  );
                },
              });
            }}
          >
            <HStack className="justify-center items-center" space='2xl'>
              <Avatar size="2xl" className="items-center rounded-md border-[#3498db]">
                <AvatarImage source={{ uri: avatarUri }} />
              </Avatar>
              <Button
                className="flex-1 w-20 flex-row items-center justify-center rounded-lg bg-cyan-500"
              >
                <MaterialIcons name="image" color="white"className="mr-2" />
                <ButtonText className='font-rregular text-sm'>Change Image</ButtonText>
              </Button>
            </HStack>

          </Pressable>
        </Animated.View>

        <AnimatedBox style={formAnimatedStyle}>
          <VStack space="lg">
            {Object.entries(profile).map(([key, value]) => (
              <FormControl key={key}>
                <FormControlLabel>
                  <FormControlLabelText className='font-rbold text-base text-gray-500'>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input
                  variant="outline"
                  className='items-center border-[#bdc3c7] border-2 rounded-lg'
                  size='lg'
                >
                  <InputField
                    value={value!}
                    onChangeText={(text) => setProfile({ ...profile, [key]: text })}
                    autoCapitalize='none'
                    style={{ color: '#2c3e50' }}
                  />
                  <InputIcon/>
                  <MaterialIcons
                    name={key === 'bio' ? 'description' : key === 'email' ? 'email' : key === 'location' ? 'location-on' : 'person'}
                    size={20}
                    color="#7f8c8d"
                  />
                </Input>
              </FormControl>
            ))}
          </VStack>
        </AnimatedBox>

        <AnimatedBox style={formAnimatedStyle}>
          <Text className='mb-4 font-rbold text-xl text-gray-500'>
            Social Links
          </Text>
          <VStack space="md">
            {Object.entries(connections).map(([platform, value]) => (
              <HStack key={platform} space="sm" className='items-center'>
                <Box style={{ width: 30, alignItems: 'center' }}>
                  <FontAwesome6
                    name={platform}
                    size={20}
                    color="#7f8c8d"
                  />
                </Box>
                <Input variant="underlined" className='flex-1'>
                  <InputField
                    value={value}
                    onChangeText={(text) => setConnections({ ...connections, [platform]: text })}
                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} username`}
                  />
                </Input>
              </HStack>
            ))}
          </VStack>
        </AnimatedBox>

        <AnimatedButton
          onPress={() => {
            buttonScale.value = withSpring(1.1, {}, () => {
              buttonScale.value = withSpring(1);
            });
            handleSubmit();
          }}
          isDisabled={isLoading}
          style={[buttonAnimatedStyle, { borderRadius: 10, height: 50, marginTop: 80, width: '50%' }]}
        >
          <ButtonText className='text-base font-rregular'>
            {isLoading ? "Saving..." : "Save Changes"}
          </ButtonText>
          <Ionicons name="save-outline" size={20} color="white" style={{ marginLeft: 8 }} />
        </AnimatedButton>
      </VStack>
    </ScrollView>
  );
};

export default UserProfileEdit;