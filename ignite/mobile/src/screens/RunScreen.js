import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, AppState, FlatList, Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { colors } from '../theme/tokens';

const POLL_INTERVAL_MS = 3000;
const COUNTDOWN_START = 3;
// GPS jitter floor — deltas under 2 meters are noise, not movement.
// Same Haversine + noise-filter math as the web RunScreen.jsx.
const NOISE_FLOOR_KM = 0.002;
const END_RUN_ATTEMPTS = 3;
const END_RUN_RETRY_MS = 2000;

// Haversine formula — distance between two GPS coordinates in km.
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const formatClock = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const clockLabel = (totalSeconds) =>
  `${Math.floor(totalSeconds / 60)} minutes ${totalSeconds % 60} seconds elapsed`;

// Average pace so far. Below 10 meters of movement there is no meaningful
// pace yet, so show a placeholder instead of a wild number.
const formatPace = (elapsedSeconds, distanceKm) => {
  if (!distanceKm || distanceKm < 0.01 || elapsedSeconds <= 0) {
    return { text: '--:--', label: 'Pace not available yet' };
  }
  const paceMinPerKm = elapsedSeconds / 60 / distanceKm;
  let mins = Math.floor(paceMinPerKm);
  let secs = Math.round((paceMinPerKm % 1) * 60);
  if (secs === 60) {
    mins += 1;
    secs = 0;
  }
  return {
    text: `${mins}:${String(secs).padStart(2, '0')}`,
    label: `${mins} minutes ${secs} seconds per kilometer`,
  };
};

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

// Red pulsing dot paired with the LIVE RUN text label — never color alone.
function LiveDot() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={{ opacity: pulse }}>
      <View className="h-2.5 w-2.5 rounded-full bg-competition" />
    </Animated.View>
  );
}

