import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useMemo } from "react";
import { FlatList, Text, View, useWindowDimensions } from "react-native";

type Props = {
  author?: string;
  caption?: string;
  style?: any; // width comes from parent
  mediaUri?: string;
};

export default memo(function PostCard({
  author = "User",
  caption = "Caption",
  style,
}: Props) {
  const { height: H } = useWindowDimensions();
  const MEDIA_VIEWPORT = Math.min(760, Math.max(550, Math.floor(H * 0.6)));

  const mediaBlocks = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `block-${i}`,
        height: 200 + (i % 3) * 100,
        color: i % 2 === 0 ? "#ddd" : "#bbb",
        label: `Block ${i + 1}`,
      })),
    []
  );

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={{
        height: item.height,
        backgroundColor: item.color,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{item.label}</Text>
    </View>
  );

  return (
    <MaskedView
      style={style}
      maskElement={
        <View style={{ flex: 1, borderRadius: 18, paddingHorizontal: 6 }}>
          <LinearGradient
            style={{ flex: 1, borderRadius: 18 }}
            colors={[
              "#000",                 // fully visible
              "#000",                 // hold visibility longer
              "rgba(0,0,0,0.6)",      // start easing
              "rgba(0,0,0,0.25)",     // almost gone
              "transparent",          // fully transparent at bottom
            ]}
            locations={[0, 0.72, 0.86, 0.93, 1]}
          />
        </View>
      }
    >
      <View className="bg-white rounded-[18px] overflow-hidden ">
        {/* Header */}
        <View className="p-3 flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-neutral-200 mr-2" />
          <Text className="font-semibold text-neutral-900">{author}</Text>
        </View>

        {/* Media viewport */}
        <View style={{ height: MEDIA_VIEWPORT }} className="bg-neutral-100">
          <FlatList
            data={mediaBlocks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            nestedScrollEnabled
            showsVerticalScrollIndicator
            directionalLockEnabled
            contentContainerStyle={{ paddingBottom: 12 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>
      </View>
    </MaskedView>
  );
});
