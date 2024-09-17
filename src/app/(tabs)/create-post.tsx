import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { ScrollView, TextInput, Image, Pressable, Text as RNText, Alert, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ErrorMessage, Loader, Text, Toast, ToastDescription, ToastTitle, useToast, View } from '@/components';
import { router, useLocalSearchParams } from 'expo-router';
import { useCreatePost, useDeletePost, usePost, useUpdatePost } from '@/lib';
import { useImageUploader } from '@/lib/uploadthing';
import { Textarea, TextareaInput } from '@/components/ui/textarea';

const CreateUpdatePost = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const isUpdating = !!id;

  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [toastId, setToastId] = useState('0');
  const contentInputRef = useRef(null);
  const toast = useToast();

  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });
  
  const { 
    mutateAsync: createPost, 
    isPending: creatingPost, 
    isError: createError 
  } = useCreatePost();
  const { 
    mutateAsync: updatePost, 
    isPending: updatingPost, 
    isError: updateError 
  } = useUpdatePost();
  const {
    data: existingPost,
    isLoading: loadingPost,
    isError: loadError
  } = usePost(id as string);

  const {
    mutateAsync: deletePost,
    isPending: deletingPost,
    isError: deleteError
  } = useDeletePost();

  useEffect(() => {
    if (existingPost) {
      setContent(existingPost.content);
      setImages(existingPost.images);
      setTags(existingPost.tags);
    }
  }, [existingPost]);

  const showNewToast = ({
    title = "Success",
    description = "Your post has been processed successfully.",
  }) => {
    const newId = Math.random().toString();
    setToastId(newId);
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="outline" className="bg-gray-700 p-2 w-full">
            <ToastTitle className="text-white">{title}</ToastTitle>
            <ToastDescription className="text-white">
              {description}
            </ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleAddImage = useCallback(async () => {
    const file = await openImagePicker({
      source: "library",
      onInsufficientPermissions: () => {
        Alert.alert(
          "No Permissions",
          "You need to grant permission to your Photos to use this",
          [
            { text: "Dismiss" },
            { text: "Open Settings", onPress: async () => await Linking.openSettings() },
          ],
        );
      },
    });
    setImages(prev => [...prev, file[0]?.serverData?.url]);
  }, []);

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags(prev => [...prev, currentTag]);
      setCurrentTag('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === ',') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handlePost = async () => {
    if (!content) {
      contentInputRef.current?.focus();
      showNewToast({ title: "Error", description: "Please enter content for your post." });
      return;
    }

    const postData = { content, images, tags };
    
    try {
      if (isUpdating) {
        await updatePost({ id: id as string, ...postData });
        showNewToast({ title: "Success", description: "Your post has been updated." });
      } else {
        await createPost(postData);
        showNewToast({ title: "Success", description: "Your post has been created." });
      }
      router.navigate('/');
    } catch (error) {
      showNewToast({ title: "Error", description: "Failed to process your post. Please try again." });
    }
  };

  const handleDeletePost =async()=>{
    await deletePost(id as string);
    showNewToast({ title: "Success", description: "Your post has been deleted." });
    router.navigate('/');
  } 

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const buttonScale = useSharedValue(1);
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const fadeInConfig = { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) };

  if (loadingPost) return <Loader loadingText="Loading post data..." />;
  if (createError || updateError || loadError) return <ErrorMessage message="Something went wrong. Please try again." />;
  if (isUploading) return <Loader loadingText="Uploading your image..." />;
  if (creatingPost || updatingPost) return <Loader loadingText={`${isUpdating ? 'Updating' : 'Creating'} your post...`} />;

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Animated.View entering={FadeIn.duration(500)} className="mb-6">
        <Text className="text-3xl font-rbold text-gray-800 mb-2">
          {isUpdating ? 'Update Post' : 'Create Post'}
        </Text>
        <Text className="text-base font-rregular text-gray-600">
          {isUpdating 
            ? 'Edit your post and share your updated thoughts with your network!'
            : 'Share your thoughts, images, and more with your Clevery network!'}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(100).duration(500)} className="mb-6">
        <Textarea size='xl'>
          <TextareaInput
            ref={contentInputRef}
            multiline
            numberOfLines={5}
            placeholder="What's on your mind?"
            value={content}
            placeholderClassName='text-base font-rregular text-gray-400'
            onChangeText={setContent}
            className="rounded-lg p-4 text-base font-rregular border border-gray-200 bg-gray-500"
            style={{ textAlignVertical: 'top' }}
          />
        </Textarea>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(200).duration(500)} className="mb-6  p-4 rounded-lg bg-gray-700">
        <Text className="text-xl font-rmedium text-gray-800 mb-2">Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((image, index) => (
            <Animated.View key={index} entering={SlideInRight.delay(index * 100)} exiting={SlideOutLeft} className="mr-4 relative">
              <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 10 }} />
              <AnimatedPressable 
                onPress={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-2"
                entering={FadeIn.delay(300)}
              >
                <Feather name="x" size={18} color="white" />
              </AnimatedPressable>
            </Animated.View>
          ))}
          {images.length < 3 && (
            <AnimatedPressable 
              onPress={handleAddImage}
              className="w-28 h-28 bg-blue-200 rounded-lg items-center justify-center"
              entering={FadeIn.delay(200)}
            >
              <Feather name="plus" size={28} color="#4A90E2" />
            </AnimatedPressable>
          )}
        </ScrollView>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300).duration(500)} className="mb-6">
        <Text className="text-lg font-rmedium text-gray-800 mb-2">Tags</Text>
        <View className="flex-row flex-wrap mb-2">
          {tags.map((tag, index) => (
            <Animated.View 
              key={index} 
              entering={SlideInRight.delay(index * 50)} 
              exiting={SlideOutLeft}
              className="bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
            >
              <Text className="text-sm font-rmedium text-blue-800 mr-1">#{tag}</Text>
              <Pressable onPress={() => handleRemoveTag(tag)}>
                <Feather name="x" size={16} color="#4A90E2" />
              </Pressable>
            </Animated.View>
          ))}
        </View>
        <View className="flex-row items-center">
          <TextInput
            value={currentTag}
            onChangeText={setCurrentTag}
            onKeyPress={handleKeyPress}
            placeholderClassName='text-base font-rregular text-gray-500'
            placeholder="Add a tag"
            className="flex-1 bg-gray-500 rounded-lg p-2 text-base font-rregular text-gray-800 mr-2"
          />
          <Pressable 
            onPress={handleAddTag}
            className="bg-blue-500 rounded-lg p-2"
          >
            <Feather name="plus" size={24} color="white" />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(500).duration(500)} className="mt-6 bg-yellow-100 rounded-lg p-4">
        <RNText className="text-lg font-rmedium mb-2">Posting Tips</RNText>
        <RNText className="text-base font-rregular">
          • Keep your content engaging and positive
          {'\n'}• Use relevant tags to increase visibility
          {'\n'}• High-quality images can make your post stand out
          {'\n'}• Respect others' privacy when posting
          {'\n'}• {isUpdating ? 'Update your post to reflect new information or changes' : 'Review your post before publishing'}
        </RNText>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(400).duration(500)} className="mt-4 gap-5">
        <AnimatedPressable
          onPress={handlePost}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={buttonAnimatedStyle}
          className="bg-blue-500 rounded-lg py-3 px-6"
        >
          <Text className="text-lg font-rmedium text-white text-center">
            {isUpdating ? 'Update Post' : 'Create Post'}
          </Text>
        </AnimatedPressable>
        {isUpdating && 
        <AnimatedPressable
          onPress={() => handleDeletePost()}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={buttonAnimatedStyle}
          disabled={deletingPost}
          className="bg-red-600 rounded-lg py-3 px-6"
        >
          <Text className="text-lg font-rmedium text-white text-center">
            Delete Post
          </Text>
        </AnimatedPressable>}
      </Animated.View>
    </ScrollView>
  );
};

export default memo(CreateUpdatePost);