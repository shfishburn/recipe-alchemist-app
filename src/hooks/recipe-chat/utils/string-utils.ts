
/**
 * Normalizes text by removing excess whitespace, converting to lowercase
 * and normalizing special characters
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
}

/**
 * Calculates string similarity using Levenshtein distance algorithm
 * Returns a value between 0 (completely different) and 1 (identical)
 */
export function stringSimilarity(str1: string, str2: string): number {
  if (!str1 && !str2) return 1;
  if (!str1 || !str2) return 0;
  
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);
  
  if (normalized1 === normalized2) return 1;
  
  const len1 = normalized1.length;
  const len2 = normalized2.length;
  const maxLen = Math.max(len1, len2);
  
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(normalized1, normalized2);
  
  return 1 - distance / maxLen;
}

/**
 * Calculates the Levenshtein distance between two strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  const dp: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= len2; j++) {
    dp[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[len1][len2];
}
