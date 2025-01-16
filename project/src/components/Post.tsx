import React, { useState } from 'react';
import type { Post as PostType } from '../types/post';
import { PostHeader } from './PostHeader';
import { PostActions } from './PostActions';
import { PostComments } from './PostComments';
import { Hashtags } from './Hashtags';
import { SentimentSlider } from './SentimentSlider';
import { SentimentLabels } from './SentimentLabels';
import { getSentimentLabels } from '../utils/sentiment';
import { getUserIdFromToken } from '../utils/auth'; // Import the utility function

interface PostProps {
  post: PostType;
  onNewComment: (postId: string, comment: any) => void;
}

export function Post({ post, onNewComment }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(true); // Show comments by default
  const [imageError, setImageError] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [sentimentLabels, setSentimentLabels] = useState(getSentimentLabels(post.sentimentScore));
  const [likeCount, setLikeCount] = useState(post.likeCount || 0); // Initialize like count

  const handleAddComment = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${post.post_id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          text: commentText,
          mentions: [], // Extract mentions from the comment text
          hashtags: [], // Extract hashtags from the comment text
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newComment = {
          id: data.commentId,
          username: 'currentUsername', // Replace with the actual username
          text: commentText,
          timestamp: new Date().toISOString(),
        };
        setComments([...comments, newComment]);
        onNewComment(post.post_id, newComment);
        setCommentText('');
        setSentimentLabels(getSentimentLabels(data.sentimentScore));
      } else {
        console.error('Failed to add comment:', data.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeClick = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${post.post_id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLiked(!isLiked);
        setLikeCount(likeCount + (isLiked ? -1 : 1)); // Update like count
      } else {
        console.error('Failed to like post:', data.error);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 max-w-xl w-full">
      <PostHeader
        username={post.username}
        userAvatar={post.userAvatar}
        sentimentScore={post.sentimentScore}
      />

      {post.imageUrl && !imageError && (
        <img
          src={post.imageUrl}
          alt="Post content"
          className="w-full aspect-square object-cover"
          onError={() => setImageError(true)}
        />
      )}

      {imageError && (
        <div className="w-full aspect-square bg-gray-700 flex items-center justify-center">
          <span className="text-white">Image not available</span>
        </div>
      )}

      <div className="p-4">
        <PostActions
          isLiked={isLiked}
          onLikeClick={handleLikeClick}
          onCommentClick={() => setShowComments(!showComments)}
        />

        <p className="text-white font-medium mt-2">
          {likeCount} likes
        </p>

        <p className="text-white mt-2">
          <span className="font-medium">{post.username}</span>{' '}
          <span className="text-gray-300">{post.caption}</span>
        </p>

        <Hashtags tags={post.hashtags || []} />

        <div className="mt-4">
          <SentimentSlider score={post.sentimentScore} />
          <SentimentLabels labels={sentimentLabels} />
        </div>

        {showComments && <PostComments comments={comments} />}

        <div className="mt-4">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleAddComment}
            className="mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Post Comment
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-2">{post.timestamp}</p>
      </div>
    </div>
  );
}