export default function RunScreen({ route, navigation }) {
  const { sessionId } = route?.params ?? {};
  const { user } = useAuth();

  // checking → (denied | countdown) → tracking
  const [phase, setPhase] = useState('checking');
  const [count, setCount] = useState(COUNTDOWN_START);
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [syncTrouble, setSyncTrouble] = useState(false);
  const [endTrouble, setEndTrouble] = useState(false);
  const [backgroundNote, setBackgroundNote] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Live tracking values live in refs so GPS callbacks and navigation see
  // current numbers without re-subscribing (same pattern as web RunScreen).
  const startTimeRef = useRef(null);
  const elapsedRef = useRef(0);
  const distanceRef = useRef(0);
  const lastPositionRef = useRef(null);
  const watchSubRef = useRef(null);
  const hasNavigatedRef = useRef(false);
  const wasBackgroundedRef = useRef(false);
  const backgroundNoteShownRef = useRef(false);

  const checkPermission = useCallback(async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        ({ status } = await Location.requestForegroundPermissionsAsync());
      }
      setPhase((prev) =>
        prev === 'checking' || prev === 'denied'
          ? status === 'granted'
            ? 'countdown'
            : 'denied'
          : prev
      );
    } catch {
      setPhase('denied');
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // If the user went to Settings to grant location, re-check on return.
  useEffect(() => {
    if (phase !== 'denied') return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkPermission();
    });
    return () => sub.remove();
  }, [phase, checkPermission]);

  // Countdown: 3… 2… 1… GO — skippable, auto-proceeds, never blocks.
  useEffect(() => {
    if (phase !== 'countdown') return;
    const timer = setTimeout(
      () => (count > 0 ? setCount((c) => c - 1) : setPhase('tracking')),
      count > 0 ? 1000 : 700
    );
    return () => clearTimeout(timer);
  }, [phase, count]);

  const handlePosition = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    const last = lastPositionRef.current;
    if (last) {
      const delta = haversine(last.lat, last.lon, latitude, longitude);
      if (delta > NOISE_FLOOR_KM) {
        distanceRef.current += delta;
        setDistance(distanceRef.current);
      }
    }
    lastPositionRef.current = { lat: latitude, lon: longitude };
  }, []);

  // Timer + GPS watcher. Elapsed derives from a start timestamp, not tick
  // counting, so brief backgrounding never loses time.
  useEffect(() => {
    if (phase !== 'tracking') return;

    if (!startTimeRef.current) startTimeRef.current = Date.now();
    const tick = () => {
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      elapsedRef.current = secs;
      setElapsed(secs);
    };
    tick();
    const timer = setInterval(tick, 1000);

    let cancelled = false;
    (async () => {
      try {
        const sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 2,
          },
          handlePosition
        );
        if (cancelled) {
          sub.remove();
        } else {
          watchSubRef.current = sub;
        }
      } catch {
        setSyncTrouble(true);
      }
    })();

    return () => {
      cancelled = true;
      clearInterval(timer);
      watchSubRef.current?.remove();
      watchSubRef.current = null;
    };
  }, [phase, handlePosition]);

  // Foreground watchers pause while the app is backgrounded (Expo SDK 54
  // limitation without background permissions) — tell the user once, plainly.
  useEffect(() => {
    if (phase !== 'tracking') return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') wasBackgroundedRef.current = true;
      if (state === 'active' && wasBackgroundedRef.current && !backgroundNoteShownRef.current) {
        backgroundNoteShownRef.current = true;
        setBackgroundNote(true);
        setTimeout(() => setBackgroundNote(false), 8000);
      }
    });
    return () => sub.remove();
  }, [phase]);

  const finishToSummary = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    const seconds = elapsedRef.current;
    const km = distanceRef.current;
    navigation.replace('Summary', {
      sessionId,
      duration: seconds,
      distance: Number(km.toFixed(2)),
      pace: `${formatPace(seconds, km).text} /km`,
    });
  }, [navigation, sessionId]);

  // Poll the session so the runner list stays live and we follow the host
  // to the summary if they end the run. Failures show a banner and the next
  // tick retries — local timer/distance are never touched.
  useEffect(() => {
    if (phase !== 'tracking' || !sessionId) return;

    let inFlight = false;
    const poll = async () => {
      if (inFlight || hasNavigatedRef.current) return;
      inFlight = true;
      try {
        const { data } = await axiosInstance.get(`/sessions/${sessionId}/`);
        setParticipants(data?.participants_data ?? []);
        setSyncTrouble(false);
        if (data?.status === 'completed') finishToSummary();
      } catch {
        setSyncTrouble(true);
      } finally {
        inFlight = false;
      }
    };

    poll();
    const timer = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [phase, sessionId, finishToSummary]);

  // End the run: retry the API a few times, but the user always reaches the
  // summary with their locally tracked stats — a bad connection can't trap
  // them on this screen or lose their run.
  const handleEndRun = async () => {
    if (isEnding || hasNavigatedRef.current) return;
    setIsEnding(true);
    for (let attempt = 1; attempt <= END_RUN_ATTEMPTS; attempt += 1) {
      try {
        await axiosInstance.post(`/sessions/${sessionId}/end/`);
        setEndTrouble(false);
        break;
      } catch {
        if (attempt < END_RUN_ATTEMPTS) {
          setEndTrouble(true);
          await new Promise((resolve) => setTimeout(resolve, END_RUN_RETRY_MS));
        }
      }
    }
    finishToSummary();
  };

  const pace = formatPace(elapsed, distance);
  const notice = endTrouble
    ? 'Having trouble ending your run — retrying…'
    : syncTrouble
      ? 'Having trouble syncing — retrying…'
      : backgroundNote
        ? 'Welcome back! Distance may pause while IGNITE is in the background — keep the app open for the most accurate tracking.'
        : null;

  const participantDistance = (item) => {
    if (item.id === user?.id) return distance;
    return Number(item.distance_km ?? item.distance ?? 0);
  };

  // Location permission denied — icon, plain-language reason, direct action.
  if (phase === 'denied') {
    return (
      <SafeAreaView className="flex-1 bg-base">
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="location-outline" size={64} color={colors.content.secondary} />
          <Text className="mt-6 text-center text-lg text-content">
            IGNITE needs your location to track this run
          </Text>
          <Text className="mt-2 text-center text-content-secondary">
            Allow location access in your phone’s settings, then come back here.
          </Text>
          <Pressable
            className="mt-6 h-14 w-full items-center justify-center rounded-xl bg-competition active:bg-competition-dim"
            onPress={() => Linking.openSettings()}
            accessibilityRole="button"
            accessibilityLabel="Open phone settings to allow location access"
          >
            <Text className="text-lg font-semibold text-content">Open Settings</Text>
          </Pressable>
          <Pressable
            className="mt-2 h-14 w-full items-center justify-center rounded-xl active:bg-elevated"
            onPress={checkPermission}
            accessibilityRole="button"
            accessibilityLabel="Check location permission again"
          >
            <Text className="text-lg font-semibold text-content-secondary">Check Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Checking permissions — skeleton, never a blank void.
  if (phase === 'checking') {
    return (
      <SafeAreaView className="flex-1 bg-base">
        <View className="flex-1 px-4 pt-6">
          <SkeletonBlock style={{ height: 16, width: 96 }} />
          <SkeletonBlock style={{ marginTop: 24, height: 96, width: '100%' }} />
          <SkeletonBlock style={{ marginTop: 24, height: 96, width: '100%' }} />
        </View>
      </SafeAreaView>
    );
  }

  // Countdown — pocket-your-phone buffer while GPS locks. Skippable.
  if (phase === 'countdown') {
    return (
      <SafeAreaView className="flex-1 bg-base">
        <View className="flex-1 items-center justify-center px-4">
          <Text
            className="text-8xl font-bold text-competition"
            accessibilityLiveRegion="polite"
            accessibilityLabel={
              count > 0 ? `Run starts in ${count}` : 'Go! Your run is starting'
            }
          >
            {count > 0 ? count : 'GO'}
          </Text>
          <Text className="mt-6 text-lg text-content-secondary">
            Get ready — tracking starts in a moment
          </Text>
          <Pressable
            className="mt-6 h-14 w-full items-center justify-center rounded-xl border border-edge bg-surface active:bg-elevated"
            onPress={() => setPhase('tracking')}
            accessibilityRole="button"
            accessibilityLabel="Skip countdown and start tracking now"
          >
            <Text className="text-lg font-semibold text-content">Skip</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Live tracking
  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 px-4 pt-6">
        {/* Header */}
        <View className="h-14 flex-row items-center">
          <LiveDot />
          <Text className="ml-2 text-xs font-semibold tracking-widest text-content-secondary">
            LIVE RUN
          </Text>
        </View>

        {/* Non-blocking sync/background notices — the run keeps going */}
        {notice && (
          <View className="mt-2 rounded-xl bg-elevated px-4 py-3" accessibilityLiveRegion="polite">
            <Text className="text-content-secondary">{notice}</Text>
          </View>
        )}

        {/* Timer — IGNITE's signature glanceable metric */}
        <View className="flex-[2] items-center justify-center">
          <Text
            className="text-8xl font-bold text-competition"
            style={{ fontVariant: ['tabular-nums'] }}
            accessibilityLabel={clockLabel(elapsed)}
          >
            {formatClock(elapsed)}
          </Text>
        </View>

        {/* Distance + pace */}
        <View className="flex-row gap-4">
          <View
            className="flex-1 items-center rounded-xl border border-edge bg-surface p-4"
            accessible
            accessibilityLabel={`Distance ${distance.toFixed(2)} kilometers`}
          >
            <Text className="text-xs font-semibold tracking-widest text-content-secondary">
              DISTANCE
            </Text>
            <Text className="mt-2 text-3xl font-bold text-content">
              {distance.toFixed(2)} km
            </Text>
          </View>
          <View
            className="flex-1 items-center rounded-xl border border-edge bg-surface p-4"
            accessible
            accessibilityLabel={`Pace ${pace.label}`}
          >
            <Text className="text-xs font-semibold tracking-widest text-content-secondary">
              PACE
            </Text>
            <Text className="mt-2 text-3xl font-bold text-content">{pace.text} /km</Text>
          </View>
        </View>

        {/* Other runners, refreshed every few seconds */}
        <Text className="mt-6 text-xs font-semibold tracking-widest text-content-secondary">
          RUNNERS
        </Text>
        <FlatList
          className="mt-4 flex-[3]"
          data={participants}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<SkeletonBlock style={{ height: 56, width: '100%' }} />}
          renderItem={({ item }) => (
            <View className="mb-2 h-14 flex-row items-center rounded-xl border border-edge bg-surface px-4">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-elevated">
                <Text className="font-semibold text-content">
                  {item.username?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="ml-4 flex-1 text-lg text-content">
                {item.id === user?.id ? `${item.username} (you)` : item.username}
              </Text>
              <Text
                className="text-lg font-semibold text-content"
                accessibilityLabel={`${participantDistance(item).toFixed(2)} kilometers`}
              >
                {participantDistance(item).toFixed(2)} km
              </Text>
            </View>
          )}
        />

        {/* End Run — thumb-reach zone, 56px tall, double-tap guarded */}
        <Pressable
          className={`mb-6 h-14 w-full items-center justify-center rounded-xl ${
            isEnding ? 'bg-competition-dim' : 'bg-competition active:bg-competition-dim'
          }`}
          onPress={handleEndRun}
          disabled={isEnding}
          accessibilityRole="button"
          accessibilityLabel="End run and see your summary"
        >
          <Text className="text-lg font-semibold text-content">
            {isEnding ? 'Ending…' : 'End Run'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
