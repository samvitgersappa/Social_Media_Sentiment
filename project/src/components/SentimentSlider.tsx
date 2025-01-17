import React from 'react';
import { getSentimentColor } from '../utils/colorScale';

interface SentimentSliderProps {
  score: number;
  className?: string;
}

export function SentimentSlider({ score, className = '' }: SentimentSliderProps) {
  const normalizedScore = Math.max(-5, Math.min(5, score));
  const percentage = ((normalizedScore + 5) / 10) * 100;

  return (
    <div className={`w-full space-y-1 ${className}`}>
      <div className="flex justify-between text-xs text-gray-400">
        <span>-5</span>
        <span>Sentiment Score</span>
        <span>5</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: getSentimentColor(normalizedScore),
          }}
        />
      </div>
      <div className="text-center text-sm text-gray-300">
        Score: {normalizedScore.toFixed(2)}
      </div>
    </div>
  );
}