import { memo, useState, useCallback, useMemo } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Post as PostType } from '@/types';
import { HStack } from '../ui/hstack';
import CommentsPopup from './popup';
import { 
  checkIsLiked, multiFormatDateString, 
  showToastMessage, useDeletePost, useLikePost, 
  useProfileStore, useSavePost 
} from '@/lib';
import { Text, View } from '../themed';
import Image from '../image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
const OverlappingImages = memo(({ images, numberofcomments }:any) => (
  <View className="flex-row items-center gap-4xs py-[2.5px]">
    <View className="flex-row overflow-hidden w-12.5">
      {images?.map((imageSource, index) => (
        <Image key={index} source={imageSource} style="w-4 h-4 rounded-[10px] mr-[-10px]" width={40} height={40} />
      ))}
    </View>
    <Text className="text-sm font-rmedium">{numberofcomments} people commented</Text>
  </View>
));

const ImageComponent = memo(({ image, width, height }:any) => (
  <Image source={ image}  style={`m-[3px] rounded-[5px] ${height} ${width}`} width={width} height={height} />
));

const AuthorInfo = memo(({ author, timestamp, iscomment }: any) => (
  <View className='flex-row items-center'>
    <TouchableOpacity onPress={() => router.push(`/user/${author?.id}`)}>
      {author?.image && (
        <Image
          source={author?.image}
          height={80}
          width={80}
          style='mr-2.5 w-[50px] h-[50px] rounded-3xl'
        />
      )}
    </TouchableOpacity>
    <View className='flex-1'>
      <View className='flex-row gap-1.5'>
        <Text className={`text-4 font-rmedium text-${iscomment ? "[12px]" : "[16px]"}`}>{author?.name}</Text>
      </View>
      <Text className={`text-[#aaa] font-pregular text-${iscomment ? "[8px]" : "[12px]"}`}>@{author?.username}</Text>
    </View>
    <Text className='font-pregular text-[10px] text-light'>{multiFormatDateString(timestamp)}</Text>
  </View>
));

const ActionStats = memo(({ author, likesList, postId, userId, isSaved, isLiked, handleLikePost, handleSavePost, handleDeletePost, setCommentsVisible }: any) => (
  <HStack className='justify-between'>
    <View className='flex-row mb-2.5 mt-5 gap-3'>
      <TouchableOpacity onPress={handleLikePost}>
      <Text className='font-rmedium text-rose-400 justify-evenly text-xs mr-2.5 pt-2'>
        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={22} />
        {likesList?.length || 0}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setCommentsVisible(true)}>
      <Text className='text-light'>
        <Feather name="message-circle" color={'grey'} size={22} />
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleSavePost} className='ml-1.5 rounded-[5px]'>
      <Ionicons name={!isSaved ? "bookmark-outline" : "bookmark-sharp"} size={20} color={'gray'} />
    </TouchableOpacity>
    </View>
    {author?.id == userId && (
      <TouchableOpacity onPress={() => handleDeletePost(postId, userId)} className='ml-auto rounded-[5px]'>
        <Feather name="edit" size={20} color="gray" />
      </TouchableOpacity>
    )}
  </HStack>
));

const Post = memo(({ author, content: caption, createdAt: timestamp, id: postId, comments, images, tags, likes: initialLikes, saves: savesList }: PostType) => {
  const { profile: { id: userId } } = useProfileStore();
  const [saves, setSaves] = useState(savesList);
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [isCommentsVisible, setCommentsVisible] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deletePost } = useDeletePost();

  const commentedUserImages = useMemo(() => comments?.slice(0, 3).map(comment => comment?.author?.image) || [], [comments]);

  const handleLikePost = useCallback(() => {
    setLikes(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    likePost(postId);
    showToastMessage("Post liked");
  }, [userId, postId, likePost]);

  const handleSavePost = useCallback(() => {
    setSaves(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    savePost(postId);
    showToastMessage("Post saved");
  }, [postId, savePost]);

  const handleDeletePost = useCallback(() => {
    router.push(`/edit-post/${postId}`);
  }, [postId]);

  
  return (
    <View className="p-2.5 mb-1">
      <AuthorInfo author={author} timestamp={timestamp} />
      <View className="flex-1 flex-col justify-center p-1 items-center">
        <Text className="font-rmedium text-base w-full ">{caption}</Text>
        {images?.length === 1 ? (
          <ImageComponent image={images[0]} width="w-[350px]" height="h-[230px]" />
        ) : (
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <ImageComponent image={item} width="w-[160px]" height="h-[230px]" />
            )}
          />
        )}
      </View>
      <View className="flex-row flex-wrap gap-1">
        {!!tags?.length && tags?.map((tag, index) => (
          <Text key={index} className="text-light p-2 text-xs font-rregular">#{tag}</Text>
        ))}
      </View>
      {comments?.length > 0 && (
        <OverlappingImages
          images={commentedUserImages}
          numberofcomments={comments.length}
        />
      )}
      <ActionStats
        author={author}
        postId={postId}
        // @ts-ignore
        isLiked={checkIsLiked(likes.map(like => like.id), userId)}
        likesList={likes}
        savesList={savesList}
        userId={userId}
        isSaved={checkIsLiked(saves.map(like => like.id), userId)}
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
        handleDeletePost={handleDeletePost}
        setCommentsVisible={setCommentsVisible}
      />
      { isCommentsVisible &&
        <CommentsPopup
        postId={postId}
        isVisible={isCommentsVisible}
        initialComments={comments}
        onClose={() => setCommentsVisible(false)}
      />
      }
    </View>
  );
});

export default Post;