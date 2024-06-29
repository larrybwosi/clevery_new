import { selector, useAddFriend, useGetUserFriends, useGetUsers } from '@/lib';
import { ErrorMessage, InviteFriends, Loader } from '@/components';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  image: string;
  name: string;
}

const AddFriends: React.FC = () => {
  const  [filteredUsers, setFilteredUsers] = useState([])
  const profile = selector((state) => state.profile.profile);
  const { data: allUsers, isPending: loadingUsers, isError: errorUsers } = useGetUsers();
  const { mutateAsync: addFriend } = useAddFriend();
  const { data: friends, isPending: loadingFriends, isError: errorFriends } = useGetUserFriends('');

  const handleAddFriend = async (user:User) => {
    await addFriend( user._id);
  };

  useEffect(() => {
   filterNonFriends()
   .then((users:any)=>setFilteredUsers(users))
  }, [friends])
  
  
  if (loadingUsers || loadingFriends) return <Loader loadingText="Loading users" />;
  if (errorUsers||errorFriends ) return <ErrorMessage message="Failed to get users" />;

  async function filterNonFriends() {
    const friendIds = new Set(friends?.map((friend: any) => friend._id));
    return allUsers?.filter(
      (user: any) => user._id !== profile._id && !friendIds.has(user._id)
    );
  }
  return (
    <InviteFriends
      selectedUsers={[]}
      buttonText='Add Friend'
      onClose={()=>router.back()}
      onInvitePress={handleAddFriend}
      removeUser={()=>{}}
      users={filteredUsers}
    />
  )
};
export default AddFriends;
