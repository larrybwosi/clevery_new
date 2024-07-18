import { PostForm, Text, View } from '@/components';

const CreatePost = () => {
  return (
    <View className='flex-1 p-5 pb-7.5'>
      <Text className='font-rbold text-2xl mb-2.5' >Create a Post</Text>

      <Text 
        className='mb-3.5 mt-2.5 font-rbold text-[13px]'>
        Share your story with the world!Let your creativity shine and start crafting your masterpiece now.
      </Text>
      <PostForm action='Create'/>
    </View>
  );
};

export default CreatePost