
import type { ChatMessage } from '@/types/chat';

/**
 * Helper function to safely extract metadata from a chat message
 * @param message The chat message to extract metadata from
 * @param key The metadata key to extract
 * @param defaultValue Default value if key doesn't exist
 * @returns The metadata value or default
 */
export function getChatMeta<T>(
  message: ChatMessage | undefined, 
  key: string, 
  defaultValue: T
): T {
  if (!message || !message.meta) return defaultValue;
  return (message.meta[key] as T) || defaultValue;
}

/**
 * Helper function to check if a message has specific metadata
 * @param message The chat message to check
 * @param key The metadata key to check
 * @returns True if the message has the metadata key
 */
export function hasChatMeta(message: ChatMessage | undefined, key: string): boolean {
  if (!message || !message.meta) return false;
  return message.meta[key] !== undefined;
}

/**
 * Helper function to set metadata on a chat message
 * @param message The chat message to modify (creates a new object)
 * @param key The metadata key to set
 * @param value The value to set
 * @returns A new chat message with the updated metadata
 */
export function setChatMeta<T>(
  message: ChatMessage,
  key: string,
  value: T
): ChatMessage {
  return {
    ...message,
    meta: {
      ...(message.meta || {}),
      [key]: value
    }
  };
}
