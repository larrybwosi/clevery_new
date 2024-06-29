import { memo, useEffect, useState } from 'react';

import { selectImage,selector,showToastMessage, useCreateChannel } from '@/lib';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Loader,View,Create } from '@/components';

interface ServerDetails {
  name: string;
  description: string;
  icon: string;
  members: string[];
}

const CreateChannel: React.FC = () => {
  const profile = selector((state) => state.profile.profile);
  const [serverDetails, setServerDetails] = useState<ServerDetails>({
    name: `${profile.name}'s channel`,
    description: '',
    icon: '',
    members: [],
  });
  const {serverid} = useLocalSearchParams()
  const { 
    mutateAsync: createChannel,
    isPending:creatingServer ,
    error 
  } = useCreateChannel();
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      navigation.setOptions({
        tabBarStyle: { display: 'flex' },
      });
    };
  }, []);


  const handleSubmit = async () => {
    try {
      if(!serverDetails.name) return showToastMessage('Please provide the server name')
      if(!serverDetails.description) return showToastMessage('Please provide the server description')
      if(!!serverid?.length) return;

      await createChannel({
          serverId:serverid as string,
          name:'',
          description:'',
          creatorId:profile._id,
          type:''
      });
    } catch (error:any) {
      console.error('Error creating server:', error.message);
      showToastMessage('Error creating server')
    }
  };
  
  const chooseImage=async()=>{
    const image = await selectImage()
    if(image){
      setServerDetails({ ...serverDetails, icon:image[0]})
    }
  } 
  
if(creatingServer)return <Loader loadingText='Creating your server'/>

   return (
    <View className='p-5 flex-1 '>
      <Create
        serverDetails={serverDetails}
        setServerDetails={setServerDetails}
        handleSubmit={handleSubmit}
        loading={creatingServer}
        type='channel'
      /> 
    </View>
  );
};


export default memo(CreateChannel)