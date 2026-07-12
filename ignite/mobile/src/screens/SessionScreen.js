import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Pressable, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { colors } from '../theme/tokens';

const POLL_INTERVAL_MS = 3000;

// Pulsing grey placeholder shown while API calls are in flight — never a spinner.
function SkeletonBlock({ style }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[{ backgroundColor: colors.elevated, borderRadius: 8, opacity: pulse }, style]}
    />
  );
}

// Maps API/network failures to plain-English messages with a way out.
function describeError(error, mode) {
  const status = error?.response?.status;

  if (mode === 'join' && status === 404) {
    return 'We couldn’t find a session with that invite code. Double-check the code and try again.';
  }
  if (mode === 'join' && status === 400) {
    return 'This session has already started, so new runners can’t join it. Ask the host for a fresh invite.';
  }
  if (!error?.response) {
    return 'We couldn’t reach the server. Check your connection and try again.';
  }
  return 'Something went wrong on our end. Give it another try.';
}

export default function SessionScreen({ route, navigation }) {
  const { mode = 'create', inviteCode } = route?.params ?? {};
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [error, setError] = useState(null); // create/join failure — full-screen state
  const [startError, setStartError] = useState(null); // start failure — inline in lobby
  const [isStarting, setIsStarting] = useState(false);

  // The session creator is always the host; the id comparison covers app
  // restarts where the user re-enters an existing lobby by joining again.
  const isHost = mode === 'create' || session?.host === user?.id;

  const enterSession = useCallback(async () => {
    setError(null);
    setSession(null);
    try {
      const { data } =
        mode === 'create'
          ? await axiosInstance.post('/sessions/create/')
          : await axiosInstance.post('/sessions/join/', { invite_code: inviteCode });
      setSession(data);
    } catch (err) {
      setError(describeError(err, mode));
    }
  }, [mode, inviteCode]);

  useEffect(() => {
    enterSession();
  }, [enterSession]);

  // Once we're in the lobby, poll the detail endpoint so the participant list
  // stays fresh and non-hosts learn when the host starts the run.
  useEffect(() => {
    if (!session?.id || session.status !== 'waiting') return;

    let inFlight = false;
    const poll = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const { data } = await axiosInstance.get(`/sessions/${session.id}/`);
        setSession(data);
      } catch {
        // Transient poll failures are fine — the next tick retries.
      } finally {
        inFlight = false;
      }
    };

    poll();
    const timer = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [session?.id, session?.status]);

  // Both paths converge here: the host's start response and the participants'
  // polling both flip status to "active".
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (session?.status === 'active' && !hasNavigated.current) {
      hasNavigated.current = true;
      navigation.replace('RunScreen', { sessionId: session.id });
    }
  }, [session?.status, session?.id, navigation]);

  const handleStartRun = async () => {
    setIsStarting(true);
    setStartError(null);
    try {
      const { data } = await axiosInstance.post(`/sessions/${session.id}/start/`);
      setSession(data);
    } catch (err) {
      setStartError(describeError(err, 'start'));
      setIsStarting(false);
    }
  };

  // The native share sheet includes "Copy" on both platforms, so the code is
  // copyable without adding a clipboard dependency.
  const handleShareCode = () => {
    Share.share({ message: session.invite_code });
  };

  const participants = session?.participants_data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 px-4 pt-6">
        {/* Header */}
        <View className="h-14 flex-row items-center">
          <Pressable
            className="h-14 w-14 items-start justify-center active:opacity-60"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color={colors.content.DEFAULT} />
          </Pressable>
          <Text className="text-2xl font-bold text-content">
            {mode === 'create' ? 'Your Session' : 'Join Session'}
          </Text>
        </View>

        {error ? (
          /* Error state — plain English plus a remedy */
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-center text-lg text-content">{error}</Text>
            <Pressable
              className="mt-6 h-14 w-full items-center justify-center rounded-xl bg-competition active:bg-competition-dim"
              onPress={enterSession}
            >
              <Text className="text-lg font-semibold text-content">Try Again</Text>
            </Pressable>
            <Pressable
              className="mt-2 h-14 w-full items-center justify-center rounded-xl active:bg-elevated"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-lg font-semibold text-content-secondary">Go Back</Text>
            </Pressable>
          </View>
        ) : !session ? (
          /* Skeleton lobby while create/join is in progress */
          <View className="mt-6">
            <SkeletonBlock style={{ height: 112, width: '100%' }} />
            <SkeletonBlock style={{ marginTop: 24, height: 16, width: 96 }} />
            <SkeletonBlock style={{ marginTop: 16, height: 56, width: '100%' }} />
            <SkeletonBlock style={{ marginTop: 8, height: 56, width: '100%' }} />
          </View>
        ) : (
          /* Lobby */
          <View className="flex-1">
            {mode === 'create' && (
              <Pressable
                className="mt-6 min-h-14 items-center justify-center rounded-xl bg-surface py-4 active:bg-elevated"
                onPress={handleShareCode}
              >
                <Text className="text-xs font-semibold tracking-widest text-content-secondary">
                  INVITE CODE
                </Text>
                <Text className="mt-2 text-4xl font-bold tracking-widest text-content">
                  {session.invite_code}
                </Text>
                <View className="mt-2 flex-row items-center">
                  <Ionicons name="share-outline" size={16} color={colors.content.secondary} />
                  <Text className="ml-2 text-content-secondary">Tap to share or copy</Text>
                </View>
              </Pressable>
            )}

            <Text className="mt-6 text-xs font-semibold tracking-widest text-content-secondary">
              RUNNERS
            </Text>
            <FlatList
              className="mt-4 flex-1"
              data={participants}
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={
                <SkeletonBlock style={{ height: 56, width: '100%' }} />
              }
              renderItem={({ item }) => (
                <View className="mb-2 h-14 flex-row items-center rounded-xl bg-surface px-4">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-elevated">
                    <Text className="font-semibold text-content">
                      {item.username?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text className="ml-4 flex-1 text-lg text-content">
                    {item.id === user?.id ? `${item.username} (you)` : item.username}
                  </Text>
                  {item.id === session.host && (
                    <Text className="text-xs font-semibold tracking-widest text-competition">
                      HOST
                    </Text>
                  )}
                </View>
              )}
            />

            {startError && (
              <Text className="mb-4 text-center text-content-secondary">{startError}</Text>
            )}

            {isHost ? (
              <Pressable
                className={`mb-6 h-14 w-full items-center justify-center rounded-xl ${
                  isStarting ? 'bg-competition-dim' : 'bg-competition active:bg-competition-dim'
                }`}
                onPress={handleStartRun}
                disabled={isStarting}
              >
                <Text className="text-lg font-semibold text-content">
                  {isStarting ? 'Starting…' : 'Start Run'}
                </Text>
              </Pressable>
            ) : (
              <View className="mb-6 h-14 w-full items-center justify-center">
                <Text className="text-lg text-content-secondary">
                  Waiting for host to start…
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
