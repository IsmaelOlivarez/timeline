import { memo } from "react";
import { FlatList, Image, Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import type { Person } from "../../data/seed";

export type Step = { id: string; person: Person; anchorIndex: number };

type Props = {
  steps: Step[];
  activeIndex: number;
  onPress: (s: Step) => void;
  scrollX: SharedValue<number>;
};

const GAP = 12;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Step>);

export default memo(function Stepper({ steps, activeIndex, onPress, scrollX }: Props) {
  const { width } = useWindowDimensions();
  const SIDE = 16;
  const cardWidth = width - SIDE * 2;
  const STRIDE = cardWidth + GAP;

  const renderItem = ({ item }: { item: Step }) => (
    <BubbleItem
      step={item}
      stride={STRIDE}
      stepsLen={steps.length}   // pass total bubbles for circular distance
      scrollX={scrollX}
      onPress={onPress}
    />
  );

  return (
    <AnimatedFlatList
      horizontal
      data={steps}
      keyExtractor={(s) => s.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, alignItems: "center" }}
      ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
      ListHeaderComponent={<View style={{ width: 0 }} />}
      renderItem={renderItem}
    />
  );
});

function BubbleItem({
  step: s,
  stride,
  stepsLen,
  scrollX,
  onPress,
}: {
  step: Step;
  stride: number;
  stepsLen: number;
  scrollX: SharedValue<number>;
  onPress: (s: Step) => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const page = scrollX.value / stride; // fractional card index (can grow > stepsLen)

    // normalize to [0, stepsLen)
    const normPage = ((page % stepsLen) + stepsLen) % stepsLen;

    // circular (wrap-around) distance between current page and this bubble's anchor
    const raw = Math.abs(normPage - s.anchorIndex);
    const wrap = stepsLen - raw;
    const dist = Math.min(raw, wrap); // 0 = centered, ~1 = one step away

    const borderWidth = interpolate(dist, [0, 1], [2, 1]);
    const scale = interpolate(dist, [0, 1.0], [1.1, 1]);
    const bg = interpolateColor(dist, [0, 1], ["rgba(239,68,68,1)", "rgba(255,255,255,0.4)"]);
    const border = interpolateColor(dist, [0, 1], ["rgba(255,212,81,0.9)", "rgba(255,255,255,0.35)"]);

    return { transform: [{ scale }], backgroundColor: bg, borderColor: border, borderWidth };
  });

  return (
    <Pressable onPress={() => onPress(s)} hitSlop={10}>
      <Animated.View
        style={animatedStyle}
        className="w-[80px] h-[80px] rounded-full overflow-hidden items-center justify-center border"
      >
        {s.person.avatar ? (
          <Image source={{ uri: s.person.avatar }} className="w-full h-full" />
        ) : (
          <Text className="text-white text-xs">{s.person.name}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
