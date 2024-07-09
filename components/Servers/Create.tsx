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

import { CheckIcon, Select } from "native-base"

interface fields {
    name: string;
    description: string;
    icon?: string;
    members?: string[];
    channelType?:string
  }

  interface CreateProps{
    handleSubmit:()=>void,
    selectedUsers?:User[],
    fields:fields;
    setFields:any;
    setSelectedUsers?:any,
    setPopupVisible?:any,
    type:'server'|'channel'
    loading:boolean
  }

const Create = ({
  fields,
  setFields,
  handleSubmit,
  selectedUsers,
  setPopupVisible,
  type,
  loading
}:CreateProps) => {

    const chooseImage=async()=>{
      const image = await selectImage()
      if(image){
        setFields({ ...fields, icon:image[0]})
      }
    }
    
  return (
    <KeyboardAvoidingView behavior='position' className='pb-3 pt-3' >
      <Text className='font-rbold mb-5 text-2xl'>Create Your {type==='server'? 'Server':'Channel'}</Text>
      <Text className='font-xs mb-5 font-rmedium' >This is where you hang out with your friends.Create and start talking</Text>

      {type==='server' &&
        <UploadImage
          image={fields.icon!}
          chooseImage={chooseImage}
          removeImage={()=>setFields({ ...fields, image:''})}
        />
      }
      <View className='mb-2.5'>
        <FormField 
          title={`${type==='server'? 'Server':'Channel'}`}
          value={fields.name}
          handleChangeText={(text) =>
            setFields({ ...fields, name: text })
          }
        />
      </View>
      <View className='mb-2.5'>
         <FormField 
          title={`Description`}
          value={fields.description}
          handleChangeText={(text) =>
            setFields({ ...fields, description: text })
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

    {type === "server" &&
      <Select
        placeholder='Channel Type'
        accessibilityLabel='Channel Type'
        _selectedItem={{bg:"teal.600"}}
        defaultValue='TEXT'
        onValueChange={(v)=>setFields({ ...fields, channelType:v })}
        mt="1"
        mb="2"
        w="1/2"
        borderColor={"gray.400"}
        selectedValue={fields.channelType} 
      >
        <Select.Item label='Text' value='TEXT' endIcon={<Feather name='hash' className='ml-5'/>} />
        <Select.Item label='Voice' value='AUDIO' endIcon={<Feather name='mic'/>}/>
        <Select.Item label='Video' value='VIDEO' endIcon={<Feather name='video'/>}/>
      </Select>
    }
      <TouchableOpacity className='w-25 h-9 bg-blue-500 justify-center px-2 rounded-lg mb-3'  onPress={handleSubmit} disabled={loading} >
        <Text className='text-white text-xs pb-1 font-rregular w-auto' >Create {type==='server'? 'Server':'Channel'}</Text>
      </TouchableOpacity>
      
    </KeyboardAvoidingView>
  )
}

export default memo(Create)