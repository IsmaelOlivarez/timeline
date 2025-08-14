import React, { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import Animated, {
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Comment from "./Comment";

interface CommentData {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface CommentSectionProps {
  postId: string;
  comments?: CommentData[];
  defaultExpanded?: boolean;
}

const COLLAPSED_H = 48; // the small bar height

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments = [],
  defaultExpanded = false,
}) => {
  const { height: H } = useWindowDimensions();
  const EXPANDED_H = Math.floor(H * 0.5); // ~50% of screen

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<CommentData[]>(comments);

  // animate height
  const h = useSharedValue(defaultExpanded ? EXPANDED_H : COLLAPSED_H);
  useEffect(() => {
    h.value = withTiming(expanded ? EXPANDED_H : COLLAPSED_H, { duration: 220 });
  }, [expanded, EXPANDED_H]);
  const sheetStyle = useAnimatedStyle(() => ({ height: h.value }));

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const c: CommentData = {
      id: Date.now().toString(),
      author: "You",
      content: newComment.trim(),
      timestamp: new Date().toLocaleTimeString(),
      likes: 0,
    };
    setLocalComments((prev) => [c, ...prev]);
    setNewComment("");
    if (!expanded) setExpanded(true);
  };

  const handleLikeComment = (id: string) => {
    setLocalComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <Animated.View
      style={[
        sheetStyle,
        {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0, // expand UP from bottom of the card
          backgroundColor: "white", // Maybe make this a little transparent...
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          // subtle elevation
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          elevation: 8,
          zIndex: 20,
        },
      ]}
      layout={Layout.springify().damping(20).stiffness(220)}
    >
      {/* Header / Toggle always visible */}
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",

          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}>
          Comments ({localComments.length})
        </Text>
        <Text style={{ color: "#6B7280" }}>{expanded ? "▼" : "▲"}</Text>
      </Pressable>

      {/* Body only when expanded */}
      {expanded ? (
        <>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          >
            {localComments.length === 0 ? (
              <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <Text style={{ color: "#6B7280", textAlign: "center" }}>
                  No comments yet. Be the first to comment!
                </Text>
              </View>
            ) : (
              localComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onLike={() => handleLikeComment(comment.id)}
                />
              ))
            )}
          </ScrollView>

          {/* Input */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
              backgroundColor: "#F9FAFB",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{
                  flex: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 8,
                  color: "#111827",
                }}
                placeholder="Add a comment..."
                placeholderTextColor="#9CA3AF"
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: newComment.trim() ? "#3B82F6" : "#93C5FD",
                }}
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : null}
    </Animated.View>
  );
};

export default CommentSection;
