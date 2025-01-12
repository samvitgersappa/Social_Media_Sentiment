import React from 'react';
import { PlusCircle } from 'lucide-react';

interface CreatePostButtonProps {
  onClick: () => void;
}

export function CreatePostButton({ onClick }: CreatePostButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
    >
      <PlusCircle className="w-6 h-6" />
      <span className="hidden md:inline">Create Post</span>
    </button>
  );
}