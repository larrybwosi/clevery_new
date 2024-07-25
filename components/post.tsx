import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const PostComponent = ({ post }) => {
  const [likeScale] = useState(new Animated.Value(1));
  const [commentScale] = useState(new Animated.Value(1));
  const [saveScale] = useState(new Animated.Value(1));

  const animateButton = (animation) => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f6f6f6', '#ffffff']}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
        <Text style={styles.content}>{post.content}</Text>
        <View style={styles.imageContainer}>
          {post.images && post.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => animateButton(likeScale)} style={styles.button}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Ionicons name="heart-outline" size={28} color="#ff4757" />
            </Animated.View>
            <Text style={styles.buttonText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => animateButton(commentScale)} style={styles.button}>
            <Animated.View style={{ transform: [{ scale: commentScale }] }}>
              <Ionicons name="chatbubble-outline" size={28} color="#54a0ff" />
            </Animated.View>
            <Text style={styles.buttonText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => animateButton(saveScale)} style={styles.button}>
            <Animated.View style={{ transform: [{ scale: saveScale }] }}>
              <Ionicons name="bookmark-outline" size={28} color="#5f27cd" />
            </Animated.View>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientBackground: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  timestamp: {
    fontSize: 14,
    color: '#636e72',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2d3436',
    marginBottom: 15,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  image: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#dfe6e9',
    paddingTop: 15,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 5,
    fontSize: 12,
    color: '#636e72',
  },
});

export default PostComponent;