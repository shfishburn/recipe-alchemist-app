
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
 * Enhanced UUID validation with better handling of formats and edge cases
 * @param uuid String to validate as UUID
 * @returns Boolean indicating if the string is a valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  
  // Normalize the UUID by removing any whitespace
  const normalizedUuid = uuid.trim();
  
  // Standard UUID v4 regex pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // Check if it's a valid UUID with proper format
  return uuidRegex.test(normalizedUuid);
};

/**
 * Improved extraction of ID from slug with better error handling
 * @param slugId String in format "slug-id" or just "id"
 * @returns The extracted ID or null if invalid
 */
export const extractIdFromSlug = (slugId: string): string | null => {
  // Basic validation
  if (!slugId || typeof slugId !== 'string') {
    return null;
  }
  
  // If the string contains a hyphen, extract the part after the last hyphen
  if (slugId.includes('-')) {
    const parts = slugId.split('-');
    const potentialId = parts[parts.length - 1];
    
    // Validate that the extracted part is a valid UUID
    return isValidUUID(potentialId) ? potentialId : null;
  }
  
  // If no hyphen, check if the entire string is a valid UUID
  return isValidUUID(slugId) ? slugId : null;
};
