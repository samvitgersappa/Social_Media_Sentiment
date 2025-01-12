import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface PostActionsProps {
  isLiked: boolean;
  onLikeClick: () => void;
  onCommentClick: () => void;
}

export function PostActions({ isLiked, onLikeClick, onCommentClick }: PostActionsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onLikeClick}
        className="text-white hover:text-pink-500 transition-colors"
      >
        <Heart
          className={`w-6 h-6 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`}
        />
      </button>
      <button
        onClick={onCommentClick}
        className="text-white hover:text-blue-500 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      <button className="text-white hover:text-green-500 transition-colors">
        <Share2 className="w-6 h-6" />
      </button>
    </div>
  );
}