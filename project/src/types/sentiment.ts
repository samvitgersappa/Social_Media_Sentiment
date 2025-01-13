export type SentimentLabel = {
  text: string;
  type: 'positive' | 'negative' | 'neutral';
};

export function getSentimentLabels(score: number): SentimentLabel[] {
  const labels: SentimentLabel[] = [];

  if (score > 3) {
    labels.push({ text: 'Encouraging', type: 'positive' });
    labels.push({ text: 'Happy', type: 'positive' });
  } else if (score > 1) {
    labels.push({ text: 'Satisfactory', type: 'positive' });
  }

  if (score >= -1 && score <= 1) {
    labels.push({ text: 'Neutral', type: 'neutral' });
  }

  if (score < -3) {
    labels.push({ text: 'Discouraging', type: 'negative' });
    labels.push({ text: 'Sad', type: 'negative' });
  } else if (score < -1) {
    labels.push({ text: 'Unsatisfactory', type: 'negative' });
  }

  return labels;
}