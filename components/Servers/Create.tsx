import { KeyboardAvoidingView,SectionList } from 'react-native';
import { selectImage, urlForImage } from '@/lib'
import { Text, View } from '@/components/Themed';
import UploadImage from './upload-image';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import FormField from '@/components/auth/FormField';
import { User } from '@/types';

interface ServerDetails {
    name: string;
    description: string;
    icon: string;
    members: string[];
  }

  interface CreateProps{
    handleSubmit:()=>void,
    selectedUsers?:User[],
    serverDetails:ServerDetails;
    setServerDetails:any;
    setSelectedUsers?:any,
    setPopupVisible?:any,
    type:'server'|'channel'
    loading:boolean
  }

const Create = ({
  serverDetails,
  setServerDetails,
  handleSubmit,
  selectedUsers,
  setPopupVisible,
  type,
  loading
}:CreateProps) => {

    const chooseImage=async()=>{
      const image = await selectImage()
      if(image){
        setServerDetails({ ...serverDetails, icon:image[0]})
      }
    }
    
  return (
    <KeyboardAvoidingView behavior='position' className='pb-3 pt-3' >
      <Text className='font-rbold mb-5 text-2xl'>Create Your {type==='server'? 'Server':'Channel'}</Text>
      <Text className='font-xs mb-5 font-rmedium' >This is where you hang out with your friends.Create and start talking</Text>

      {type==='server' &&
        <UploadImage
          image={serverDetails.icon}
          chooseImage={chooseImage}
          removeImage={()=>setServerDetails({ ...serverDetails, image:''})}
        />
      }
      <View className='mb-2.5'>
        <FormField 
          title={`${type==='server'? 'Server':'Channel'}`}
          value={serverDetails.name}
          handleChangeText={(text) =>
            setServerDetails({ ...serverDetails, name: text })
          }
        />
      </View>
      <View className='mb-2.5'>
         <FormField 
          title={`Description`}
          value={serverDetails.description}
          handleChangeText={(text) =>
            setServerDetails({ ...serverDetails, description: text })
          }
        />
      </View>
      <View className='mb-2.5'>
      </View>
      {type === "server" &&
        <View className='mb-2.5'>
        <Text className='text-sm font-rmedium mb-1.5'>Members:</Text>
        <View className='flex-row flex-wrap' >
          {selectedUsers?.map((user) => (
            <TouchableOpacity
              key={user._id}
              className='w-12 h-10  items-center justify-center mr-2 '
            >
              <Image source={{ uri: urlForImage(user.image).width(100).url() }} className='w-full h-full rounded-[16px]' />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            className='w-12 h-12  flex items-center justify-center mr-2 mb-2' 
            onPress={() => setPopupVisible(true)}
          >
            <Feather name='user-plus' size={24} color={"gray"} className='bg-gray-400 rounded-lg p-2' />
          </TouchableOpacity>
        </View>
      </View>
      }
      <TouchableOpacity className='w-25 h-9 bg-blue-500 justify-center px-2 rounded-lg mb-3'  onPress={handleSubmit} disabled={loading} >
        <Text className='text-white text-xs pb-1 font-rregular w-auto' >Create {type==='server'? 'Server':'Channel'}</Text>
      </TouchableOpacity>
      <SectionList sections={[
      
      ]}/>
    </KeyboardAvoidingView>
  )
}

export default memo(Create)