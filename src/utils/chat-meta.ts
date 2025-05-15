
import type { ChatMessage, ChatMeta } from '@/types/chat';

/**
 * Safe getter for ChatMeta properties with default value fallback
 */
export function getChatMeta<T>(
  chat: ChatMessage,
  key: keyof ChatMeta,
  defaultValue: T
): T {
  if (!chat.meta) return defaultValue;
  
  const value = chat.meta[key];
  return value === undefined ? defaultValue : value as unknown as T;
}

/**
 * Check if a chat message represents a specific source type
 */
export function isChatSourceType(
  chat: ChatMessage,
  type: 'manual' | 'image' | 'url'
): boolean {
  return chat.source_type === type;
}

/**
 * Format the timestamp for display
 */
export function formatChatTimestamp(chat: ChatMessage): string {
  if (!chat.created_at) return '';
  
  try {
    const date = new Date(chat.created_at);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return '';
  }
}
