
import type { ChatMessage } from '@/types/chat';

/**
 * Helper to check if a chat message has a specific meta property
 */
export function hasChatMeta(chat: ChatMessage, key: string): boolean {
  return !!(chat.meta && chat.meta[key] !== undefined);
}

/**
 * Safe getter for chat meta data with type casting
 */
export function getChatMetaValue<T>(chat: ChatMessage, key: string, defaultValue: T): T {
  if (!chat.meta || chat.meta[key] === undefined) {
    return defaultValue;
  }
  
  try {
    return chat.meta[key] as T;
  } catch (e) {
    console.error(`Error casting meta value for key ${key}:`, e);
    return defaultValue;
  }
}

/**
 * Extract created timestamp from chat message
 */
export function getChatTimestamp(chat: ChatMessage): number {
  // Try to get from meta first
  if (hasChatMeta(chat, 'created_at')) {
    const metaTime = getChatMetaValue<number>(chat, 'created_at', 0);
    if (metaTime > 0) return metaTime;
  }
  
  // Fall back to database timestamp if available
  if (chat.created_at) {
    try {
      return new Date(chat.created_at).getTime();
    } catch (e) {
      // Fall through to ID-based timestamp
    }
  }
  
  // Last resort: try to extract from ID if it follows our convention
  if (chat.id && chat.id.includes('-')) {
    const parts = chat.id.split('-');
    if (parts.length > 1) {
      const possibleTimestamp = parseInt(parts[1], 10);
      if (!isNaN(possibleTimestamp)) return possibleTimestamp;
    }
  }
  
  // If all else fails, return current time
  return Date.now();
}

/**
 * Format chat timestamp for display
 */
export function formatChatTime(chat: ChatMessage): string {
  const timestamp = getChatTimestamp(chat);
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

