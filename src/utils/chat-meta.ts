
import type { ChatMessage } from '@/types/chat';

/**
 * Helper function to safely extract metadata from chat messages
 */
export const getChatMeta = <T>(
  message: ChatMessage | null | undefined,
  key: string,
  defaultValue: T
): T => {
  if (!message || !message.meta) return defaultValue;
  
  const value = message.meta[key];
  return value !== undefined ? (value as T) : defaultValue;
};
