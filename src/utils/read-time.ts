
/**
 * Calculates the estimated reading time based on text content
 * @param text The text content to analyze
 * @returns An object with minutes and displayText
 */
export function calculateReadTime(text: string): { minutes: number; displayText: string } {
  if (!text || typeof text !== 'string') {
    return { minutes: 0, displayText: '🕒 Quick read' };
  }

  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return { 
    minutes, 
    displayText: words < 100 ? '🕒 Quick read' : `🕒 ${minutes} min read` 
  };
}
