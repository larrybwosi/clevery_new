import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { chooseImage, showToastMessage, useCreatePost, useUpdatePost } from "@/lib";
import SelectedImages from "./SelectedImages";
import FormField from "./auth/FormField";
import { Text, View } from "./Themed";
import Loader from "./Loader";
import { CreatePostData, Post } from "@/types";

type PostFormProps = {
  post?: Post;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const [fields, setFields] = useState<CreatePostData>({
    content: post?.content || '',
    tags: post?.tags || [],
    images: post?.images || []
  });
  
  const [newImages, setNewImages] = useState<string[]>([]);

  const { mutateAsync: createPost, isPending: creatingPost, isError: createError } = useCreatePost();
  const { mutateAsync: updatePost, isPending: updatingPost, isError: updateError } = useUpdatePost();

  const submitPost = async () => {
    if (!fields.content) {
      return showToastMessage('Please fill in all the necessary fields.');
    }
    
    if (action === 'Create') {
      await createPost(fields);
    }
    if (action === 'Update') {
      await updatePost({
        ...fields,
        id: post?.id!,
        images: newImages
      });
    }
    router.push("/");
  };

  const chooseFile = async () => {
    const file = await chooseImage();
    
    if (file) {
      console.log(file);
      if (action === 'Create') {
        setFields({ ...fields, images: [...fields.images, ...file] });
      } else {
        setNewImages([...newImages, ...file]);
        setFields({ ...fields, images: [...fields.images, ...file] });
      }
    }
  };

  const handleImageDelete = (index: number) => {
    const newImages = [...fields.images];
    const deletedImage = newImages.splice(index, 1)[0];
    setFields({ ...fields, images: newImages });
    
    if (action === 'Update') {
      setNewImages(prevNewImages => prevNewImages.filter(img => img !== deletedImage));
    }
  }; 

  if (creatingPost || updatingPost) return <Loader loadingText="Uploading your post" />;

  return (
    <View className="flex-1 h-full mb-[-30px]">
      <SelectedImages images={fields.images} onDeleteImage={handleImageDelete} handleSelectImages={chooseFile} />
      <View style={{ marginBottom: 20 }}>
        <FormField 
          title='Content'
          placeholder="Describe your post"
          enterKeyHint="next"
          value={fields.content}
          handleChangeText={(v) => setFields({ ...fields, content: v })}
        />
      </View>
      <View className="mb-5">
        <Text className="text-[10px] font-pregular mb-1.5">separated by commas</Text>
        <FormField 
          title='Tags'
          placeholder="people, places, pets"
          keyboardType="default"
          autoCapitalize="none"
          enterKeyHint="done"
          value={fields?.tags?.join(', ')!}
          handleChangeText={(v) => setFields({ ...fields, tags: v.split(',').map(tag => tag.trim()) })}
        />
      </View>
      
      <TouchableOpacity
        onPress={submitPost}
        disabled={creatingPost || updatingPost}
        className="flex-row bg-[#007faa] w-[45%] rounded-[10px] p-2.5 gap-1.5"
      >
        <Text className="text-white font-rmedium">{action === 'Create' ? "Create Post" : "Update post"}</Text>
        <Feather name={action !== 'Create' ? "upload-cloud" : "refresh-cw"} color={'white'} size={16} style={{marginTop: 3}} />
      </TouchableOpacity>
    </View>
  );
};

export default PostForm;