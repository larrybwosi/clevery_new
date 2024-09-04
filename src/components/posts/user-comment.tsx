import AuthorInfo from './AuthorInfo';
import { Text, View } from '../themed';
import { Comment } from '@/types';

const UserComment = ({comment}:{comment:Comment}) => {
  return (
    <View>
      <AuthorInfo
       author={comment.author}
       timestamp={comment.createdAt}
       iscomment
      />
      <Text
      className='font-pregular text-[10px] ml-[70px] mt-[-15]'>{comment.text}</Text>
    </View>
  )
}

export default UserComment