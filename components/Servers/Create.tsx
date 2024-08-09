import { StyleSheet } from 'react-native';
import { selectImage, urlForImage } from '@/lib'
import { Text, View } from '@/components/Themed';
import UploadImage from './upload-image';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FormField from '@/components/auth/FormField';

import { Avatar, Button, CheckIcon, Divider, HStack, Select, VStack } from "native-base"
import { CreateServerData, User } from '@/types';

  interface CreateProps{
    handleSubmit:()=>void,
    selectedUsers?:User[],
    fields:CreateServerData;
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
  }: CreateProps) => {
  
    const chooseImage = async () => {
      const image = await selectImage();
      if (image) {
        setFields({ ...fields, icon: image[0] });
      }
    };
  
    return (
      <View className='flex-1' >
        <VStack space={4} alignItems="center">
          <Text className='font-rmedium text-lg'>Create Your {type === 'server' ? 'Server' : 'Channel'}</Text>
          <Text style={styles.subtitle}>This is where you hang out with your friends. Create and start talking!</Text>

          {type === 'server' && (
            <UploadImage
              image={fields.image}
              chooseImage={chooseImage}
              removeImage={() => setFields({ ...fields, image: '' })}
            />
          )}

          <FormField
            title={`${type === 'server' ? 'Server' : 'Channel'} Name`}
            value={fields.name}
            handleChangeText={(text) => setFields({ ...fields, name: text })}
          />

          <FormField
            title="Description"
            value={fields.description}
            handleChangeText={(text) => setFields({ ...fields, description: text })}
          />

          {type === "server" && (
            <VStack space={2} w="100%">
              <Text style={styles.sectionTitle}>Members:</Text>
              <HStack flexWrap="wrap" space={2}>
                {selectedUsers?.map((user) => (
                  <Avatar
                    key={user.id}
                    source={{ uri: urlForImage(user.image).width(100).url() }}
                    size="md"
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                ))}
                <TouchableOpacity
                  style={styles.addMemberButton}
                  onPress={() => setPopupVisible(true)}
                >
                  <Feather name='user-plus' size={24} color="white" />
                </TouchableOpacity>
              </HStack>
            </VStack>
          )}

          {type === "channel" && (
            <Select
              placeholder='Channel Type'
              accessibilityLabel='Channel Type'
              _selectedItem={{ bg: "teal.600" }}
              defaultValue='TEXT'
              onValueChange={(v) => setFields({ ...fields, channelType: v })}
              w="100%"
              borderColor={"gray.400"}
              selectedValue={fields.channelType}
            >
              <Select.Item label='Text' value='TEXT' leftIcon={<Feather name='hash' size={16} />} />
              <Select.Item label='Voice' value='AUDIO' leftIcon={<Feather name='mic' size={16} />} />
              <Select.Item label='Video' value='VIDEO' leftIcon={<Feather name='video' size={16} />} />
            </Select>
          )}

          <Divider my={2} />

          <Button
            onPress={handleSubmit}
            isLoading={loading}
            isLoadingText="Creating..."
            colorScheme="blue"
            className='font-rregular'
            size="lg"
            w="50%"
          >
            Create {type === 'server' ? 'Server' : 'Channel'}
          </Button>
        </VStack>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      color: 'white',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: 'white',
      marginTop: 10,
    },
    addMemberButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
export default Create