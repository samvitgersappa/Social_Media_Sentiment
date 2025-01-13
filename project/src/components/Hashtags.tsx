import React from 'react';

interface HashtagsProps {
  tags: string[];
}

export function Hashtags({ tags = [] }: HashtagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      {tags.map((tag, index) => (
        <span key={index} className="text-blue-500 mr-2">
          #{tag}
        </span>
      ))}
    </div>
  );
}