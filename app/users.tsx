import { useEffect, useState } from 'react';
import { router } from 'expo-router';

import { ErrorMessage, InviteFriends } from '@/components';
import { useAddFriend, useUsers, useProfileStore } from '@/lib';
import LoadingUsers from '@/components/skeletons/loading-users';
import { User } from '@/types';

const AddFriends: React.FC = () => {
  const  [filteredUsers, setFilteredUsers] = useState([])
  const { profile, setProfile} = useProfileStore();
  const { data: allUsers, isPending: loadingUsers, isError: errorUsers } = useUsers();
  const { mutateAsync: addFriend } = useAddFriend();
  const { id, friends } =profile
  
  const handleAddFriend = async (user:User) => {
   const res= await addFriend( user.id);
   console.log(res)
   setProfile({...profile,friends:res})
  };
  
  useEffect(() => {
   filterNonFriends()
   .then((users:any)=>setFilteredUsers(users))
  }, [friends,allUsers])
  
  
  if (loadingUsers ) return <LoadingUsers />;
  if (errorUsers ) return <ErrorMessage message="Failed to get users" />;

  async function filterNonFriends() {
    const friendIds = new Set(friends?.map((friend: any) => friend.id));
    return allUsers?.users?.filter(
      (user: any) => user.id !== id && !friendIds.has(user.id)
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
