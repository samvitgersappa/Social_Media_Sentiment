import React from 'react';
import { SentimentIndicator } from './SentimentIndicator';

interface PostHeaderProps {
  username: string;
  userAvatar: string;
  sentimentScore?: number;
}

export function PostHeader({ username, userAvatar, sentimentScore }: PostHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      <img
        src={userAvatar}
        alt={`${username}'s avatar`}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-white font-medium">{username}</span>
        <SentimentIndicator score={sentimentScore} />
      </div>
    </div>
  );
}