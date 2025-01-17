import React, { useState, useEffect } from 'react';
import { Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../components/Post';
import { UserVibe } from '../components/UserVibe';
import { SuggestedProfiles } from '../components/SuggestedProfiles';
import { CreatePostButton } from '../components/CreatePost/CreatePostButton';
import { CreatePostModal } from '../components/CreatePost/CreatePostModal';
import { userInterests } from '../data/posts';
import type { Post as PostType } from '../types/post';
import type { Profile } from '../types/profile';

export function FeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();

        if (data.success) {
          setPosts(data.posts);
        } else {
          console.error('Failed to fetch posts:', data.error);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedProfiles = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User not logged in');
        }

        const response = await fetch(`http://localhost:3000/api/suggested-profiles?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
          setSuggestedProfiles(data.profiles);
        } else {
          console.error('Failed to fetch suggested profiles:', data.error);
        }
      } catch (error) {
        console.error('Error fetching suggested profiles:', error);
      }
    };

    fetchPosts();
    fetchSuggestedProfiles();
  }, []);

  const overallSentiment = posts.reduce((acc, post) => acc + post.sentimentScore, 0) / posts.length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 fixed top-0 w-full z-10">
        <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white">SocialFeed</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300 transition-colors"
          >
            Logout
          </button>
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
          {loading ? (
            <p className="text-white">Loading posts...</p>
          ) : (
            posts.map((post) => (
              <Post key={post.post_id} post={post} />
            ))
          )}
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