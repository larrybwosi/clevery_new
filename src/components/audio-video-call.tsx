import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  useCall,
  useCallStateHooks,
  ParticipantView,
  Call,
} from '@stream-io/video-react-native-sdk';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useProfileStore } from '@/lib';
import { StreamConfig } from '@/lib/env';

export interface AudioVideoComponentProps {
  /** Unique call ID — use conversationId for DMs, channel.id for server channels */
  channelName: string;
  /** 'default' = video/audio call | 'audio_room' = server audio room */
  callType?: 'default' | 'audio_room';
  /** Whether to enable the camera */
  video?: boolean;
  /** Called after the user leaves the call */
  onCallEnd?: () => void;
}

// ─── Controls Bar ────────────────────────────────────────────────────────────

interface ControlsProps {
  video: boolean;
  onCallEnd?: () => void;
}

const Controls: React.FC<ControlsProps> = ({ video, onCallEnd }) => {
  const call = useCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { isMute: micMuted } = useMicrophoneState();
  const { isMute: camMuted } = useCameraState();

  const toggleMic = useCallback(() => call?.microphone.toggle(), [call]);
  const toggleCam = useCallback(() => call?.camera.toggle(), [call]);
  const flipCam = useCallback(() => call?.camera.flip(), [call]);

  const endCall = useCallback(async () => {
    await call?.leave();
    onCallEnd?.();
    router.back();
  }, [call, onCallEnd]);

  return (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.9)']}
      style={styles.controls}
    >
      <View style={styles.controlsRow}>
        {/* Microphone */}
        <TouchableOpacity
          onPress={toggleMic}
          style={[styles.btn, micMuted && styles.btnRed]}
          accessibilityLabel={micMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          <Feather name={micMuted ? 'mic-off' : 'mic'} size={22} color="#fff" />
        </TouchableOpacity>

        {/* Camera (video mode only) */}
        {video && (
          <TouchableOpacity
            onPress={toggleCam}
            style={[styles.btn, camMuted && styles.btnRed]}
            accessibilityLabel={camMuted ? 'Enable camera' : 'Disable camera'}
          >
            <Feather name={camMuted ? 'video-off' : 'video'} size={22} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Flip camera (video mode only) */}
        {video && (
          <TouchableOpacity
            onPress={flipCam}
            style={styles.btn}
            accessibilityLabel="Flip camera"
          >
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {/* End call */}
        <TouchableOpacity
          onPress={endCall}
          style={[styles.btn, styles.btnEndCall]}
          accessibilityLabel="End call"
        >
          <MaterialIcons name="call-end" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// ─── Duration counter ────────────────────────────────────────────────────────

const useCallDuration = () => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

// ─── Audio-only layout ───────────────────────────────────────────────────────

const AudioLayout: React.FC<{ onCallEnd?: () => void }> = ({ onCallEnd }) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const duration = useCallDuration();

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.fill}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.durationBig}>{duration}</Text>

      <View style={styles.audioGrid}>
        {participants.map((p) => (
          <View key={p.sessionId} style={styles.audioParticipant}>
            {p.image ? (
              <Image
                source={p.image}
                style={styles.audioAvatar}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.audioAvatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>
                  {p.name?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
            )}
            {/* Speaking indicator ring */}
            {p.isSpeaking && <View style={styles.speakingRing} />}
            <Text style={styles.audioName} numberOfLines={1}>
              {p.name ?? 'Unknown'}
            </Text>
          </View>
        ))}
      </View>

      <Controls video={false} onCallEnd={onCallEnd} />
    </LinearGradient>
  );
};

// ─── Video layout ─────────────────────────────────────────────────────────────

const VideoLayout: React.FC<{ onCallEnd?: () => void }> = ({ onCallEnd }) => {
  const { useParticipants, useLocalParticipant, useCameraState } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const { isMute: camMuted } = useCameraState();
  const duration = useCallDuration();

  const remotes = participants.filter((p) => !p.isLocalParticipant);

  return (
    <View style={styles.fill}>
      <StatusBar barStyle="light-content" />

      {/* Remote stream — full screen */}
      {remotes.length > 0 ? (
        <ParticipantView participant={remotes[0]} style={styles.fill} />
      ) : (
        <View style={styles.waitingBg}>
          <Ionicons name="person-circle-outline" size={100} color="#4B5563" />
          <Text style={styles.waitingText}>Waiting for others to join…</Text>
        </View>
      )}

      {/* Duration badge */}
      <View style={styles.durationBadge}>
        <Text style={styles.durationSmall}>{duration}</Text>
      </View>

      {/* Local PiP */}
      {localParticipant && (
        <View style={styles.pip}>
          {!camMuted ? (
            <ParticipantView participant={localParticipant} style={styles.fill} />
          ) : (
            <View style={[styles.fill, styles.pipOff]}>
              <Ionicons name="person-circle" size={40} color="#6B7280" />
            </View>
          )}
        </View>
      )}

      <Controls video onCallEnd={onCallEnd} />
    </View>
  );
};

// ─── Inner call UI (must be inside <StreamCall>) ──────────────────────────────

const CallUI: React.FC<{ video: boolean; onCallEnd?: () => void }> = ({
  video,
  onCallEnd,
}) => (video ? <VideoLayout onCallEnd={onCallEnd} /> : <AudioLayout onCallEnd={onCallEnd} />);

// ─── Main exported component ──────────────────────────────────────────────────

const AudioVideoComponent: React.FC<AudioVideoComponentProps> = ({
  channelName,
  callType = 'default',
  video = false,
  onCallEnd,
}) => {
  const { profile } = useProfileStore();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isJoining, setIsJoining] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let _client: StreamVideoClient | null = null;
    let _call: Call | null = null;

    const join = async () => {
      try {
        if (!profile?.id || !profile?.streamToken) {
          setError('Missing stream credentials. Please sign out and sign in again.');
          setIsJoining(false);
          return;
        }

        _client = new StreamVideoClient({
          apiKey: StreamConfig.apiKey,
          user: {
            id: profile.id,
            name: profile.name,
            image: profile.image ?? undefined,
          },
          token: profile.streamToken,
        });

        _call = _client.call(callType, channelName);
        await _call.join({ create: true });

        // Enable media after join
        if (video) await _call.camera.enable();
        await _call.microphone.enable();

        if (mounted) {
          setClient(_client);
          setCall(_call);
          setIsJoining(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message ?? 'Failed to join call. Please try again.');
          setIsJoining(false);
        }
      }
    };

    join();

    return () => {
      mounted = false;
      // Only leave if the call was successfully joined
      if (_call && client) {
        _call?.leave().catch(() => {});
        _client?.disconnectUser().catch(() => {});
      }
    };
  }, [channelName, callType, video, profile?.id, profile?.streamToken]);

  // ── Loading ──
  if (isJoining) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Joining call…</Text>
      </View>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="warning-outline" size={56} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!client || !call) return null;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI video={video} onCallEnd={onCallEnd} />
      </StreamCall>
    </StreamVideo>
  );
};

