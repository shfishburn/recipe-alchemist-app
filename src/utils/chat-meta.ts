
import type { ChatMeta } from '@/types/chat';

/**
 * Extracts a tracking ID from a chat message's meta data
 */
export function getMessageTrackingId(meta?: ChatMeta): string | undefined {
  return meta?.optimistic_id;
}

/**
 * Checks if a message was a retry attempt
 */
export function isRetryMessage(meta?: ChatMeta): boolean {
  return !!meta?.is_retry;
}

/**
 * Creates meta data for a new optimistic message
 */
export function createOptimisticMeta(messageId: string): ChatMeta {
  return {
    optimistic_id: messageId
  };
}
