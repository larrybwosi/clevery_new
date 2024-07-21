import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';

const PopupComponent = () => {
  const data = [
    { icon: 'corner-up-left', text: 'Reply' },
    { icon: 'copy', text: 'Copy Text' },
    { icon: 'map-pin', text: 'Pin Message' },
    { icon: 'link', text: 'Copy Link' },
  ];

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.iconContainer}>
        <Feather name={item.icon} size={20} color="#FFFFFF" />
      </View>
      <Text style={styles.itemText}>{item.text}</Text>
    </TouchableOpacity>
  );

  const renderReaction = (emoji) => (
    <TouchableOpacity key={emoji} style={styles.reactionButton}>
      <Text style={styles.reactionEmoji}>{emoji}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#2C3E50', '#34495E']}
      style={styles.container}
    >
      <View style={styles.reactionsContainer}>
        {reactions.map(renderReaction)}
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.text}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  reactionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 8,
  },
  reactionEmoji: {
    fontSize: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 8,
    marginRight: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default PopupComponent;