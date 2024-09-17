import { memo, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { showToastMessage,useCreateServer, useUsers, useProfileStore } from '@/lib';
import { Create, InviteFriends, Loader, } from '@/components';
import { CreateServerData as CreateServerType, User } from '@/types';
import { router } from 'expo-router';


const CreateServer = () => {
  const { profile } = useProfileStore();
  const [serverDetails, setServerDetails] = useState<CreateServerType>({
    name: ``,
    description: '',
    image: '',
    members: [],
  });

  const { 
    mutateAsync: createServer,
    isPending:creatingServer ,
    error 
  } = useCreateServer();

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleSubmit = async () => {
    const members= selectedUsers?.map(user => user.id)
    serverDetails.members=members
      if(!serverDetails.image) return showToastMessage('Please select an icon')
      if(!serverDetails.name) return showToastMessage('Please provide the server name')
      if(!serverDetails.description) return showToastMessage('Please provide the server description')
      if(members.length<2) return showToastMessage('Please select atleast two users')

    try {
      console.log(serverDetails)
      const server = await createServer(serverDetails);

      setServerDetails({
        name: '',
        description: '',
        image: '',
        members:[],
      });
      console.log(server)
      router.push(`/servers/${server.id}`)
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
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };
if(creatingServer)return <Loader loadingText='Creating your server'/>
   return (
    <ScrollView className='mt-7 flex-1 pb-2' >
      
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
         users={profile?.friends}
        />
      </Modal>
      
    </ScrollView>
  );
};


export default memo(CreateServer)