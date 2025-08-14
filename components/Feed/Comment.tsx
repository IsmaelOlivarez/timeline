import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CommentData {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface CommentProps {
  comment: CommentData;
  onLike: () => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onLike }) => {
  return (
    <View className="py-3 border-b border-gray-100">
      {/* Comment Header */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center space-x-2">
          <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
            <Text className="text-gray-600 font-medium text-sm">
              {comment.author.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text className="font-medium text-gray-900">{comment.author}</Text>
            <Text className="text-xs text-gray-500">{comment.timestamp}</Text>
          </View>
        </View>
      </View>

      {/* Comment Content */}
      <View className="ml-10 mb-2">
        <Text className="text-gray-800 leading-5">{comment.content}</Text>
      </View>

      {/* Comment Actions */}
      <View className="ml-10 flex-row items-center space-x-4">
        <TouchableOpacity
          className="flex-row items-center space-x-1"
          onPress={onLike}
        >
          <Text className="text-gray-500 text-sm">❤️</Text>
          <Text className="text-gray-500 text-sm">
            {comment.likes > 0 ? comment.likes : ''}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center space-x-1">
          <Text className="text-gray-500 text-sm">💬</Text>
          <Text className="text-gray-500 text-sm">Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comment;
