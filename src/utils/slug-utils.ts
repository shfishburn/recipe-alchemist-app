/**
 * Generates a URL-friendly slug from a given string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')       // Trim starting hyphens
    .replace(/-+$/, '')       // Trim ending hyphens
    .substring(0, 50);        // Limit length to 50 characters
};

/**
 * Extracts a recipe ID from a slug-id format
 * @param slugId String in format "slug-id" or just "id"
 * @returns The extracted ID
 */
export const extractIdFromSlug = (slugId: string): string => {
  // If the string contains a hyphen, extract the part after the last hyphen
  if (slugId.includes('-')) {
    const parts = slugId.split('-');
    return parts[parts.length - 1];
  }
  // Otherwise, return the original string (assumes it's an ID)
  return slugId;
};
