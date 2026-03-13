import { useLocalSearchParams } from 'expo-router';
import AudioVideoComponent from '@/components/audio-video-call';

const Room = () => {
  const { id, video } = useLocalSearchParams<{ id: string; video: string }>();

  if (!id) return null;

  return (
    <AudioVideoComponent
      channelName={id}
      callType="default"
      video={video === 'true'}
    />
  );
};

export default Room;