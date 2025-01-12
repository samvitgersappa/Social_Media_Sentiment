import React, { useState } from 'react';
import type { Post as PostType } from '../types/post';
import { PostHeader } from './PostHeader';
import { PostActions } from './PostActions';
import { PostComments } from './PostComments';
import { Hashtags } from './Hashtags';
import { SentimentSlider } from './SentimentSlider';
import { SentimentLabels } from './SentimentLabels';
import { getSentimentLabels } from '../types/sentiment';

interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const sentimentLabels = getSentimentLabels(post.sentimentScore);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 max-w-xl w-full">
      <PostHeader
        username={post.username}
        userAvatar={post.userAvatar}
        sentimentScore={post.sentimentScore}
      />

      <img
        src={post.imageUrl}
        alt="Post content"
        className="w-full aspect-square object-cover"
      />

      <div className="p-4">
        <PostActions
          isLiked={isLiked}
          onLikeClick={() => setIsLiked(!isLiked)}
          onCommentClick={() => setShowComments(!showComments)}
        />

        <p className="text-white font-medium mt-2">
          {post.likes + (isLiked ? 1 : 0)} likes
        </p>

        <p className="text-white mt-2">
          <span className="font-medium">{post.username}</span>{' '}
          <span className="text-gray-300">{post.caption}</span>
        </p>

        <Hashtags tags={post.hashtags} />

        <div className="mt-4">
          <SentimentSlider score={post.sentimentScore} />
          <SentimentLabels labels={sentimentLabels} />
        </div>

        {showComments && <PostComments comments={post.comments} />}

        <p className="text-gray-500 text-sm mt-2">{post.timestamp}</p>
      </div>
    </div>
  );
}