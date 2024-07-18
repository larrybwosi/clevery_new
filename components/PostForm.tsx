import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { chooseImage, showToastMessage,useCreatePost, useUpdatePost } from "@/lib";
import SelectedImages from "./SelectedImages";
import FormField from "./auth/FormField";
import { Text, View } from "./Themed";
import { Post } from "@/types";
import Loader from "./Loader";
import { Badge } from "./badges/user";

type PostFormProps = {
  post?: Post;
  action: "Create" | "Update";
};

interface formFields {
  caption:string;
  files:any[];
  tags:string;
  timestamp:number;
  images:string[]
}

const PostForm = ({ post, action }: PostFormProps) => {
  const router = useRouter(); 

  const [fields, setFields] = useState<formFields>({
    caption:post?.caption?post.caption:'',
    files:[],
    tags:post?.tags?post.tags:'',
    timestamp:Date.now(),
    images:post?.images?post.images.map((img)=>img.asset._ref):[]
  })  
  
  const { mutateAsync: createPost, isPending: creatingPost,isError:createError } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: updatingPost,isError:updateError } =
    useUpdatePost();

    /** @TODO add a useEffect which adds the post values to the fields if the post values are defined*/

  const submitPost = async () => {
    if (!fields.caption) {
      return showToastMessage('Please fill in all the necessary fields.');
    }
    
    if(action==='Create'){
      await createPost(fields)
    }
    if(action==='Update'){
      await updatePost({
        ...fields, id:post?._id!,
      })
    }
    router.push("/");
  };

  const chooseFile = async () => {
    const file = await chooseImage();
    
    if(file){
      console.log(file)
      setFields({...fields,files:file})
    }
  };

  const handleImageDelete = (index:any) => {
    const newImages = [...fields.files];
    newImages.splice(index, 1);
    setFields({ ...fields,files:newImages})
  }; 

  
if(creatingPost || updatingPost) return <Loader loadingText="Uploading your post"/>
  return (
    <View 
      className="flex-1 h-full mb-[-30px]"
    >
      <SelectedImages images={fields.files} onDeleteImage={handleImageDelete} handleSelectImages={chooseFile} />
      <View style={{ marginBottom: 20 }}>
        
        <FormField 
          title='Caption'
          placeholder="Describe your post"
          enterKeyHint="next"
          value={fields.caption}
          handleChangeText={(v) => setFields({ ...fields, caption:v})}
        />
      </View>
      <View className="mb-5">
        <Text className="text-[10px] font-pregular mb-1.5">separated by commas</Text>
        <FormField 
          title='Tags'
          placeholder="people, places ,pets"
          keyboardType="default"
          autoCapitalize="none"
          enterKeyHint="done"
          value={fields.tags}
          handleChangeText={(v) => setFields({ ...fields, caption:v})}
        />
      </View>
      
      <TouchableOpacity
        onPress={submitPost}
        className="flex-row bg-[#007faa] w-[25%] rounded-[10px] p-2.5 gap-1.5"
      >
        <Text className="text-white font-psemibold" >Send</Text>
        
        <Ionicons name="send" color={'white'} style={{marginTop:3}} />
      </TouchableOpacity>
    </View>
  );
};

export default PostForm;
