import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { postsByPerson } from "../../data/seed";

export default function PersonTimeline() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = postsByPerson[id ?? ""] ?? [];

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={data}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <Text className="px-4 pt-4 text-xl font-bold">Timeline of {id}</Text>
        }
        renderItem={() => <View className="h-64 m-4 rounded-2xl bg-neutral-100" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}
