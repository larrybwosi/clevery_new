import { useEffect } from 'react';
import { CallType, MemberRequest, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { requestAndUpdatePermissions } from '@/lib/utils';

interface AudioVideo {
  channelid:string;
  callType:string;
  video?:boolean;
  members?:MemberRequest[]
}

export default function AudioVideoComponent({
  channelid,
  callType,
  members,
  video
}:AudioVideo) {
  const client = useStreamVideoClient()
  
const call = client?.call(callType, channelid);

  useEffect(() => {
    requestAndUpdatePermissions()
   const start = async()=>{
    await call?.getOrCreate({
      data: {
        members,
      },
    }); 
   } 
    start()
  }, []);

  if(!client ||!call) return
  return (
    <StreamCall call={call}>

    </StreamCall>
  );
};
