import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
  View
} from "react-native";
import Animated, { SharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";

type FeedItem = { id: string; author: string; caption: string; mediaUri?: string };

// Hoist Animated component so it doesn't change between renders
const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList as new () => FlatList<FeedItem>
);

export default function FeedCarousel({
  items,
  onIndexChange,
  scrollX,
}: {
  items: FeedItem[];
  onIndexChange?: (index: number) => void;
  scrollX: SharedValue<number>;
}) {
  const { width } = useWindowDimensions();

  // Memoize layout numbers used for snapping
  const { SIDE, GAP, cardWidth, STRIDE } = useMemo(() => {
    const SIDE = 16;
    const GAP = 12;
    const cardWidth = width - SIDE * 2;
    const STRIDE = cardWidth + GAP;
    return { SIDE, GAP, cardWidth, STRIDE };
  }, [width]);

  const renderItem: ListRenderItem<FeedItem> = useCallback(
    ({ item, index }) => {
      const isLast = index === items.length - 1;
      return (
        <View
          style={{
            width: cardWidth,
            marginRight: isLast ? 0 : GAP,
            position: "relative",       // <-- important
          }}
        >
          <PostCard
            author={item.author}
            caption={item.caption}
            mediaUri={item.mediaUri}
            style={{ width: cardWidth }}
          />
  
          {/* Bottom sheet that expands UP over the card */}
          <CommentSection postId={item.id} />
        </View>
      );
    },
    [items.length, cardWidth, GAP]
  );

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!onIndexChange) return;
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / STRIDE);
      onIndexChange(Math.max(0, Math.min(index, items.length - 1)));
    },
    [onIndexChange, STRIDE, items.length]
  );

  // Drive shared scroll progress continuously
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <AnimatedFlatList
      data={items}
      keyExtractor={(i) => i.id}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={STRIDE}
      snapToAlignment="start"
      disableIntervalMomentum
      overScrollMode="never"
      contentContainerStyle={{ paddingHorizontal: SIDE, paddingVertical: 8 }}
      onMomentumScrollEnd={onMomentumEnd}
      onScroll={onScroll}
      scrollEventThrottle={16}
      initialNumToRender={5}
      windowSize={7}
      removeClippedSubviews={false}   // <-- let the overlay render outside cell bounds
    />
  
    
    
  );
}
