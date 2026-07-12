import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/tokens';

// Placeholder tab bar until React Navigation bottom tabs are wired up.
// Run sits in the center slot as the larger primary action.
const TABS = [
  { key: 'home', label: 'Home', icon: 'home', outline: 'home-outline' },
  { key: 'community', label: 'Community', icon: 'people', outline: 'people-outline' },
  { key: 'run', label: 'Run', icon: 'flash', outline: 'flash-outline', primary: true },
  { key: 'progress', label: 'Progress', icon: 'stats-chart', outline: 'stats-chart-outline' },
  { key: 'profile', label: 'Profile', icon: 'person', outline: 'person-outline' },
];

// Pulsing grey placeholder shown while user data loads — never a blank void.
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

export default function HomeScreen({ navigation }) {
  const { user, isLoading, logout } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const activeTab = 'home';

  const handleTabPress = (key) => {
    // Placeholder: Profile logs out until a real Profile screen exists,
    // otherwise this app would have no way to sign out.
    if (key === 'profile') logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 px-4 pt-6">
        {/* Header */}
        <View className="h-14 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-competition">IGNITE</Text>
          {isLoading ? (
            <SkeletonBlock style={{ width: 96, height: 16 }} />
          ) : (
            <Text className="text-lg text-content-secondary">
              Hey{user?.username ? `, ${user.username}` : ' there'}
            </Text>
          )}
        </View>

        {/* Today's motivation */}
        {isLoading ? (
          <SkeletonBlock style={{ marginTop: 24, width: 240, height: 24 }} />
        ) : (
          <Text className="mt-6 text-2xl font-semibold text-content">
            Ready to race someone?
          </Text>
        )}

        {/* Primary CTA */}
        <Pressable
          className="mt-6 h-14 w-full items-center justify-center rounded-xl bg-competition active:bg-competition-dim"
          onPress={() => navigation.navigate('Session', { mode: 'create' })}
        >
          <Text className="text-lg font-semibold text-content">Create Session</Text>
        </Pressable>

        {/* Secondary CTA — join with an invite code */}
        <View className="mt-6 h-14 w-full flex-row items-center overflow-hidden rounded-xl border border-edge bg-surface">
          <TextInput
            className="h-14 flex-1 px-4 text-lg text-content"
            placeholder="Invite code"
            placeholderTextColor={colors.content.muted}
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <Pressable
            className="h-14 items-center justify-center px-4 active:bg-elevated"
            onPress={() => inviteCode.trim() && navigation.navigate('Session', { mode: 'join', inviteCode: inviteCode.trim() })}
          >
            <Text className="text-lg font-semibold text-content-secondary">Join Session</Text>
          </Pressable>
        </View>

        {/* Empty state — no runs yet */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl">👟</Text>
          <Text className="mt-2 text-lg font-semibold text-content">No runs yet</Text>
          <Text className="mt-2 text-lg text-content-secondary">
            Start your first session above
          </Text>
        </View>
      </View>

      {/* Bottom tab bar (placeholder navigation) */}
      <View className="flex-row border-t border-edge bg-base px-2 pt-2">
        {TABS.map((tab) => {
          if (tab.primary) {
            return (
              <Pressable
                key={tab.key}
                className="flex-1 items-center"
                onPress={() => handleTabPress(tab.key)}
              >
                <View className="-mt-6 h-16 w-16 items-center justify-center rounded-full bg-competition">
                  <Ionicons name={tab.icon} size={28} color={colors.content.DEFAULT} />
                </View>
                <Text className="mt-2 text-xs text-content-secondary">{tab.label}</Text>
              </Pressable>
            );
          }

          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              className="h-14 flex-1 items-center justify-center"
              onPress={() => handleTabPress(tab.key)}
            >
              <Ionicons
                name={isActive ? tab.icon : tab.outline}
                size={24}
                color={isActive ? colors.content.DEFAULT : colors.content.secondary}
              />
              <Text
                className={
                  isActive
                    ? 'mt-2 text-xs font-semibold text-content'
                    : 'mt-2 text-xs text-content-secondary'
                }
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
