import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 px-8 pt-8">
        <Text className="text-3xl font-bold text-content">
          Welcome back{user?.username ? `, ${user.username}` : ''}
        </Text>
        <Text className="mt-2 text-base text-content-secondary">
          Live sessions are coming soon.
        </Text>

        <View className="mt-8 rounded-2xl bg-surface p-6">
          <Text className="text-sm uppercase tracking-wide text-content-muted">
            Next up
          </Text>
          <Text className="mt-2 text-lg text-analysis">
            Start a run and race your friends in real time.
          </Text>
        </View>

        <Pressable
          className="mt-auto mb-8 items-center rounded-xl border border-edge py-4 active:bg-surface"
          onPress={logout}
        >
          <Text className="text-base font-semibold text-content-secondary">Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
