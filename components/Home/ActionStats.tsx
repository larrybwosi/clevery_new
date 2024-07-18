import { Feather, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Text, View } from '../Themed';


type ActionStatsProps = {
  author: any;
  postId: string;
  isLiked: boolean;
  isSaved: boolean;
  userId: string;
  likesList: any[];
  savesList:any[];
  handleLikePost: () => void;
  handleSavePost: () => void;
  handleDeletePost: (postId:string,userId:string,images?:string[]) => void;
};


const ActionStats = ({
  author,
  likesList,
  postId,
  userId,
  isSaved,
  isLiked,
  savesList,
  handleLikePost,
  handleSavePost,
  handleDeletePost,
}: ActionStatsProps) => {
  return (
    <View className='flex-row mb-2.5 mt-5'>
    
      <TouchableOpacity onPress={handleLikePost}>
        <Text className='font-rmedium justify-evenly text-xs mr-2.5 pt-2'>
          <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={22} color={'#EA1820'} />
          {likesList?.length||0}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>router.push(`/post/${postId}`)} >
        <Text className='text-light'>
          <Feather name="message-circle" color={'grey'} size={22} />
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleSavePost} className='ml-1.5 rounded-[5px]' >
        <Ionicons name={!isSaved ? "bookmark-outline" : "bookmark-sharp"} size={20} color={'gray'} />
      </TouchableOpacity>

      {author?._id == userId && (
        <TouchableOpacity onPress={()=>handleDeletePost(postId,userId)} className='ml-auto rounded-[5px]'>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ActionStats;