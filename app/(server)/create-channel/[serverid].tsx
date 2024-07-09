import { memo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { selector,showToastMessage, useCreateChannel } from '@/lib';
import { Loader,View,Create } from '@/components';
import ToastAlert from '@/components/toast-alert';

interface newChannel {
  name: string;
  description: string;
  channelType: string;
}

const CreateChannel: React.FC = () => {
  const profile = selector((state) => state.profile.profile);
  const [newChannel, setNewChannel] = useState<newChannel>({
    name: `${profile.name}'s channel`,
    description: '',
    channelType: 'TEXT',
  });
  const {serverid} = useLocalSearchParams()
  const { 
    mutateAsync: createChannel,
    isPending:creatingServer ,
    error 
  } = useCreateChannel();

  const handleSubmit = async () => {
    const {channelType:type,description,name} =newChannel
    
    try {
      if(!name) return showToastMessage('Please provide the channel name' )
      if(!description) return showToastMessage('Please provide the channel description' )
      if(serverid === '' ) return showToastMessage('No server id provided' );

      const res = await createChannel({
        serverId:serverid as string,
        name,
        description,
        type
      });
      console.log(res)
    } catch (error:any) {
      console.log(error.message)
      showToastMessage('Error creating server:' );
      return <ToastAlert id='channel' title='Failed to create channel' description={error.message}/>
    }
  };
  
if(creatingServer)return <Loader loadingText='Creating your channel'/>

  return (
    <View className='p-5 flex-1 '>
      <Create
        fields={newChannel}
        setFields={setNewChannel}
        handleSubmit={handleSubmit}
        loading={creatingServer}
        type='channel'
      /> 
    </View>
  );
};


export default memo(CreateChannel)