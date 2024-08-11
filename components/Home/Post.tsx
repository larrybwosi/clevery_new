import React, { memo, useState, useCallback } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Text, View } from '../Themed';
import { useLikePost, useSavePost, useDeletePost, useProfileStore } from '@/lib';
import { checkIsLiked } from '@/lib/utils';
import ActionStats from './ActionStats';
import AuthorInfo from './AuthorInfo';
import ImageCont from './ImagesCont';
import { Post as PostType } from '@/types';

const OverlappingImages = memo(({ images, numberofcomments }: { images: string[], numberofcomments: number }) => (
  <View className="flex-row items-center gap-4xs py-[2.5px]">
    <View className="flex-row overflow-hidden w-12.5">
      {images?.map((imageSource, index) => (
        <Image
          key={index}
          source={imageSource}
          className="w-4 h-4 rounded-[10px] mr-[-10px]"
        />
      ))}
    </View>
    <Text className="text-sm font-rmedium">{numberofcomments} people commented</Text>
  </View>
));

const Post = memo(({ author, content: caption, createdAt: timestamp, id: postId, comments, images, tags, likes: initialLikes, saves: savesList }: PostType) => {
  const { profile: { id: userId } } = useProfileStore();
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState<string[]>(initialLikes);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deletePost } = useDeletePost();

  const commentedUserImages = comments?.slice(0, 3).map(comment => comment?.user?.image) || [];

  const handleLikePost = useCallback(() => {
    setLikes(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
    likePost(postId);
  }, [userId, postId, likePost]);

  const handleSavePost = useCallback(() => {
    savePost(postId);
    setIsSaved(true);
  }, [postId, savePost]);

  const handleDeletePost = useCallback(() => {
    router.push(`/edit-post/${postId}`);
  }, [postId]);

  return (
    <View className="p-2.5 mb-3.5">
      <AuthorInfo author={author} timestamp={timestamp} />
      <ImageCont images={images} caption={caption} />
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
        isLiked={checkIsLiked(likes, userId)}
        likesList={likes}
        savesList={savesList}
        userId={userId}
        isSaved={isSaved}
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
        handleDeletePost={handleDeletePost}
      />
    </View>
  );
});

export default Post;