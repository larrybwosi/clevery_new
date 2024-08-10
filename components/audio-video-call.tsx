import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { 
  Call,
  CallContent, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  User,
  ParticipantView,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import { AntDesign } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { BlurView } from 'expo-blur';

import { requestAndUpdatePermissions } from '@/lib/utils';
import { endpoint, useProfileStore } from '@/lib';
import { Text, View } from './Themed';

interface AudioVideoProps {
  channelName: string;
  callType: string;
  video?: boolean;
}

export default function AudioVideoComponent({
  channelName,
  callType,
  video = true
}: AudioVideoProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { profile } = useProfileStore();
  const user: User = { id: profile.id };
  const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;
  
  const initializeClient = useCallback(async () => {
    try {
      setIsLoading(true);
      await requestAndUpdatePermissions();
      const tokenProvider = async () => {
        const token = await fetch(`${endpoint}/stream/token`);
        const data = await token.json();
        return data;
      };
      const myClient = new StreamVideoClient({ apiKey, user, tokenProvider });
      setClient(myClient);
      const newCall = myClient.call(callType, uuid.v4() as string);
      const call = await newCall.getOrCreate({ 
        data: { members: [{ user_id: profile.id }] }
      });
      setCall(newCall);
    } catch (err) {
      console.error('Error initializing client:', err);
      setError('Failed to initialize video call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [profile, callType]);

  useEffect(() => {
    initializeClient();

    return () => {
      if (client) {
        client.disconnectUser();
        if (call) call.leave();
        setClient(null);
        setCall(null);
      }
    };
  }, []);

  const CustomCallTopView = () => (
    <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center p-4 bg-black bg-opacity-50 z-10">
      <Text className="text-white font-semibold text-lg">{channelName}</Text>
    </View>
  );

  const CallUI = () => {
    const { useParticipants, useLocalParticipant } = useCallStateHooks();
    const participants = useParticipants();
    const localParticipant = useLocalParticipant();

    return (
      <View className="flex-1">
        {participants.length > 0 ? (
          <View className="flex-1">
            <ParticipantView
              participant={participants[0]}
              style={{flex:1}}
            />
            <View className="absolute bottom-4 right-4 w-1/3 aspect-[3/4] rounded-lg overflow-hidden">
              <BlurView intensity={80} tint="dark" className="absolute inset-0" />
              <ParticipantView
                participant={localParticipant!}
                style={{flex:1}}
              />
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-800">
            <Text className="text-white text-lg">Waiting for participants...</Text>
          </View>
        )}
        <CustomCallTopView />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-white mt-4">Initializing call...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <StatusBar barStyle="light-content" />
        <AntDesign name="warning" size={48} color="#FFC107" />
        <Text className="text-white mt-4 text-center px-6">{error}</Text>
        <TouchableOpacity
          onPress={initializeClient}
          className="mt-6 bg-blue-500 py-3 px-6 rounded-full"
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!client || !call) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent VideoRenderer={CallUI} />
        </StreamCall>
      </StreamVideo>
    </SafeAreaView>
  );
}