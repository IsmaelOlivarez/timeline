import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import FeedCarousel from "../components/Feed/FeedCarousel";
import Stepper, { Step } from "../components/Timeline/Stepper";
import { people } from "../data/seed";

const HEADER_H = 72;

// sample feed; replace with API data later
const sampleFeed = Array.from({ length: 10 }).map((_, i) => ({
  id: `post-${i}`,
  author: people[i % people.length].name,
  caption: "A placeholder caption goes here.",
  // mediaUri: "https://picsum.photos/800/600?random=" + i,
}));

export default function HomeScreen() {
  const steps: Step[] = useMemo(
    () => people.map((p, i) => ({ id: p.id, person: p, anchorIndex: i })),
    []
  );

  const [active, setActive] = useState(0);

  // shared scroll progress between feed and stepper
  const scrollX = useSharedValue(0);

  const feedRef = useRef<FlatList>(null);
  const stepperRef = useRef<FlatList>(null);

  const onDotPress = (s: Step) =>
    router.push({ pathname: "/person/[id]", params: { id: s.person.id } });

  return (
    <SafeAreaView className="flex-1">
      {/* background gradient (mock) */}
      <LinearGradient
        colors={["#44204f", "#e2c173", "#df826f", "#44204f"]}
        locations={[0, 0.18, 0.9, 1]}
        style={{ position: "absolute", inset: 0 }}
        pointerEvents="none"
      />
      
      <View className="flex-1">

        {/* STEPPER SEGMENT */}
        <View className="absolute inset-x-0 top-0 items-center justify-center z-[100]">
          <Stepper
            steps={steps}
            activeIndex={active}
            onPress={onDotPress}
            scrollX={scrollX}
          />
        </View>

        {/* POST FEED under the stepper segment above */}
        <View className="flex-1 pt-[90px]">
          <FeedCarousel
            items={sampleFeed}
            onIndexChange={setActive}
            scrollX={scrollX}
          />

          {/* Up arrow UNDER the card, outside PostCard */}
          <Pressable
            onPress={() => {}}
            style={{
              alignSelf: "center",
              bottom:10,
              backgroundColor: "rgba(0,0,0,0.6)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>▲</Text>
          </Pressable>
        </View>
        

      </View>
    </SafeAreaView>
  );
}