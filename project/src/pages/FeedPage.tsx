import React, { useState } from 'react';
import { Layout } from 'lucide-react';
import { Post } from '../components/Post';
import { UserVibe } from '../components/UserVibe';
import { SuggestedProfiles } from '../components/SuggestedProfiles';
import { CreatePostButton } from '../components/CreatePost/CreatePostButton';
import { CreatePostModal } from '../components/CreatePost/CreatePostModal';
import { posts, userInterests } from '../data/posts';
import { suggestedProfiles } from '../data/profiles';

export function FeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const overallSentiment = posts.reduce((acc, post) => acc + post.sentimentScore, 0) / posts.length;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 fixed top-0 w-full z-10">
        <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white">SocialFeed</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-lg mx-auto px-4 pt-20 pb-8">
        <UserVibe
          interests={userInterests}
          selectedVibe="Photography 📸"
          overallSentiment={overallSentiment}
        />

        <SuggestedProfiles profiles={suggestedProfiles} />

        <div className="flex flex-col items-center gap-6">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </main>

      <CreatePostButton onClick={() => setIsCreateModalOpen(true)} />
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}