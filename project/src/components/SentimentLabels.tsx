import React from 'react';
import { SentimentLabel } from '../utils/sentiment';

interface SentimentLabelsProps {
  labels: SentimentLabel[];
}

export function SentimentLabels({ labels }: SentimentLabelsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {labels.map((label, index) => (
        <span
          key={index}
          className={`px-2 py-1 rounded text-xs ${label.type === 'positive' ? 'bg-green-500' : label.type === 'negative' ? 'bg-red-500' : 'bg-gray-500'
            }`}
        >
          {label.text}
        </span>
      ))}
    </div>
  );
}