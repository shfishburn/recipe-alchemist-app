
import type { ChatMessage, OptimisticMessage, ChatMeta } from '@/types/chat';

/**
 * Extracts a tracking ID from a chat message to help identify optimistic/real message pairs
 */
export function getMessageTrackingId(message: ChatMessage | OptimisticMessage | null | undefined): string | null {
  if (!message || !message.meta) return null;
  
  // First try the explicit optimistic_id
  if (message.meta.optimistic_id) return message.meta.optimistic_id;
  
  // Then try the tracking_id
  if (message.meta.tracking_id) return message.meta.tracking_id;
  
  // Fall back to the message id itself
  return message.id || null;
}
