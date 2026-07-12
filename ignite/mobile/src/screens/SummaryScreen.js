import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { colors } from '../theme/tokens';

const formatClock = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const clockLabel = (totalSeconds) =>
  `${Math.floor(totalSeconds / 60)} minutes ${totalSeconds % 60} seconds total time`;

const paceLabel = (pace) =>
  pace && !pace.includes('--')
    ? `Average pace ${pace.replace('/km', 'per kilometer')}`
    : 'Pace not available';

// Pulsing grey placeholder shown while data loads — never a blank void.
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

function MetricCard({ label, value, accessibilityLabel, accent = false }) {
  return (
    <View
      className="flex-1 items-center rounded-xl border border-edge bg-surface p-4"
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <Text className="text-xs font-semibold tracking-widest text-content-secondary">
        {label}
      </Text>
      <Text
        className={`mt-2 text-2xl font-bold ${accent ? 'text-competition' : 'text-content'}`}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
    </View>
  );
}

export default function SummaryScreen({ route, navigation }) {
  const { sessionId, duration = 0, distance = 0, pace = '--:-- /km' } = route?.params ?? {};
  const { user } = useAuth();

  // null = still loading (show skeleton); [] = loaded
  const [participants, setParticipants] = useState(null);
  const [resultsFailed, setResultsFailed] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setParticipants([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axiosInstance.get(`/sessions/${sessionId}/`);
        if (!cancelled) setParticipants(data?.participants_data ?? []);
      } catch {
        // Don't block the screen — personal stats from route.params still show.
        if (!cancelled) {
          setParticipants([]);
          setResultsFailed(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // The API doesn't sync per-runner GPS distance yet, so my own row uses the
  // locally tracked number from route.params (same substitution as RunScreen).
  const runnerDistance = (item) =>
    item.id === user?.id ? distance : Number(item.distance_km ?? item.distance ?? 0);

  const isLoadingResults = participants === null;
  const isGroupRun = (participants?.length ?? 0) > 1;
  // Winner = most distance. No badge on solo runs, and none while every
  // distance is 0 — a tie at zero means "no data", not "everyone won".
  const topDistance = isGroupRun ? Math.max(...participants.map(runnerDistance)) : 0;
  const isWinner = (item) => isGroupRun && topDistance > 0 && runnerDistance(item) === topDistance;

  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 px-4">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 24 }}>
          {/* Celebration header — red stays reserved for the one hero stat */}
          <Text className="text-3xl font-bold text-content" accessibilityRole="header">
            Run Complete
          </Text>
          <Text className="mt-2 text-content-secondary">Nice work — here’s how it went.</Text>

          {/* Hero metrics — the three headline numbers, glanceable first */}
          <View className="mt-6 flex-row gap-2">
            <MetricCard
              label="TIME"
              value={formatClock(duration)}
              accessibilityLabel={clockLabel(duration)}
              accent
            />
            <MetricCard
              label="DISTANCE"
              value={`${Number(distance).toFixed(2)} km`}
              accessibilityLabel={`${Number(distance).toFixed(2)} kilometers total distance`}
            />
            <MetricCard
              label="PACE"
              value={pace}
              accessibilityLabel={paceLabel(pace)}
            />
          </View>

          {/* Detail defers below the fold — final standings per runner */}
          <Text className="mt-8 text-xs font-semibold tracking-widest text-content-secondary">
            RESULTS
          </Text>

          {isLoadingResults ? (
            <View className="mt-4">
              <SkeletonBlock style={{ height: 56, width: '100%' }} />
              <SkeletonBlock style={{ marginTop: 8, height: 56, width: '100%' }} />
            </View>
          ) : resultsFailed ? (
            <View className="mt-4 rounded-xl bg-elevated px-4 py-3">
              <Text className="text-content-secondary">
                Couldn’t load full results — your run stats above are safe.
              </Text>
            </View>
          ) : (
            <View className="mt-4">
              {participants.map((item) => (
                <View
                  key={String(item.id)}
                  className="mb-2 h-14 flex-row items-center rounded-xl border border-edge bg-surface px-4"
                  accessible
                  accessibilityLabel={`${item.username} ran ${runnerDistance(item).toFixed(2)} kilometers${
                    isWinner(item) ? ', winner' : ''
                  }`}
                >
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-elevated">
                    <Text className="font-semibold text-content">
                      {item.username?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text className="ml-4 flex-1 text-lg text-content">
                    {item.id === user?.id ? `${item.username} (you)` : item.username}
                  </Text>
                  {isWinner(item) && (
                    <Text className="mr-3 text-xs font-bold tracking-widest text-competition">
                      WINNER
                    </Text>
                  )}
                  <Text
                    className="text-lg font-semibold text-content"
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {runnerDistance(item).toFixed(2)} km
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Actions — pinned in the thumb zone, 56px targets */}
        <Pressable
          className="mt-4 h-14 w-full items-center justify-center rounded-xl bg-competition active:bg-competition-dim"
          onPress={goHome}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Text className="text-lg font-semibold text-content">Back to Home</Text>
        </Pressable>
        <Pressable
          className="mb-6 mt-2 h-14 w-full items-center justify-center rounded-xl border border-edge bg-surface active:bg-elevated"
          onPress={goHome}
          accessibilityRole="button"
          accessibilityLabel="Run again"
        >
          <Text className="text-lg font-semibold text-content">Run Again</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
