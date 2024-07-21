import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { 
  CallContent, 
  MemberRequest, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  User, 
  VideoRendererProps, 
  useAutoEnterPiPEffect 
} from '@stream-io/video-react-native-sdk';
import { RTCView } from '@stream-io/react-native-webrtc';
import { Text, View } from './Themed';
import { useProfileStore } from '@/lib';
import { requestAndUpdatePermissions } from '@/lib/utils';
import uuid from 'react-native-uuid';
import { LocalVideoRenderer } from './calls/local-video';
import { Avatar, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

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
  const [call, setCall] = useState<StreamCall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAutoEnterPiPEffect();

  const { profile } = useProfileStore();
  const user: User = { id: profile._id };
  const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;
  
  const initializeClient = useCallback(async () => {
    try {
      setIsLoading(true);
      await requestAndUpdatePermissions();
      const myClient = new StreamVideoClient({ apiKey, user, token: profile.streamToken! });
      setClient(myClient);
      const newCall = myClient.call(callType, "default_421f166e1dee-4357-9762-14de54260b09");
      await newCall.getOrCreate();
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
  }, [initializeClient]);

  const CustomCallTopView = () => (
    <SafeAreaView style={styles.topView}>
      <View style={styles.topBar}>
        <Icon as={MaterialIcons} name="arrow-back" size="md" color="white" />
        <Text style={styles.channelName}>{channelName}</Text>
        <Avatar.Group max={3} size="sm">
          {members?.map((member, index) => (
            <Avatar 
              key={index} 
              source={{ uri: member.avatar }}
              borderColor="white"
              borderWidth={2}
            >
              {member.name[0]}
            </Avatar>
          ))}
        </Avatar.Group>
      </View>
    </SafeAreaView>
  );

  const CustomVideoRenderer = ({ participant }: VideoRendererProps) => {
    const { videoStream } = participant;
    return (
      <View style={styles.videoContainer}>
        {videoStream ? (
          <RTCView style={styles.rtcView} streamURL={videoStream.id} />
        ) : (
          <View style={styles.noVideoFallback}>
            <Avatar size="xl" source={{ uri: participant.image }}>
              {participant.name?.[0]}
            </Avatar>
            <Text style={styles.participantName}>{participant.name}</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Initializing call...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!client || !call) return null;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallContent 
          VideoRenderer={(v) => <CustomVideoRenderer participant={v.participant} />}
          CallTopView={CustomCallTopView}
        />
      </StreamCall>
    </StreamVideo>
  );
}

const styles = StyleSheet.create({
  topView: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  channelName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  rtcView: {
    flex: 1,
  },
  noVideoFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
  },
  participantName: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});