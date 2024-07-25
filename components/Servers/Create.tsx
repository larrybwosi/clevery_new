import { KeyboardAvoidingView,SectionList, StyleSheet } from 'react-native';
import { selectImage, urlForImage } from '@/lib'
import { Text, View } from '@/components/Themed';
import UploadImage from './upload-image';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FormField from '@/components/auth/FormField';

import { Avatar, Button, CheckIcon, Divider, HStack, Select, VStack } from "native-base"
import { User } from '@/validations';
import { LinearGradient } from 'expo-linear-gradient';

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
  }: CreateProps) => {
  
    const chooseImage = async () => {
      const image = await selectImage();
      if (image) {
        setFields({ ...fields, icon: image[0] });
      }
    };
  
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <VStack space={4} alignItems="center">
            <Text style={styles.title}>Create Your {type === 'server' ? 'Server' : 'Channel'}</Text>
            <Text style={styles.subtitle}>This is where you hang out with your friends. Create and start talking!</Text>
  
            {type === 'server' && (
              <UploadImage
                image={fields.icon!}
                chooseImage={chooseImage}
                removeImage={() => setFields({ ...fields, image: '' })}
              />
            )}
  
            <FormField
              title={`${type === 'server' ? 'Server' : 'Channel'} Name`}
              value={fields.name}
              handleChangeText={(text) => setFields({ ...fields, name: text })}
              otherStyles={styles.input}
            />
  
            <FormField
              title="Description"
              value={fields.description}
              handleChangeText={(text) => setFields({ ...fields, description: text })}
              style={styles.input}
              multiline
              numberOfLines={3}
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
              size="lg"
              w="100%"
            >
              Create {type === 'server' ? 'Server' : 'Channel'}
            </Button>
          </VStack>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  };
  
  const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
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