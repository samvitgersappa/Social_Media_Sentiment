import React from 'react';
import { getSentimentColor } from '../utils/colorScale';

interface SentimentIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

export function SentimentIndicator({
  score,
  size = 'md',
  showScore = true,
  className = ''
}: SentimentIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full`}
        style={{ backgroundColor: getSentimentColor(score) }}
      />
      {showScore && (
        <span className="text-sm text-gray-300">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
}