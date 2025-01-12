import React from 'react';
import { SentimentLabel } from '../types/sentiment';

interface SentimentLabelsProps {
  labels: SentimentLabel[];
}

export function SentimentLabels({ labels }: SentimentLabelsProps) {
  const getColorClasses = (type: SentimentLabel['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'negative':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'neutral':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {labels.map((label) => (
        <span
          key={label.text}
          className={`px-2 py-1 rounded-md text-xs font-medium border ${getColorClasses(
            label.type
          )}`}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}