export default AudioVideoComponent;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  loadingText: { color: '#9CA3AF', fontSize: 16 },
  errorText: { color: '#EF4444', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  backBtn: {
    marginTop: 8,
    backgroundColor: '#374151',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: { color: '#fff', fontSize: 15 },

  // Controls
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    paddingTop: 48,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  btn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRed: { backgroundColor: '#EF4444' },
  btnEndCall: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
  },

  // Audio layout
  durationBig: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'roboto-medium',
    marginTop: 64,
    textAlign: 'center',
  },
  audioGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    padding: 24,
  },
  audioParticipant: {
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  audioAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarFallback: {
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#fff', fontSize: 30, fontFamily: 'roboto-bold' },
  speakingRing: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 3,
    borderColor: '#22C55E',
  },
  audioName: {
    color: '#D1D5DB',
    fontSize: 13,
    maxWidth: 90,
    textAlign: 'center',
  },

  // Video layout
  waitingBg: {
    flex: 1,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  waitingText: { color: '#9CA3AF', fontSize: 15 },
  durationBadge: {
    position: 'absolute',
    top: 52,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  durationSmall: { color: '#fff', fontSize: 14, fontFamily: 'roboto-medium' },
  pip: {
    position: 'absolute',
    top: 52,
    right: 16,
    width: 110,
    height: 165,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 8,
  },
  pipOff: {
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
});