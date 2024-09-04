import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '../ui/modal';
import { useCommentPost, useProfileStore, useLikeComment } from '@/lib';
import { Comment as CommentType } from '@/types';
import { HStack } from '../ui/hstack';
import Image from '../image';

const Comment = ({ comment, onReply, onLike, currentUser, depth = 0 }: { 
  comment: CommentType; 
  onReply: (comment: CommentType) => void; 
  onLike: (commentId: string) => void;
  currentUser: any;
  depth?: number 
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasReplies = comment.replies && comment?.replies?.length > 0;
  const isAuthor = comment.authorId === currentUser.id;
  const isLiked = comment.likes?.some(like => like.id === currentUser.id);
console.log(comment.author.image)
  return (
    <View className={`p-2 mb-4 ml-${depth * 4}`}>
      <HStack space='md' className='items-center'>
        <Image source={ comment.author.image } width={50} height={50} style='w-8 h-8 rounded-full' />
        <Text className='font-rmedium'>{isAuthor ? 'You' : comment.author.name}</Text>
      </HStack>
      <Text>{comment.text}</Text>
      <View className='flex-row items-center mt-1.5'>
        <TouchableOpacity 
          onPress={() => onLike(comment.id)} 
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}
        >
          <AntDesign name={isLiked ? "like1" : "like2"} size={16} color={isLiked ? "#007AFF" : "#666"} />
          <Text style={{ marginLeft: 5 }}>{comment.likes?.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onReply(comment)}>
          <Text style={{ color: '#666' }}>Reply</Text>
        </TouchableOpacity>
      </View>
      {hasReplies && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ marginTop: 5 }}>
          <Text style={{ color: '#666' }}>
            {expanded ? 'Hide replies' : `View ${comment.replies?.length} replies`}
          </Text>
        </TouchableOpacity>
      )}
      {expanded && comment.replies.map(reply => (
        <Comment 
          key={reply.id} 
          comment={reply} 
          onReply={onReply} 
          onLike={onLike}
          currentUser={currentUser}
          depth={depth + 1} 
        />
      ))}
    </View>
  );
};

const CommentsPopup = ({ isVisible, onClose, postId,initialComments }) => {
  const [comments, setComments] = useState<CommentType[]>(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<CommentType | null>(null);
  const translateY = useSharedValue(1000);
  const { profile } = useProfileStore();
  const {
    mutateAsync: sendComment,
    isPending: commenting 
  } = useCommentPost();
  const { mutateAsync: likeComment } = useLikeComment();

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 15 });
      // Fetch comments here
    } else {
      translateY.value = withSpring(1000, { damping: 15 });
    }
  }, [isVisible]); 

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    const newCommentObj: CommentType = {
      id: Date.now().toString(),
      text: newComment,
      authorId: profile.id,
      postId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: profile,
      likes: [],
      replies: [],
    };

    try {
      if (replyTo) {
        const response = await sendComment({
          postId,
          comment: newComment,
          parentCommentId: replyTo.id,
        });
        setComments(prevComments => updateCommentsTree(prevComments, replyTo.id, response));
        setReplyTo(null);
      } else {
        const response = await sendComment({
          postId,
          comment: newComment,
        });
        setComments(prevComments => [response, ...prevComments]);
      }
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleReply = (comment: CommentType) => {
    setReplyTo(comment);
    // You might want to scroll to the input or focus it here
  };

  const handleLike = async (commentId: string) => {
    try {
      await likeComment({ commentId });
      setComments(prevComments => 
        updateCommentsTree(prevComments, commentId, comment => ({
          ...comment,
          likes: comment.likes?.some(like => like?.id === profile.id)
            ? comment.likes?.filter(like => like?.id !== profile.id)
            : [...comment.likes, { id: profile.id }],
        }))
      );
    } catch (error) {
      console.error('Failed to like comment:', error);
      // Handle error
    }
  };

  const updateCommentsTree = (comments: CommentType[], targetId: string, updateFn: (comment: CommentType) => CommentType): CommentType[] => {
    return comments.map(comment => {
      if (comment.id === targetId) {
        return updateFn(comment);
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentsTree(comment.replies, targetId, updateFn),
        };
      }
      return comment;
    });
  };

  const NoCommentsView = () => (
    <View className="flex-1 justify-center items-center p-4">
      <FontAwesome name="comments-o" size={64} color="#666" />
      <Text className="text-lg font-rbold mt-4 text-center">No comments yet</Text>
      <Text className="text-sm text-gray-600 mt-2 text-center">
        Be the first to share your thoughts on this post!
      </Text>
    </View>
  );

  return (
    <Modal isOpen={isVisible} onClose={onClose} size="full" className='border-gray-50'>
      <View className='flex-1' />
      <ModalContent className="m-0 rounded-t-[20px] bg-gray-50 shadow-md mb-3 ">
        <ModalHeader>
          <Text className="font-rbold text-lg">Comments</Text>
          <ModalCloseButton>
            <AntDesign name="close" size={24} color="#666" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className="max-h-[70%]">
          {comments?.length === 0 ? (
            <NoCommentsView />
          ) : (
            <FlatList
              data={comments}
              renderItem={({ item }) => (
                <Comment 
                  comment={item} 
                  onReply={handleReply} 
                  onLike={handleLike}
                  currentUser={profile}
                />
              )}
              keyExtractor={item => item.id}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
            className="w-full"
          >
            <View className="flex-row items-center mt-2.5">
              <TextInput
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
                value={newComment}
                onChangeText={setNewComment}
                placeholder={replyTo ? `Reply to ${replyTo.author.name}...` : "Add a comment..."}
              />
              <TouchableOpacity onPress={handleAddComment} disabled={commenting}>
                <FontAwesome name={commenting ? "spinner" : "paper-plane-o"} size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommentsPopup;