import React from 'react';
import type { Comment } from '../types/post';
import { SentimentIndicator } from './SentimentIndicator';
import { analyzeSentiment } from '../utils/sentiment';

interface PostCommentsProps {
  comments: Comment[];
}

export function PostComments({ comments }: PostCommentsProps) {
  return (
    <div className="mt-4 space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-center justify-between text-gray-300">
          <div>
            <span className="font-medium text-white">{comment.username}</span>{' '}
            {comment.text}
          </div>
          <SentimentIndicator
            score={analyzeSentiment(comment.text)}
            size="sm"
            className="ml-2"
          />
        </div>
      ))}
    </div>
  );
}