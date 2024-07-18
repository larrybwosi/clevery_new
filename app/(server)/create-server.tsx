import { memo, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { showToastMessage,useCreateServer, useGetUsers, useProfileStore } from '@/lib';
import { Create, InviteFriends, Loader, } from '@/components';
import { NewServer, User } from '@/types';


const CreateServer = () => {
  const { profile } = useProfileStore();
  const [serverDetails, setServerDetails] = useState<NewServer>({
    name: `${profile.name}'s server`,
    description: 'Lets connect',
    icon: '',
    members: [],
  });

  const { 
    mutateAsync: createServer,
    isPending:creatingServer ,
    error 
  } = useCreateServer();
  const { 
    data:users,
    isPending:loading
  } = useGetUsers()
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleSubmit = async () => {
    const members= selectedUsers?.map(user => user._id)
    serverDetails.members=members
      if(!serverDetails.icon) return showToastMessage('Please select an icon')
      if(!serverDetails.name) return showToastMessage('Please provide the server name')
      if(!serverDetails.description) return showToastMessage('Please provide the server description')
      if(members.length<2) return showToastMessage('Please select atleast two users')

    try {
      await createServer(serverDetails );

      setServerDetails({
        name: '',
        description: '',
        icon: '',
        members:[],
      });
    } catch (error:any) {
      console.error('Error creating server:', error.message);
      showToastMessage('Error creating server')
    }
  };
  
  const addMember = (user: User) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  const removeMember = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };
if(creatingServer)return <Loader loadingText='Creating your server'/>
   return (
    <ScrollView className='mt-7 p-3 flex-1 pb-2' >
      
      <Create
        fields={serverDetails}
        setFields={setServerDetails}
        handleSubmit={handleSubmit}
        setPopupVisible={setPopupVisible}
        selectedUsers={selectedUsers}
        loading={creatingServer}
        type='server'
      />
      <Modal visible={isPopupVisible} onTouchCancel={()=>{}} onDismiss={()=>setPopupVisible(false)} animationType="slide">
        
        <InviteFriends
         onInvitePress={addMember} 
         buttonText='add user' 
         onClose={()=>setPopupVisible(false)} 
         selectedUsers={selectedUsers} 
         removeUser={removeMember} 
         users={users}
        />
      </Modal>
    </ScrollView>
  );
};


export default memo(CreateServer)