import { useLocalSearchParams } from "expo-router";
import { ErrorMessage, Loader, Text, View ,PostForm} from "@/components";
import { useGetPostById } from "@/lib";


const EditPost = () => {
  const {postid} = useLocalSearchParams()
  
  const { 
    data: post, 
    isPending:loadingPost,
    error 
  } = useGetPostById(postid as string);

  if (loadingPost) return <Loader loadingText="loading your post" />
  if(!post) return <ErrorMessage message="Post not found" />
  if(error) return <ErrorMessage message="Post not found" />

  return (
    <View className="flex-1 pb-12 p-2.5">
      <View className="flex-row items-center p-1.5">
        <Text className="font-rmedium text-2xl mb-5">Edit your Post</Text>
      </View>
        <PostForm action="Update" post={post} />
    </View>
  );
};


export default EditPost;
