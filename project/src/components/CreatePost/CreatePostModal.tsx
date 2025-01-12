import React from 'react';
import { X } from 'lucide-react';
import { CreatePostForm } from './CreatePostForm';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <CreatePostForm onClose={onClose} />
      </div>
    </div>
  );
}