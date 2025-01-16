import React from 'react';
import type { Comment } from '../types/post';

interface PostCommentsProps {
  comments: Comment[];
}

export function PostComments({ comments }: PostCommentsProps) {
  if (!comments || comments.length === 0) {
    return <div className="mt-4 text-gray-500">No comments yet.</div>;
  }

  return (
    <div className="mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2 mb-2">
          <img
            src={`https://api.adorable.io/avatars/40/${comment.username}.png`}
            alt={`${comment.username}'s avatar`}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-white font-medium">{comment.username}</p>
            <p className="text-gray-300">{comment.text}</p>
            <p className="text-gray-500 text-sm">{comment.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}