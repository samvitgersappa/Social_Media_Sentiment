import React from 'react';
import { UserCircle2, Camera } from 'lucide-react';
import { SentimentIndicator } from './SentimentIndicator';

interface UserVibeProps {
  interests: string[];
  selectedVibe: string;
  overallSentiment: number;
}

export function UserVibe({ interests, selectedVibe, overallSentiment }: UserVibeProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Camera className="w-8 h-8 text-white" />
        <div>
          <h2 className="text-white font-semibold">Your Vibe</h2>
          <SentimentIndicator score={overallSentiment} size="md" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <span
            key={interest}
            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
              interest === selectedVibe
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}