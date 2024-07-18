import {
  Avatar,
  StreamVideoParticipant,
  useConnectedUser,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RTCView } from '@stream-io/react-native-webrtc';

export const LocalVideoRenderer = () => {
  const call = useCall();
  const localVideoStream = call?.camera.state.mediaStream;
  const connectedUser = useConnectedUser();
  const { useCameraState } = useCallStateHooks();
  const { status: cameraStatus } = useCameraState();

  const connectedUserAsParticipant = {
    userId: connectedUser?.id,
    image: connectedUser?.image,
    name: connectedUser?.name,
  } as StreamVideoParticipant;

  console.log(call)
  return (
    <View style={styles.videoView}>
      <View style={styles.topView} />
      {cameraStatus === 'enabled' ? (
        <RTCView
          streamURL={localVideoStream?.id}
          objectFit="cover"
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <Avatar participant={connectedUserAsParticipant} />
      )}
      <ParticipantStatus />
    </View>
  );
};

const ParticipantStatus = () => {
  const connectedUser = useConnectedUser();
  const participantLabel = connectedUser?.name ?? connectedUser?.id;
  const { useMicrophoneState } = useCallStateHooks();
  const { status: microphoneStatus } = useMicrophoneState();

  return (
    <View style={styles.status}>
      <Text style={styles.userNameLabel} numberOfLines={1}>
        {participantLabel}
      </Text>
      {microphoneStatus === 'disabled' && (
        <View style={styles.svgContainerStyle}>
          <Text>(Mic off)</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  videoView: {
    backgroundColor: 'gray',
    height: 280,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: 8,
  },
  topView: {},
  status: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#dddddd',
  },
  userNameLabel: {
    flexShrink: 1,
    color: 'white',
  },
  svgContainerStyle: {
    marginLeft: 8,
  },
});