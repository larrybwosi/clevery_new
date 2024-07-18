import { FlatList,KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { ErrorMessage, Loader, MessageInput, Post, Text, UserComment, View } from '@/components'
import { useCommentPost, useGetPostById, useProfileStore } from '@/lib'

export default function PostComponent() {
  const [comment, setComment] = useState('')
  const { profile } = useProfileStore();
  const {id} = useLocalSearchParams()

  const {data:post,isLoading:loading,error,refetch} = useGetPostById(id as string);
  const {mutateAsync:sendComment,isPending:commenting,error:errorCommenting} = useCommentPost()

  
const handleComment=async()=>{
  await sendComment({
    postid:post?._id!,
    userid:profile?._id,
    comment:comment
  })
  setComment('')
  refetch()
} 

if(loading) return <Loader loadingText="loading selected post" />
if (error) return <ErrorMessage message='Something went wrong' />

return (
  <View  className='flex-1 pt-8'>
    <Post props={post} />
    <Text className='font-rmedium text-base'>Comment on post</Text>
    <KeyboardAvoidingView behavior="position">
      <MessageInput
        caption={comment}
        onChooseFile={()=>{}}
        onMessageChange={(cmt)=>setComment(cmt)}
        onSend={()=>handleComment()}
        sending={commenting}
      />
    </KeyboardAvoidingView>
    <FlatList
      data={post?.comments}
      renderItem={({item}) => <UserComment comment={item as any}/>}
    />
  </View>
)
}