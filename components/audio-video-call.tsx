import { View  } from 'react-native';

interface AudioVideoCallProps {
  isVideo: boolean;
  localMemberId: string;
  remoteMemberId: string;
  onEndCall: () => void;
}

const AudioVideoCall: React.FC<AudioVideoCallProps> = ({
  isVideo,
  localMemberId,
  remoteMemberId,
  onEndCall,
}) => {
  
  return (
    <View className="flex-1 bg-black">

    </View>
  );
};

export default AudioVideoCall;