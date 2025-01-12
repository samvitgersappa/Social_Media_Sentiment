// Color stops for the sentiment gradient (from negative to positive)
const colorStops = [
  { score: -5, color: '#FF0000' },  // Red
  { score: -3, color: '#FF4500' },  // Orange-Red
  { score: -1, color: '#FFA500' },  // Orange
  { score: 0, color: '#FFD700' },   // Yellow
  { score: 1, color: '#9ACD32' },   // Yellow-Green
  { score: 3, color: '#32CD32' },   // Lime Green
  { score: 5, color: '#008000' },   // Green
];

/**
 * Interpolates between two colors based on a factor (0-1)
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Convert hex to RGB
  const hex1 = color1.substring(1);
  const hex2 = color2.substring(1);
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  // Interpolate RGB values
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  // Convert back to hex
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

/**
 * Gets the color for a given sentiment score
 * @param score Sentiment score (-5 to 5)
 * @returns Hex color code
 */
export function getSentimentColor(score: number): string {
  // Ensure score is within bounds
  const clampedScore = Math.max(-5, Math.min(5, score));
  
  // Find the color stops to interpolate between
  for (let i = 0; i < colorStops.length - 1; i++) {
    const currentStop = colorStops[i];
    const nextStop = colorStops[i + 1];
    
    if (clampedScore >= currentStop.score && clampedScore <= nextStop.score) {
      const range = nextStop.score - currentStop.score;
      const factor = (clampedScore - currentStop.score) / range;
      return interpolateColor(currentStop.color, nextStop.color, factor);
    }
  }
  
  // Fallback to the last color if something goes wrong
  return colorStops[colorStops.length - 1].color;
}