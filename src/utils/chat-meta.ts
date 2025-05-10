
import type { ChatMessage } from '@/types/chat';

/**
 * Safely get chat metadata value with type checking and fallback
 */
export function getChatMeta<T>(
  message: ChatMessage | null | undefined, 
  key: string, 
  defaultValue: T
): T {
  if (!message) return defaultValue;
  
  // If meta doesn't exist or isn't an object, return default
  if (!message.meta || typeof message.meta !== 'object') return defaultValue;
  
  try {
    // Try to get the value
    const value = (message.meta as Record<string, unknown>)[key];
    
    // Return the value if it exists and is of the expected type
    if (value !== undefined && typeof value === typeof defaultValue) {
      return value as T;
    }
  } catch (e) {
    console.error(`Error getting meta value for key ${key}:`, e);
  }
  
  return defaultValue;
}

/**
 * Sets a metadata value on a chat message
 */
export function setChatMeta<T>(
  message: ChatMessage, 
  key: string, 
  value: T
): ChatMessage {
  // Create a new meta object with the existing meta properties
  const updatedMeta = {
    ...(message.meta || {}),
    [key]: value
  };
  
  // Return a new message object with the updated meta
  return {
    ...message,
    meta: updatedMeta
  };
}
