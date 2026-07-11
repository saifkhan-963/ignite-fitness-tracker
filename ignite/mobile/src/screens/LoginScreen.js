import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/tokens';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Enter your username and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ username, password });
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.detail ||
          'Login failed. Check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 justify-center px-8">
        <Text className="text-4xl font-bold text-content">
          IGNITE<Text className="text-competition">.</Text>
        </Text>
        <Text className="mt-2 mb-10 text-base text-content-secondary">
          Run together, anywhere.
        </Text>

        <TextInput
          className="mb-4 rounded-xl border border-edge bg-surface px-4 py-3 text-content"
          placeholder="Username"
          placeholderTextColor={colors.content.muted}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="mb-4 rounded-xl border border-edge bg-surface px-4 py-3 text-content"
          placeholder="Password"
          placeholderTextColor={colors.content.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text className="mb-4 text-sm text-danger">{error}</Text>}

        <Pressable
          className="items-center rounded-xl bg-competition py-4 active:bg-competition-dim"
          disabled={isSubmitting}
          onPress={handleLogin}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.content.DEFAULT} />
          ) : (
            <Text className="text-base font-semibold text-content">Log in</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
