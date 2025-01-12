import React from 'react';
import { SentimentIndicator } from './SentimentIndicator';

interface PostHeaderProps {
  username: string;
  userAvatar: string;
  sentimentScore: number;
}

export function PostHeader({ username, userAvatar, sentimentScore }: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <img
          src={userAvatar}
          alt={username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-3 font-medium text-white">{username}</span>
      </div>
      <SentimentIndicator score={sentimentScore} size="sm" />
    </div>
  );
}