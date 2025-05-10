
import type { ChatMessage, ChatMeta } from '@/types/chat';

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
    const value = message.meta[key];
    
    // Return the value if it exists and is not undefined
    if (value !== undefined) {
      // For primitive types like string, number, boolean - we can safely check type
      if (typeof value === typeof defaultValue) {
        return value as T;
      }
      
      // For objects and arrays - we can't easily check type compatibility
      // so we return the value and rely on TypeScript for type safety
      if (typeof defaultValue === 'object' && defaultValue !== null) {
        return value as T;
      }
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
  const updatedMeta: ChatMeta = {
    ...(message.meta || {}),
    [key]: value
  };
  
  // Return a new message object with the updated meta
  return {
    ...message,
    meta: updatedMeta
  };
}

/**
 * Check if a message is an optimistic message based on its metadata
 */
export function isOptimisticMessage(message: ChatMessage): boolean {
  return !!getChatMeta(message, 'optimistic_id', '');
}

/**
 * Get the tracking ID for a message (either optimistic_id or id)
 */
export function getMessageTrackingId(message: ChatMessage): string {
  return getChatMeta(message, 'optimistic_id', '') || message.id || '';
}
