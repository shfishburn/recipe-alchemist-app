
/**
 * Utility functions for safely accessing chat meta data
 */

import type { ChatMessage } from "@/types/chat";

/**
 * Safely get a value from the meta object of a chat message
 * 
 * @param message The chat message
 * @param key The key to access in the meta object
 * @param defaultValue Default value to return if key doesn't exist
 * @returns The value from meta or defaultValue
 */
export function getChatMeta<T>(
  message: ChatMessage | undefined, 
  key: string,
  defaultValue: T
): T {
  if (!message || !message.meta) {
    return defaultValue;
  }
  
  return (message.meta[key] as T) ?? defaultValue;
}
