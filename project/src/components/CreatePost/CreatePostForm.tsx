import React, { useState } from 'react';
import { FormField } from './FormField';
import { ImageIcon, AtSign, Hash } from 'lucide-react';

interface CreatePostFormProps {
  onClose: () => void;
}

export function CreatePostForm({ onClose }: CreatePostFormProps) {
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    mentions: '',
    hashtags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return false;
    }
    if (!formData.caption.trim()) {
      setError('Caption is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: formData.imageUrl,
          caption: formData.caption,
          userId: parseInt(userId, 10),
          mentions: formData.mentions.split(' ').filter(m => m.startsWith('@')),
          hashtags: formData.hashtags.split(' ').filter(h => h.startsWith('#'))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      if (data.success) {
        onClose();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="imageUrl"
          label="Image URL"
          type="url"
          icon={<ImageIcon />}
          value={formData.imageUrl}
          onChange={handleChange('imageUrl')}
          placeholder="https://example.com/image.jpg"
        />

        <FormField
          id="caption"
          label="Caption"
          type="text"
          value={formData.caption}
          onChange={handleChange('caption')}
          placeholder="Write your caption..."
        />

        <FormField
          id="mentions"
          label="Mentions"
          type="text"
          icon={<AtSign />}
          value={formData.mentions}
          onChange={handleChange('mentions')}
          placeholder="@username1 @username2"
        />

        <FormField
          id="hashtags"
          label="Hashtags"
          type="text"
          icon={<Hash />}
          value={formData.hashtags}
          onChange={handleChange('hashtags')}
          placeholder="#nature #photography"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}