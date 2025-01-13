import React from 'react';

interface SentimentIndicatorProps {
  score?: number | null;
}

export function SentimentIndicator({ score = 0 }: SentimentIndicatorProps) {
  const displayScore = score !== null && score !== undefined ? score.toFixed(2) : 'N/A';

  return (
    <div className="flex items-center gap-2">
      <span className="text-white">{displayScore}</span>
    </div>
  );
}