import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import type { Profile } from '../types/profile';

interface SuggestedProfilesProps {
  profiles: Profile[];
}

export function SuggestedProfiles({ profiles }: SuggestedProfilesProps) {
  const [followStatus, setFollowStatus] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchFollowStatus = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User not logged in');
        return;
      }

      const status: { [key: number]: boolean } = {};
      for (const profile of profiles) {
        try {
          const response = await fetch(`http://localhost:3000/api/follow-status?userId=${userId}&followUserId=${profile.id}`);
          const data = await response.json();
          if (data.success) {
            status[profile.id] = data.follows;
          } else {
            console.error('Failed to fetch follow status:', data.error);
          }
        } catch (error) {
          console.error('Error fetching follow status:', error);
        }
      }
      setFollowStatus(status);
    };

    fetchFollowStatus();
  }, [profiles]);

  const handleFollow = async (followUserId: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, followUserId }),
      });

      const data = await response.json();
      if (data.success) {
        setFollowStatus((prevStatus) => ({ ...prevStatus, [followUserId]: true }));
        console.log('Followed successfully');
      } else {
        console.error('Failed to follow user:', data.error);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (followUserId: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, followUserId }),
      });

      const data = await response.json();
      if (data.success) {
        setFollowStatus((prevStatus) => ({ ...prevStatus, [followUserId]: false }));
        console.log('Unfollowed successfully');
      } else {
        console.error('Failed to unfollow user:', data.error);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-white font-semibold mb-4">Suggested Photographers</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex-shrink-0 bg-gray-700 rounded-lg p-4 w-64"
          >
            <div className="flex items-center gap-3">
              <img
                src={profile.avatar}
                alt={profile.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">
                  {profile.username}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {profile.description}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-blue-400 text-sm">
                {profile.matchingVibes} matching vibes
              </span>
              {followStatus[profile.id] ? (
                <button
                  className="text-white hover:text-red-400 transition-colors"
                  onClick={() => handleUnfollow(profile.id)}
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              ) : (
                <button
                  className="text-white hover:text-blue-400 transition-colors"
                  onClick={() => handleFollow(profile.id)}
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}