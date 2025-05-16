
import type { ChatMessage, OptimisticMessage, ChatMeta } from '@/types/chat';

// Union type that works with both ChatMessage and OptimisticMessage
type AnyMessageType = ChatMessage | OptimisticMessage | null | undefined;

/**
 * Gets a value from a chat message's meta property with proper type checking
 * @param message Chat message object (can be ChatMessage, OptimisticMessage or null)
 * @param key Meta property key to retrieve
 * @param defaultValue Default value to return if key doesn't exist
 * @returns The value from meta or the default value
 */
export function getChatMeta<T>(
  message: AnyMessageType,
  key: string,
  defaultValue: T
): T {
  if (!message?.meta || typeof message.meta !== 'object') return defaultValue;
  
  try {
    const value = message.meta[key];
    if (value !== undefined && (typeof value === typeof defaultValue || defaultValue === null)) {
      return value as T;
    }
  } catch (e) {
    console.error(`[ChatMeta] Error getting meta value for key ${key}:`, e);
  }
  
  return defaultValue;
}

/**
 * Gets a tracking ID for a chat message, used to identify messages across optimistic and real states
 * @param message Chat message object
 * @returns The tracking ID or null if not available
 */
export function getMessageTrackingId(message: AnyMessageType): string | null {
  // First try to get the tracking ID from meta
  const trackingId = getChatMeta(message, 'tracking_id', null);
  if (trackingId) return trackingId;
  
  // Then try optimistic_id from meta
  const optimisticId = getChatMeta(message, 'optimistic_id', null);
  if (optimisticId) return optimisticId;
  
  // Finally, use the message ID as a fallback
  return message?.id || null;
}
