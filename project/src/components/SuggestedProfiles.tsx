import React from 'react';
import { UserPlus } from 'lucide-react';
import type { Profile } from '../types/profile';

interface SuggestedProfilesProps {
  profiles: Profile[];
}

export function SuggestedProfiles({ profiles }: SuggestedProfilesProps) {
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
              <button className="text-white hover:text-blue-400 transition-colors">
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}