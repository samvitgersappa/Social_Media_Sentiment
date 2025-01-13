import React from 'react';

interface SentimentIndicatorProps {
  score?: number;
}

export function SentimentIndicator({ score = 0 }: SentimentIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white">{score.toFixed(2)}</span>
      {/* Add any additional sentiment indicator UI here */}
    </div>
  );
}