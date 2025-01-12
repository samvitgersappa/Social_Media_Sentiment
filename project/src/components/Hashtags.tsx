import React from 'react';

interface HashtagsProps {
  tags: string[];
}

export function Hashtags({ tags }: HashtagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-blue-400 hover:text-blue-300 cursor-pointer text-sm"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}