import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { 
  Call,
  CallContent, 
  Lobby, 
  MemberRequest, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  User, 
  VideoRendererProps, 
  useAutoEnterPiPEffect
} from '@stream-io/video-react-native-sdk';
import { RTCView } from '@stream-io/react-native-webrtc';
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
  members?: MemberRequest[];
}

export default function AudioVideoComponent({
  channelName,
  callType,
  members,
  video
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
      const tokenProvider =async()=>{ 
        const token = await fetch(`${endpoint}/stream/token`)
        const data = await token.json()
        return data
      }
      const myClient = new StreamVideoClient({ apiKey, user, tokenProvider });
      setClient(myClient);
      const newCall = myClient.call(callType, uuid.v4() as string);
      const call = await newCall.getOrCreate({ 
        data:{ members:[
          { user_id:profile.id},
        ]}
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
        if (call) call.endCall();
        setClient(null);
        setCall(null);
      }
    };
  }, []);

  const CustomCallTopView = () => (
    <View className="absolute top-0 left-0 right-0 flex-row justify-between items-center p-4 bg-black bg-opacity-50">
      <Text className="text-white font-rmedium text-lg">{channelName}</Text>
    </View>
  );
  const CustomVideoRenderer = ({ participant }:VideoRendererProps) => {
    const {videoStream} = participant
    
    return (
      <View style={styles.background}>
        <BlurView intensity={80} tint="dark" className="absolute inset-0" />
          <RTCView
            mirror={true}
            streamURL={videoStream?.toURL()}
            objectFit="cover"
            style={styles.wrapper}
          />
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
          {/* <Lobby/> */}
        <CallContent 
          VideoRenderer={CustomVideoRenderer}
          CallTopView={CustomCallTopView}
        />
        </StreamCall>
      </StreamVideo>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background:{
    ...StyleSheet.absoluteFillObject,
    alignItems:'center',
    justifyContent:'center'
  },
  wrapper: {
    height:250,
    width:250
  },
  });