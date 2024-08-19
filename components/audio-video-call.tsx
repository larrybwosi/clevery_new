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
  // const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  // const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // const [isMuted, setIsMuted] = useState(false);
  // const [isSpeakerOn, setIsSpeakerOn] = useState(isVideo);
  // const [isConnecting, setIsConnecting] = useState(true);
  // const peerConnection = useRef(webrtcService.peerConnection);

  // useEffect(() => {
  //   const setupCall = async () => {
  //     try {
  //       const stream = await webrtcService.setupPeerConnection(isVideo);
  //       setLocalStream(stream);

  //       peerConnection.current?.ontrack = (event) => {
  //         setRemoteStream(event.streams[0]);
  //         setIsConnecting(false);
  //       };

  //       // Handle signaling (offer, answer, ICE candidates) here
  //       // You'll need to implement this part based on your signaling server

  //       InCallManager.start({ media: isVideo ? 'video' : 'audio' });
  //       InCallManager.setForceSpeakerphoneOn(isVideo);
  //     } catch (error) {
  //       console.error('Error setting up call:', error);
  //       setIsConnecting(false);
  //     }
  //   };

  //   setupCall();

  //   return () => {
  //     webrtcService.closeConnection();
  //     InCallManager.stop();
  //   };
  // }, [isVideo]);

  // const toggleMute = () => {
  //   if (localStream) {
  //     localStream.getAudioTracks().forEach((track) => {
  //       track.enabled = !track.enabled;
  //     });
  //     setIsMuted(!isMuted);
  //   }
  // };

  // const toggleSpeaker = () => {
  //   InCallManager.setForceSpeakerphoneOn(!isSpeakerOn);
  //   setIsSpeakerOn(!isSpeakerOn);
  // };

  // const switchCamera = () => {
  //   if (localStream) {
  //     localStream.getVideoTracks().forEach((track) => {
  //       // @ts-ignore: Object is possibly 'null'
  //       track._switchCamera();
  //     });
  //   }
  // };

  return (
    <View className="flex-1 bg-black">
      {/* {isVideo && (
        <>
          {remoteStream ? (
            <RTCView
              streamURL={remoteStream.toURL()}
              className="flex-1"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-white text-xl">Connecting...</Text>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
          {localStream && (
            <RTCView
              streamURL={localStream.toURL()}
              className="absolute top-5 right-5 w-24 h-36 bg-gray-800"
            />
          )}
        </>
      )}

      <View className="absolute bottom-10 left-0 right-0 flex-row justify-center items-center space-x-6">
        <TouchableOpacity onPress={toggleMute} className="p-3 bg-gray-700 rounded-full">
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onEndCall} className="p-4 bg-red-500 rounded-full">
          <Ionicons name="call" size={32} color="white" />
        </TouchableOpacity>

        {isVideo ? (
          <TouchableOpacity onPress={switchCamera} className="p-3 bg-gray-700 rounded-full">
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleSpeaker} className="p-3 bg-gray-700 rounded-full">
            <Ionicons name={isSpeakerOn ? "volume-high" : "volume-medium"} size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View className="absolute top-10 left-5">
        <Text className="text-white text-lg">
          {isConnecting ? 'Connecting...' : `Call with ${remoteMemberId}`}
        </Text>
      </View> */}
    </View>
  );
};

export default AudioVideoCall;