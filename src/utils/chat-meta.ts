
import type { ChatMessage } from '@/types/chat';

/**
 * Check if a chat message has a specific meta field
 */
export function hasChatMeta(chat: ChatMessage, key: string, checkValue?: any): boolean {
  if (!chat.meta) return false;
  
  if (checkValue !== undefined) {
    return chat.meta[key] === checkValue;
  }
  
  return chat.meta[key] !== undefined;
}

/**
 * Get a meta field value from a chat message
 */
export function getChatMeta<T>(chat: ChatMessage, key: string, defaultValue: T): T {
  if (!chat.meta) return defaultValue;
  return chat.meta[key] as T ?? defaultValue;
}

/**
 * Set a meta field on a chat message and return the updated message
 */
export function setChatMeta<T>(chat: ChatMessage, key: string, value: T): ChatMessage {
  return {
    ...chat,
    meta: {
      ...(chat.meta || {}),
      [key]: value
    }
  };
}

/**
 * Remove a meta field from a chat message and return the updated message
 */
export function removeChatMeta(chat: ChatMessage, key: string): ChatMessage {
  if (!chat.meta || !chat.meta[key]) return chat;
  
  const { [key]: _, ...restMeta } = chat.meta;
  
  return {
    ...chat,
    meta: restMeta
  };
}
