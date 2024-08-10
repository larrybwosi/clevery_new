import React, { useState, useCallback } from 'react';
import { FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';

import { Text, View } from '../Themed';
import { showToastMessage } from '@/lib';
import { User } from '@/types';


const link = `https://clevery.vercel.app/`;

interface Props {
  onInvitePress: (user: User) => void;
  removeUser: (userId: string) => void;
  onClose: () => void;
  buttonText: string;
  selectedUsers: User[];
  users?: User[];
}



const copyToClipboard = async () => {
  try {
    const alreadyCopied = async () => {
      const clipboardContent = await Clipboard.getStringAsync();
      return clipboardContent===link
  };
    const copied = await alreadyCopied()
    if(copied) showToastMessage('link copied')
    await Clipboard.setStringAsync(link);
    showToastMessage('link copied')
  } catch (error) {
    console.log(error);
  }
};

const icons = [
  { name: 'upload', component: <Feather name="upload" size={24} color="gray" />, label: 'Share' },
  { name: 'link', component: <Feather name="link" size={24} color="gray"/>, label: 'Copy Link', onPress: copyToClipboard },
  { name: 'message-circle', component: <Feather name="message-circle" size={24} color="gray" />, label: 'Messages' },
  { name: 'user-plus', component: <Feather name="user-plus" size={24} color="gray" />, label: 'Email' },
  { name: 'whatsapp', component: <FontAwesome6 name="whatsapp" size={24} color="gray" />, label: 'Whatsapp' },
];

const handlePress = (name: string) => {
  console.log(`Button with name ${name} pressed`);
};

const InviteFriends: React.FC<Props> = ({ 
  users, onInvitePress, buttonText, onClose, selectedUsers, removeUser 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUser = useCallback(({ item }: { item: User }) => (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      style={styles.userItem}
    >
      <Image
        source={{ uri: item.image}}
        style={styles.avatar}
      />
      <Text style={styles.userName}>{item.name}</Text>
      <TouchableOpacity 
        style={styles.inviteButton} 
        onPress={() => onInvitePress(item)}
      >
        <Text style={styles.inviteButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </Animated.View>
  ), [onInvitePress, buttonText]);

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={styles.container}
    >
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Invite Friends</Text>

      {selectedUsers.length > 0 && (
        <FlatList
          horizontal
          data={selectedUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.selectedUser}
              onPress={() => removeUser(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.selectedUserImage} />
              <Feather name="x" size={16} color="white" style={styles.removeIcon} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.selectedUsersContainer}
        />
      )}

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* <View className=' bg-[rgba(255,255,255,0.2)] flex-row items-center justify-between p-1 border-gray-300'>
      {icons.map((icon, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(icon.name)}>
          <View className='ml-4 border border-gray-400 rounded-xl p-1'>
            {icon.component}
          </View>
          <Text className='mt-1 text-xs font-pregular text-gray-400 ml-4'>{icon.label}</Text>
        </TouchableOpacity>
      ))}
    </View> */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.userList}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  selectedUsersContainer: {
    paddingBottom: 10,
  },
  selectedUser: {
    marginRight: 10,
  },
  selectedUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  removeIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 10,
    marginLeft: 10,
  },
  userList: {
    paddingTop: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  inviteButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default InviteFriends;