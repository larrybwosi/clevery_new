import React from 'react';
import { View, ImageBackground, Text } from 'react-native';
import { useCall, VideoRenderer, VideoRendererProps } from '@stream-io/video-react-native-sdk';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomVideoRenderer: React.FC<VideoRendererProps> = ({ participant }) => {
  const isMuted = !participant.isSpeaking;
  const isVideoEnabled = participant.videoStream !== null;

  return (
    <View className="flex-1 rounded-2xl overflow-hidden">
      <ImageBackground
        source={{ uri: participant.image }}
        className="flex-1 justify-end"
        resizeMode="cover"
      >
        <BlurView intensity={80} tint="dark" className="absolute inset-0" />
        
        {isVideoEnabled ? (
          <VideoRenderer
            participant={participant}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 ,flex:1}}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <MaterialCommunityIcons name="video-off" size={48} color="white" />
          </View>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          className="absolute bottom-0 left-0 right-0 h-24 justify-end"
        >
          <View className="flex-row items-center justify-between px-4 pb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-white overflow-hidden mr-3">
                <ImageBackground
                  source={{ uri: participant.image }}
                  className="flex-1"
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">
                  {participant.name || participant.userId}
                </Text>
                <Text className="text-gray-300 text-sm">
                  {isVideoEnabled ? 'Video On' : 'Video Off'}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              {isMuted && (
                <View className="bg-red-500 rounded-full p-2 mr-2">
                  <MaterialCommunityIcons name="microphone-off" size={20} color="white" />
                </View>
              )}
              <View className={`w-3 h-3 rounded-full ${participant.isSpeaking ? 'bg-green-500' : 'bg-gray-500'}`} />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default CustomVideoRenderer;