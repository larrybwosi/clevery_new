import { useState,memo } from 'react';
import {
  Button,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';

import { showToastMessage, useProfileStore, useUpdateCurrentUser } from '@/lib';
import FormField from '@/components/auth/FormField';
import { Text, View } from '@/components/Themed';
import Loader from '@/components/Loader';

const Account = () => {
  
  const { profile:userInfo,setProfile } = useProfileStore();
  console.log(userInfo.email)
  const [editedFields, setEditedFields] = useState({
    username: userInfo.username,
    name: userInfo.name,
    email: userInfo.email,
    phonenumber: userInfo.phone,
  });

  const {
    mutateAsync:updateUser,
    isPending:updatingUser,
    isError:failed
  } = useUpdateCurrentUser()
  const handleFieldChange =
    (field: string, text: string) => {
      setEditedFields((prevFields) => ({ ...prevFields, [field]: text }));
    }

  const handleSavePress = async() => {
    const updated = await updateUser({
      name:editedFields.name,
      username:editedFields.username,
      email:editedFields.email
    })
    setProfile(updated);
    return router.replace("/profile")
  }

  const handleCancelPress = () => {
    setEditedFields({
      username: userInfo.username,
      name: userInfo.name,
      email: userInfo.email,
      phonenumber: userInfo.phone,
    });
    router.back()
  }

  const handlePasswordPress = () => {
    showToastMessage("Comming Soon")
  }

  if(updatingUser) return <Loader loadingText='Updaing Your Account'/>

  return (
    <KeyboardAvoidingView
      className='flex-1'
    >
      <ScrollView
        className='p-5'
        keyboardShouldPersistTaps="handled"
      >
        <Text className='font-rbold text-sm mb-10'>Account Information</Text>
        <View  
          className='flex-row items-center mb-4 justify-between gap-7.5'
        >

        </View>
        <FormField
          title="Username" 
          autoCapitalize={"none"}
          handleChangeText={(text:any) => handleFieldChange('username', text)}
          key="username" 
          placeholder="your username"
          value={editedFields.username}
        />
        <FormField
          title="Name" 
          otherStyles="mt-7"
          placeholder="your name"
          value={editedFields.name}
          handleChangeText={(text:any) => handleFieldChange('name', text)}
          key="name"
        />

          <FormField
            title="Email" 
            value={editedFields.email}
            autoCapitalize={"none"}
            placeholder="email"
            otherStyles="mt-5 mb-5"
            handleChangeText={(text:any) => handleFieldChange('email', text)}
            keyboardType="email-address"
          />

        
        <View className='flex-row justify-between'>
          <Button
            title="Save"
            onPress={handleSavePress}
            disabled={
              editedFields.username === userInfo.username &&
              editedFields.name === userInfo.name &&
              editedFields.email === userInfo.email &&
              editedFields.phonenumber === userInfo.phone
            }
          />
          <Button title="Cancel" onPress={handleCancelPress} />
        </View>
        <View className='flex-row justify-between'>
          <Button title="Change password" onPress={handlePasswordPress} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default memo(Account);