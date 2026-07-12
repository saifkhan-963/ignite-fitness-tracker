import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder so RunScreen's navigation.replace('Summary', …) has a target.
// The real post-run summary gets built next session.
export default function SummaryScreen({ route }) {
  const params = route?.params ?? {};

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 px-4 pt-6">
        <Text className="text-2xl font-bold text-content">Run Summary</Text>
        <Text className="mt-6 text-lg text-content-secondary">
          {JSON.stringify(params, null, 2)}
        </Text>
      </View>
    </SafeAreaView>
  );
}
