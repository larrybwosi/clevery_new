import { useEffect, useState } from 'react';
import { CallContent, CallType, MemberRequest, StreamCall, StreamVideo, StreamVideoClient, User, VideoRendererProps, useAutoEnterPiPEffect } from '@stream-io/video-react-native-sdk';
import { requestAndUpdatePermissions } from '@/lib/utils';
import { RTCView } from '@stream-io/react-native-webrtc';
import { Text, View } from './Themed';
import { useProfileStore } from '@/lib';

import  uuid from 'react-native-uuid';
import { LocalVideoRenderer } from './calls/local-video';


interface AudioVideo {
  channelName:string;
  callType:string;
  video?:boolean;
  members?:MemberRequest[]
}

export default function AudioVideoComponent({
  channelName,
  callType,
  members,
  video
}:AudioVideo) {
  const [client, setClient] = useState<StreamVideoClient>();
  
useAutoEnterPiPEffect();

const { profile } = useProfileStore();

const user: User = { id: profile._id };
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!

const fetchAndSetProfile = async () => {
  try {
    const myClient = new StreamVideoClient({ apiKey, user, token: profile.streamToken! });
    setClient(myClient);

  } catch (error) {
    console.error(error);
  }
};

const call = client?.call(callType, uuid.v4() as string);

  useEffect(() => {
    requestAndUpdatePermissions()
    fetchAndSetProfile();
    
    return () => {
      client?.disconnectUser();
      call?.endCall()
      setClient(undefined);
    };
  }, []);

  
  useEffect(() => {
    const getOrCreateCall = async () => {
      try {
        await call?.getOrCreate();
      } catch (error) {
        console.error('Failed to get or create call', error);
      }
    };

    getOrCreateCall();
  }, [call]);

  if(!client || !call) return

  const CustomCallTopView = () => { 
    return (
      <View className='w-full'>
        <Text className='py-5 text-center font-rbold'>{channelName}</Text>
      </View>
    );
  };

const CustomVideoRenderer = ({ participant }: VideoRendererProps) => {
  const { videoStream } = participant;
  console.log(videoStream)
  return (
    <View className="absolute inset-0 flex items-center justify-center bg-gray-800">
      <RTCView
        streamURL={videoStream?.id}/>
    </View>
  );
};
  return (
    <StreamVideo client={client!}>
      <StreamCall call={call}>
          <CallContent VideoRenderer={(v)=><CustomVideoRenderer participant={v.participant}/>} CallTopView={CustomCallTopView}/>
      </StreamCall>
    </StreamVideo>
  );
};
