// Dummy sentiment analysis function
// In a real application, this would use a proper sentiment analysis library or API
export function analyzeSentiment(text: string): number {
  // This is a very simple example - replace with actual sentiment analysis
  const positiveWords = ['good', 'great', 'awesome', 'amazing', 'beautiful', 'stunning', 'delicious'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing'];
  
  const words = text.toLowerCase().split(' ');
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  // Normalize score to -5 to 5 range
  return Math.max(-5, Math.min(5, score));
}